import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { message: "Preencha e-mail e senha." },
                { status: 400 }
            );
        }

        // Busca usuário pelo e-mail
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Credenciais inválidas." },
                { status: 401 }
            );
        }

        // Compara as senhas
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Credenciais inválidas." },
                { status: 401 }
            );
        }

        if (!user.isActive) {
            return NextResponse.json(
                { message: "Esta conta está desativada." },
                { status: 403 }
            );
        }

        // Cria a Sessão (Cookie HTTP-Only)
        await createSession(user.id, user.role);

        // Tudo certo, retornamos o usuário (sem a senha)
        return NextResponse.json(
            {
                message: "Login efetuado com sucesso!",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    avatar: user.avatar,
                    createdAt: user.createdAt,
                    isActive: user.isActive,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro no login:", error);
        return NextResponse.json(
            { message: "Erro interno no servidor." },
            { status: 500 }
        );
    }
}
