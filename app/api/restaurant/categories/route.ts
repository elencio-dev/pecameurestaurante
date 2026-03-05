import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { cookies } from 'next/headers';

// Cria uma categoria nova
export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session")?.value;
        if (!sessionToken) return NextResponse.json({ error: "Sessão inválida" }, { status: 401 });

        const session = await verifySession(sessionToken);
        if (!session || session.role !== 'restaurant_owner') return NextResponse.json({ error: "Sem permissão" }, { status: 401 });

        const restaurant = await prisma.restaurant.findFirst({ where: { ownerId: session.userId } });
        if (!restaurant) return NextResponse.json({ error: "Restaurante não encontrado" }, { status: 404 });

        const { name } = await req.json();
        if (!name) return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });

        const newCategory = await prisma.menuCategory.create({
            data: {
                restaurantId: restaurant.id,
                name: name,
                description: "",
                position: 0,
            }
        });

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Falha ao criar." }, { status: 500 });
    }
}
