/**
 * API: Notifications
 * GET /api/notifications - Get user notifications
 * PUT /api/notifications - Mark all as read
 */

import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const unreadOnly = searchParams.get('unread') === 'true';

        // Determine recipient type based on role
        let recipientType = 'dentist';
        if (session.role === 'ADMIN') {
            recipientType = 'admin';
        }

        const notifications = await database.notifications.findByRecipient(
            session.userId,
            recipientType,
            unreadOnly
        );

        const unreadCount = await database.notifications.countUnread(
            session.userId,
            recipientType
        );

        return NextResponse.json({
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar notificações' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        // Determine recipient type based on role
        let recipientType = 'dentist';
        if (session.role === 'ADMIN') {
            recipientType = 'admin';
        }

        await database.notifications.markAllAsRead(session.userId, recipientType);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        return NextResponse.json(
            { error: 'Erro ao marcar notificações' },
            { status: 500 }
        );
    }
}
