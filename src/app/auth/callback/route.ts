import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get("next") ?? "/dashboard";

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
            const isLocal = origin.includes('localhost');

            // Construct absolute URL
            const redirectUrl = isLocal
                ? `${origin}${next}`
                : `https://${forwardedHost || 'clare-ia-psi.vercel.app'}${next}`;

            // Append verified=true if directing to login
            const finalUrl = new URL(redirectUrl);
            if (next === '/login') {
                finalUrl.searchParams.set('verified', 'true');
            }

            return NextResponse.redirect(finalUrl.toString());
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=auth_code_error`);
}
