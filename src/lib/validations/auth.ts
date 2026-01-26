import * as z from "zod"

export const registerSchema = z.object({
    fullName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    whatsapp: z.string().min(10, "WhatsApp inválido"),
    clinicName: z.string().min(3, "Nome da clínica deve ter pelo menos 3 caracteres"),
    cnpj: z.string().min(14, "CNPJ inválido").regex(/^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/, "Formato de CNPJ inválido"),
})

export type RegisterFormData = z.infer<typeof registerSchema>
