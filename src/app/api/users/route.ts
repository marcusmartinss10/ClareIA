import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { database } from '@/lib/db';

async function getClinicId(): Promise<string | null> {
    const session = await getSession();
    return session?.clinicId || null;
}

// GET - Listar usuários (dentistas)
export async function GET(request: NextRequest) {
    try {
        const clinicId = await getClinicId();
        if (!clinicId) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');

        let usuarios = await database.users.findByClinic(clinicId);

        // Filtrar por role se especificado
        if (role) {
            usuarios = usuarios.filter(u => u.role === role || (role === 'DENTIST' && u.role === 'ADMIN'));
        }

        // Remover senha dos dados retornados
        const usuariosSeguros = usuarios.map(({ passwordHash, ...rest }) => rest);

        return NextResponse.json({ usuarios: usuariosSeguros });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
