import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session")?.value;
        if (!sessionToken) return NextResponse.json({ error: "Sessão inválida" }, { status: 401 });

        const session = await verifySession(sessionToken);
        if (!session || session.role !== 'driver') {
            return NextResponse.json({ error: "Sessão expirada ou sem permissão" }, { status: 401 });
        }

        // Corridas disponíveis: Prontas no restaurante, mas ainda sem motorista
        const availableDeliveries = await prisma.order.findMany({
            where: {
                status: 'ready',
                driverId: null
            },
            include: {
                deliveryAddress: true
            }
        });

        // Corridas deste motorista
        const myDeliveries = await prisma.order.findMany({
            where: {
                driverId: session.userId
            },
            include: {
                deliveryAddress: true
            }
        });

        return NextResponse.json({ availableDeliveries, myDeliveries });
    } catch (error) {
        console.error("Erro:", error);
        return NextResponse.json({ error: "Falha ao carregar corridas." }, { status: 500 });
    }
}
