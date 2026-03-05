import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { cookies } from 'next/headers';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
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

        if (session.role !== 'restaurant_owner' && session.role !== 'driver') {
            return NextResponse.json({ error: "Permissão negada" }, { status: 403 });
        }

        const body = await req.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ error: "Status é obrigatório" }, { status: 400 });
        }

        // Atualiza a Order e cria o registro no Histórico logado
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                status,
                statusHistory: {
                    create: {
                        status,
                    }
                }
            }
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("Erro ao atualizar status do pedido:", error);
        return NextResponse.json({ error: "Falha ao atualizar pedido" }, { status: 500 });
    }
}
