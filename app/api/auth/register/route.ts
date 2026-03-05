import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { UserRole } from "@/types";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, phone, role, restaurantData } = body;

        if (!name || !email || !password || !phone || !role) {
            return NextResponse.json(
                { message: "Dados incompletos." },
                { status: 400 }
            );
        }

        // Verifica se já existe um usuário com esse email
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "E-mail já está em uso." },
                { status: 400 }
            );
        }

        // Faz o hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria o usuário principal
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                role: role as UserRole,
            },
        });

        // Se for um restaurante, cria as entidades Restaurant e Address
        if (role === "restaurant_owner" && restaurantData) {
            const {
                restaurantName,
                cnpj,
                category,
                street,
                number,
                complement,
                neighborhood,
                city,
                state,
                zipCode,
                lat,
                lng,
            } = restaurantData;

            // Gera um slug simples baseado no nome do restaurante
            const slug = restaurantName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4);

            await prisma.restaurant.create({
                data: {
                    ownerId: newUser.id,
                    name: restaurantName,
                    slug,
                    description: "Bem-vindo ao nosso restaurante!", // Descrição padrão
                    category: category || "Brasileiro",
                    categories: category ? [category] : ["Brasileiro"],
                    logo: "/images/misc/hero-pizza.png", // Logo padrão provisória
                    phone: phone, // Usa o mesmo telefone do dono
                    email: email, // Usa o mesmo email do dono
                    cnpj,
                    estimatedDeliveryTime: 40,
                    minimumOrder: 20.0,
                    deliveryFee: 5.0,
                    deliveryRadiusKm: 5.0,
                    openingHours: [
                        { dayOfWeek: 0, open: "18:00", close: "23:00", isOpen: true },
                        { dayOfWeek: 1, open: "18:00", close: "23:00", isOpen: false },
                        { dayOfWeek: 2, open: "18:00", close: "23:00", isOpen: true },
                        { dayOfWeek: 3, open: "18:00", close: "23:00", isOpen: true },
                        { dayOfWeek: 4, open: "18:00", close: "23:00", isOpen: true },
                        { dayOfWeek: 5, open: "18:00", close: "23:00", isOpen: true },
                        { dayOfWeek: 6, open: "18:00", close: "23:00", isOpen: true },
                    ],
                    address: {
                        create: {
                            label: "Principal",
                            street,
                            number,
                            complement: complement || "",
                            neighborhood,
                            city,
                            state,
                            zipCode,
                            lat: lat || null,
                            lng: lng || null,
                        },
                    },
                },
            });
        }

        // Cria a Sessão (Cookie HTTP-Only) para já logar o novo usuário
        await createSession(newUser.id, newUser.role);

        return NextResponse.json(
            {
                message: "Conta criada com sucesso!",
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro no registro:", error);
        return NextResponse.json(
            { message: "Erro interno no servidor." },
            { status: 500 }
        );
    }
}
