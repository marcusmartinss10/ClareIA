
import { supabase } from '@/lib/supabase/client';

export interface PlanFeature {
    agenda: 'basic' | 'advanced';
    crm: 'basic' | 'advanced';
    prosthetics: boolean;
    ai_dashboard: boolean;
    multiclinic: boolean;
    whatsapp_limit: number; // -1 for unlimited
}

export interface Plan {
    id: string;
    name: 'ESSENTIAL' | 'PROFESSIONAL' | 'ENTERPRISE';
    price_monthly: number;
    price_yearly: number;
    max_dentists: number | null;
    max_clinics: number | null;
    features: PlanFeature;
}

export interface Subscription {
    id: string;
    clinic_id: string;
    plan_id: string;
    status: 'active' | 'past_due' | 'canceled' | 'trial';
    cycle: 'monthly' | 'yearly';
    start_date: string;
    end_date: string;
    plan?: Plan;
}

export async function getPlans() {
    const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('price_monthly', { ascending: true });

    if (error) throw error;
    return data as Plan[];
}

export async function getOrganizationSubscription(clinicId: string) {
    const { data, error } = await supabase
        .from('subscriptions')
        .select('*, plan:plans(*)')
        .eq('clinic_id', clinicId)
        .single();

    if (error) return null;
    return data as Subscription;
}

export async function checkFeatureAccess(clinicId: string, featureKey: keyof PlanFeature) {
    const sub = await getOrganizationSubscription(clinicId);
    if (!sub || !sub.plan) return false;

    const featureValue = sub.plan.features[featureKey];

    // Logic for boolean features
    if (typeof featureValue === 'boolean') {
        return featureValue;
    }

    // Logic for string levels (basic/advanced) - specific implementation needed based on calling context
    return featureValue;
}
