import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { cookies } from 'next/headers';

function generateOrderNumber() {
    return `#PMR-${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session")?.value;

        if (!sessionToken) {
            return NextResponse.json({ error: "Sessão inválida ou não autenticada." }, { status: 401 });
        }

        const session = await verifySession(sessionToken);
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
        }

        const body = await req.json();
        const { cart, paymentMethod } = body;

        if (!cart || !paymentMethod || cart.items.length === 0) {
            return NextResponse.json({ error: "Carrinho inválido." }, { status: 400 });
        }

        const customer = await prisma.user.findUnique({
            where: { id: session.userId }
        });

        if (!customer) {
            return NextResponse.json({ error: "Cliente não encontrado." }, { status: 404 });
        }

        // Recupera o restaurante para checar tempo estimado, etc
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: cart.restaurantId }
        });

        if (!restaurant) {
            return NextResponse.json({ error: "Restaurante não encontrado." }, { status: 404 });
        }

        const subtotal = cart.items.reduce((sum: number, i: any) => sum + i.menuItem.price * i.quantity, 0);
        const platformFee = 1.00;
        const total = subtotal + cart.deliveryFee + platformFee;

        // Cria o Pedido (Order) e seus Itens na transação Prisma
        const order = await prisma.order.create({
            data: {
                orderNumber: generateOrderNumber(),
                customerId: customer.id,
                customerName: customer.name,
                customerPhone: customer.phone,
                restaurantId: restaurant.id,
                restaurantName: restaurant.name,
                subtotal,
                deliveryFee: cart.deliveryFee,
                platformFee,
                total,
                paymentMethod,
                paymentStatus: "paid", // Simulando pagamento automático
                status: "pending",     // Pendente de aceite do Restaurante
                estimatedDeliveryTime: restaurant.estimatedDeliveryTime,
                statusHistory: {
                    create: {
                        status: "pending",
                    }
                },
                items: {
                    create: cart.items.map((cartItem: any) => ({
                        menuItemId: cartItem.menuItem.id,
                        menuItemName: cartItem.menuItem.name,
                        icon: cartItem.menuItem.icon,
                        quantity: cartItem.quantity,
                        unitPrice: cartItem.menuItem.price,
                        totalPrice: cartItem.menuItem.price * cartItem.quantity
                    }))
                }
            }
        });

        return NextResponse.json(order, { status: 201 });

    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        return NextResponse.json({ error: "Falha ao criar o pedido." }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session")?.value;

        if (!sessionToken) {
            return NextResponse.json({ error: "Sessão inválida" }, { status: 401 });
        }

        const session = await verifySession(sessionToken);
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        // Se for um usuário buscando seus pedidos
        if (session.role === 'customer') {
            const orders = await prisma.order.findMany({
                where: { customerId: session.userId },
                orderBy: { createdAt: 'desc' },
                include: { items: true }
            });
            return NextResponse.json(orders);
        }

        // Se for um restaurante buscando pedidos do restaurante
        if (session.role === 'restaurant_owner') {
            // Precisamos achar qual o ID do restaurante dele
            const restaurant = await prisma.restaurant.findFirst({
                where: { ownerId: session.userId }
            });

            if (!restaurant) {
                return NextResponse.json({ error: "Restaurante não encontrado" }, { status: 404 });
            }

            const orders = await prisma.order.findMany({
                where: { restaurantId: restaurant.id },
                orderBy: { createdAt: 'desc' },
                include: { items: true }
            });
            return NextResponse.json(orders);
        }

        return NextResponse.json({ error: "Permissão negada" }, { status: 403 });

    } catch (error) {
        console.error("Erro ao listar pedidos:", error);
        return NextResponse.json({ error: "Falha ao carregar pedidos" }, { status: 500 });
    }
}

