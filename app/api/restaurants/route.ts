import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const restaurants = await prisma.restaurant.findMany({
            where: {
                // Apenas restaurantes confirmados/ativos na vida real
                // status: "open" // ou remove para mostrar todos
            },
            include: {
                address: true,
            },
        });

        // O tipo do retorno deve casar com o que o Frontend (Restaurant type) espera
        return NextResponse.json(restaurants);
    } catch (error) {
        console.error("Erro ao buscar restaurantes:", error);
        return NextResponse.json({ error: "Falha ao carregar restaurantes" }, { status: 500 });
    }
}
