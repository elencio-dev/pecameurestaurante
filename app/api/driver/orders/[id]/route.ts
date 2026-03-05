import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { cookies } from 'next/headers';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session")?.value;
        if (!sessionToken) return NextResponse.json({ error: "Sessão inválida" }, { status: 401 });

        const session = await verifySession(sessionToken);
        if (!session || session.role !== 'driver') return NextResponse.json({ error: "Sem permissão" }, { status: 401 });

        const body = await req.json();
        const { status, acceptDelivery } = body;

        // Se estiver aceitando a entrega
        if (acceptDelivery) {
            const user = await prisma.user.findUnique({ where: { id: session.userId } });
            const driverName = user ? user.name : "Motorista Parceiro";

            const updatedOrder = await prisma.order.update({
                where: { id },
                data: {
                    driverId: session.userId,
                    driverName: driverName,
                    status: 'picked_up', // Status vai para coletado imediatamente, ou o backend define
                    pickedUpAt: new Date()
                }
            });
            return NextResponse.json(updatedOrder);
        }

        // Se estiver apenas mudando status (Saiu pra entrega, Entregue)
        if (status) {
            const updatedOrder = await prisma.order.update({
                where: { id },
                data: {
                    status,
                    ...(status === 'delivered' ? { deliveredAt: new Date() } : {})
                }
            });
            return NextResponse.json(updatedOrder);
        }

        return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });

    } catch (error) {
        return NextResponse.json({ error: "Falha ao processar." }, { status: 500 });
    }
}
