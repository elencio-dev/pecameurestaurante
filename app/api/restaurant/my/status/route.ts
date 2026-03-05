import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { cookies } from 'next/headers';
import { RestaurantStatus } from '@prisma/client';

export async function PATCH(req: Request) {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session")?.value;
        if (!sessionToken) return NextResponse.json({ error: "Sessão inválida" }, { status: 401 });

        const session = await verifySession(sessionToken);
        if (!session || session.role !== 'restaurant_owner') {
            return NextResponse.json({ error: "Sessão expirada ou sem permissão" }, { status: 401 });
        }

        const body = await req.json();
        const { status } = body;

        // Validar enum
        if (!Object.values(RestaurantStatus).includes(status)) {
            return NextResponse.json({ error: "Status inválido" }, { status: 400 });
        }

        const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.userId }
        });

        if (!restaurant) return NextResponse.json({ error: "Restaurante não encontrado" }, { status: 404 });

        const updated = await prisma.restaurant.update({
            where: { id: restaurant.id },
            data: { status }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Erro:", error);
        return NextResponse.json({ error: "Falha ao atualizar status." }, { status: 500 });
    }
}
