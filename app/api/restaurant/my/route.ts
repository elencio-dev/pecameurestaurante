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
        if (!session || session.role !== 'restaurant_owner') {
            return NextResponse.json({ error: "Sessão expirada ou sem permissão" }, { status: 401 });
        }

        const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.userId },
            include: {
                menuCategories: { orderBy: { position: 'asc' } },
                menuItems: true
            }
        });

        if (!restaurant) {
            return NextResponse.json({ error: "Restaurante não encontrado" }, { status: 404 });
        }

        return NextResponse.json(restaurant);
    } catch (error) {
        console.error("Erro:", error);
        return NextResponse.json({ error: "Falha ao carregar." }, { status: 500 });
    }
}
