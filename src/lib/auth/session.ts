
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Use a distinct secret for auth signing, fallback to service key if specific auth secret is missing
const secretKey = process.env.AUTH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'development_secret_do_not_use_in_prod';
const encodedKey = new TextEncoder().encode(secretKey);

export async function signSession(payload: any) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(encodedKey);
}

export async function verifySession(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export function getSession() {
    const cookieStore = cookies();
    const session = cookieStore.get('session')?.value;
    return verifySession(session);
}

export async function getClinicId() {
    const session = await getSession();
    return session?.clinicId as string | undefined;
}
