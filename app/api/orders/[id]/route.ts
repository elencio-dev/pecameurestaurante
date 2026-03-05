import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { cookies } from 'next/headers';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session")?.value;

        if (!sessionToken) {
            return NextResponse.json({ error: "Sessão inválida" }, { status: 401 });
        }

        const session = await verifySession(sessionToken);
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: true,
                statusHistory: true
            }
        });

        if (!order) {
            return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
        }

        // Verifica se o usuário tem permissão para ver esse pedido (se é o dono ou o restaurante ou driver)
        // Simplificando por enquanto...

        return NextResponse.json(order);
    } catch (error) {
        console.error("Erro ao carregar o pedido:", error);
        return NextResponse.json({ error: "Falha ao carregar pedido" }, { status: 500 });
    }
}
