/**
 * API: Laboratories
 * GET /api/laboratories - List laboratories
 * POST /api/laboratories - Create laboratory
 */

import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/db';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const laboratories = await database.laboratories.findByClinic(session.clinicId);

        // Return safe data (without password)
        const safeLabList = laboratories.map((lab: any) => ({
            id: lab.id,
            name: lab.name,
            responsibleName: lab.responsibleName,
            email: lab.email,
            phone: lab.phone,
            specialties: lab.specialties || [],
            address: lab.address,
            active: lab.active,
            createdAt: lab.createdAt,
        }));

        return NextResponse.json({ laboratories: safeLabList });
    } catch (error) {
        console.error('Error fetching laboratories:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar laboratórios' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        // Only admins can create laboratories
        if (session.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Apenas administradores podem cadastrar laboratórios' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { name, responsibleName, email, phone, password, specialties, address } = body;

        if (!name || !email) {
            return NextResponse.json(
                { error: 'Nome e email são obrigatórios' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existing = await database.laboratories.findByEmail(email);
        if (existing) {
            return NextResponse.json(
                { error: 'Email já cadastrado' },
                { status: 400 }
            );
        }

        // Hash password if provided
        let passwordHash = undefined;
        if (password) {
            passwordHash = await bcrypt.hash(password, 10);
        }

        const laboratory = await database.laboratories.create({
            clinicId: session.clinicId,
            name,
            responsibleName,
            email,
            phone,
            passwordHash,
            specialties: specialties || [],
            address: address || {},
            active: true,
        });

        return NextResponse.json({ laboratory }, { status: 201 });
    } catch (error) {
        console.error('Error creating laboratory:', error);
        return NextResponse.json(
            { error: 'Erro ao cadastrar laboratório' },
            { status: 500 }
        );
    }
}
