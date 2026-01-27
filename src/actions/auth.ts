'use server'

import { createClient } from "@/lib/supabase/server"

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

    // Generate Slug (basic implementation)
    const slug = clinicName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") + "-" + Math.random().toString(36).substring(2, 7)

    // 1. Create Auth User
    // We pass all necessary data in 'options.data' (metadata) so the database trigger can handle 
    // creating the profile, organization, and membership atomically.
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                clinic_name: clinicName,
                cnpj: cnpj,
                whatsapp: whatsapp,
                slug: slug,
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

    // Success - The DB Trigger 'on_auth_user_created' will handle the rest.
    return { success: true }
}
