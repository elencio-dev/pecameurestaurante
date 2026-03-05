import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;

        const restaurant = await prisma.restaurant.findUnique({
            where: { id },
            include: {
                address: true,
                menuCategories: {
                    where: { isActive: true },
                    orderBy: { position: 'asc' }
                },
                menuItems: {
                    where: { isAvailable: true }
                }
            },
        });

        if (!restaurant) {
            return NextResponse.json({ error: "Restaurante não encontrado" }, { status: 404 });
        }

        return NextResponse.json({
            restaurant,
            categories: restaurant.menuCategories,
            menuItems: restaurant.menuItems
        });
    } catch (error) {
        console.error("Erro ao buscar detalhes do restaurante:", error);
        return NextResponse.json({ error: "Falha ao carregar restaurante" }, { status: 500 });
    }
}
