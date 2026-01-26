"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { registerSchema, RegisterFormData } from "@/lib/validations/auth"
import { registerUser } from "@/actions/auth"

import { Loader2, User, Mail, MessageCircle, Building2, CreditCard, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react"

export function RegisterForm() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            whatsapp: "",
            clinicName: "",
            cnpj: "",
        },
    })

    // Format CNPJ as user types
    const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "")
        if (value.length > 14) value = value.slice(0, 14)

        // Mask: 00.000.000/0000-00
        if (value.length > 12) {
            value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, "$1.$2.$3/$4-$5")
        } else if (value.length > 8) {
            value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4}).*/, "$1.$2.$3/$4")
        } else if (value.length > 5) {
            value = value.replace(/^(\d{2})(\d{3})(\d{3}).*/, "$1.$2.$3")
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{3}).*/, "$1.$2")
        }

        form.setValue("cnpj", value)
    }

    // Format WhatsApp
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "")
        if (value.length > 11) value = value.slice(0, 11)

        // Mask: (00) 00000-0000
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3")
        } else if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3")
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2")
        }

        form.setValue("whatsapp", value)
    }

    const onSubmit = async (data: RegisterFormData) => {
        setError(null)

        // Remove formatting for API
        const rawData = {
            ...data,
            cnpj: data.cnpj.replace(/\D/g, ""),
            whatsapp: data.whatsapp.replace(/\D/g, ""),
        }

        try {
            const result = await registerUser(rawData)

            if (result.error) {
                setError(result.error)
                return
            }

            setSuccess(true)
            setTimeout(() => {
                router.push("/dashboard")
            }, 2000)
        } catch (err) {
            setError("Ocorreu um erro inesperado. Tente novamente.")
        }
    }

    if (success) {
        return (
            <div className="relative z-10 w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/60 text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Sucesso!</h3>
                    <p className="text-gray-400">Sua clínica foi configurada. Redirecionando para o painel...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative z-10 w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/60">
            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                    <div className="p-1 bg-red-500/20 rounded-full"><span className="text-xs font-bold">!</span></div>
                    {error}
                </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">

                {/* Nome Completo */}
                <div>
                    <label className="sr-only" htmlFor="fullName">Nome Completo</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <User size={20} />
                        </div>
                        <input
                            id="fullName"
                            type="text"
                            placeholder="Nome Completo"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
                            {...form.register("fullName")}
                        />
                    </div>
                    {form.formState.errors.fullName && (
                        <p className="text-red-400 text-xs mt-1 ml-2">{form.formState.errors.fullName.message}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="sr-only" htmlFor="email">Email Profissional</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <Mail size={20} />
                        </div>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email Profissional"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
                            {...form.register("email")}
                        />
                    </div>
                    {form.formState.errors.email && (
                        <p className="text-red-400 text-xs mt-1 ml-2">{form.formState.errors.email.message}</p>
                    )}
                </div>

                {/* WhatsApp */}
                <div>
                    <label className="sr-only" htmlFor="whatsapp">WhatsApp</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <MessageCircle size={20} />
                        </div>
                        <input
                            id="whatsapp"
                            type="tel"
                            placeholder="WhatsApp"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
                            {...form.register("whatsapp")}
                            onChange={(e) => {
                                handlePhoneChange(e)
                            }}
                        />
                    </div>
                    {form.formState.errors.whatsapp && (
                        <p className="text-red-400 text-xs mt-1 ml-2">{form.formState.errors.whatsapp.message}</p>
                    )}
                </div>

                {/* Grid Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nome da Clínica */}
                    <div>
                        <label className="sr-only" htmlFor="clinicName">Nome da Clínica</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <Building2 size={20} />
                            </div>
                            <input
                                id="clinicName"
                                type="text"
                                placeholder="Nome da Clínica"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
                                {...form.register("clinicName")}
                            />
                        </div>
                        {form.formState.errors.clinicName && (
                            <p className="text-red-400 text-xs mt-1 ml-2">{form.formState.errors.clinicName.message}</p>
                        )}
                    </div>

                    {/* CNPJ */}
                    <div>
                        <label className="sr-only" htmlFor="cnpj">CNPJ</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <CreditCard size={20} />
                            </div>
                            <input
                                id="cnpj"
                                type="text"
                                placeholder="CNPJ"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
                                {...form.register("cnpj")}
                                onChange={(e) => {
                                    handleCNPJChange(e)
                                }}
                            />
                        </div>
                        {form.formState.errors.cnpj && (
                            <p className="text-red-400 text-xs mt-1 ml-2">{form.formState.errors.cnpj.message}</p>
                        )}
                    </div>
                </div>

                {/* Senha */}
                <div>
                    <label className="sr-only" htmlFor="password">Senha</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <Lock size={20} />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Senha"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
                            {...form.register("password")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {form.formState.errors.password && (
                        <p className="text-red-400 text-xs mt-1 ml-2">{form.formState.errors.password.message}</p>
                    )}
                </div>

                {/* Terms */}
                <div className="flex items-start mt-2">
                    <div className="flex items-center h-5">
                        <input
                            id="terms"
                            type="checkbox"
                            className="w-4 h-4 border border-white/10 rounded bg-white/5 focus:ring-offset-0 focus:ring-cyan-400 text-cyan-500"
                        />
                    </div>
                    <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
                        Eu concordo com os <a href="#" className="text-cyan-400 hover:text-cyan-300 hover:underline">Termos de Serviço</a> e <a href="#" className="text-cyan-400 hover:text-cyan-300 hover:underline">Política de Privacidade</a>.
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {form.formState.isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Configurando...</span>
                        </>
                    ) : (
                        <>
                            <span>Começar Agora</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}
