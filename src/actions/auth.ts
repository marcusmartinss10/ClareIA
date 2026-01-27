'use server'

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { registerSchema, RegisterFormData } from "@/lib/validations/auth"
import { redirect } from "next/navigation"

export async function registerUser(formData: RegisterFormData) {
    // Validate data
    const result = registerSchema.safeParse(formData)

    if (!result.success) {
        return { error: "Dados inválidos. Verifique os campos e tente novamente." }
    }

    const { email, password, fullName, whatsapp, clinicName, cnpj } = result.data

    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    // 1. Create Auth User
    // We use the regular client so cookies/session handling works naturally for the user check
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
            emailRedirectTo: 'https://clare-ia-psi.vercel.app/auth/callback',
        },
    })

    if (authError) {
        console.error("Auth error:", authError)
        return { error: authError.message }
    }

    if (!authData.user) {
        return { error: "Erro ao criar usuário." }
    }

    const userId = authData.user.id

    // Generate Slug (basic implementation)
    const slug = clinicName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") + "-" + Math.random().toString(36).substring(2, 7)

    // 2. Provision Data (Profiles, Organization, Member) using Admin Client
    try {
        // Create Profile
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert({
                id: userId,
                full_name: fullName,
                email: email,
                whatsapp: whatsapp,
            })

        if (profileError) {
            // If profile exists (rare race condition or retry), we might ignore or throw
            if (!profileError.message.includes('duplicate key')) throw profileError
        }

        // Create Organization
        const { data: orgData, error: orgError } = await supabaseAdmin
            .from('organizations')
            .insert({
                name: clinicName,
                cnpj: cnpj,
                slug: slug,
            })
            .select()
            .single()

        if (orgError) throw orgError

        // Create Member
        const { error: memberError } = await supabaseAdmin
            .from('organization_members')
            .insert({
                organization_id: orgData.id,
                user_id: userId,
                role: 'owner',
            })

        if (memberError) throw memberError

    } catch (error: any) {
        console.error("Registration provisioning error FULL OBJECT:", JSON.stringify(error, null, 2))
        console.error("Registration provisioning error MESSAGE:", error?.message)
        // Ideally we would delete the auth user here to "rollback"
        return { error: "Erro ao configurar a conta da clínica. Por favor, tente novamente ou contate o suporte." }
    }

    // If successful, we return success.
    // The client will handle the redirect to /dashboard
    return { success: true }
}
