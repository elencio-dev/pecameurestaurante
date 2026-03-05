import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { cookies } from 'next/headers';

// Edita ou Ativa/Inativa um Item
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session")?.value;
        if (!sessionToken) return NextResponse.json({ error: "Sessão inválida" }, { status: 401 });

        const session = await verifySession(sessionToken);
        if (!session || session.role !== 'restaurant_owner') return NextResponse.json({ error: "Sem permissão" }, { status: 401 });

        const body = await req.json();

        // Remove undefined para não sobrescrever
        const dataToUpdate: any = {};
        if (body.price !== undefined) dataToUpdate.price = Number(body.price);
        if (body.isAvailable !== undefined) dataToUpdate.isAvailable = Boolean(body.isAvailable);
        if (body.name !== undefined) dataToUpdate.name = body.name;

        const updatedItem = await prisma.menuItem.update({
            where: { id },
            data: dataToUpdate
        });

        return NextResponse.json(updatedItem, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Falha ao editar item." }, { status: 500 });
    }
}
