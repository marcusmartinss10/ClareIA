
import { NextResponse } from 'next/server';
import { getClinicId } from '@/lib/auth/session';
import { getOrganizationSubscription } from '@/lib/plans';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const clinicId = await getClinicId();

        if (!clinicId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const subscription = await getOrganizationSubscription(clinicId);

        // If no subscription found, return 404 or a default 'free/trial' state?
        // For now, return null in JSON which means no active subscription
        return NextResponse.json(subscription || { status: 'none', plan: null });
    } catch (error) {
        console.error('Error fetching subscription:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subscription' },
            { status: 500 }
        );
    }
}
