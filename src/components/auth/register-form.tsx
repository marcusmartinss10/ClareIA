"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { registerSchema, RegisterFormData } from "@/lib/validations/auth"
import { registerUser } from "@/actions/auth"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function RegisterForm() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

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
            <Card className="w-full max-w-lg mx-auto border-green-500/20 bg-green-500/5">
                <CardContent className="pt-6 text-center space-y-4">
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-green-700">Cadastro realizado com sucesso!</h3>
                    <p className="text-gray-600">Sua clínica foi configurada. Redirecionando para o painel...</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-lg mx-auto glass-card">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Criar Conta da Clínica</CardTitle>
                <CardDescription className="text-center">
                    Comece a gerenciar seu consultório com inteligência.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md flex items-center gap-2">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <div className="space-y-4">
                            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Dados Pessoais</div>
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome Completo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Dr. Nome Sobrenome" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="email@exemplo.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="whatsapp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>WhatsApp</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="(11) 99999-9999"
                                                    {...field}
                                                    onChange={(e) => {
                                                        handlePhoneChange(e)
                                                        field.onChange(e)
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Senha</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Dados da Clínica</div>

                            <FormField
                                control={form.control}
                                name="clinicName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome da Clínica</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Clínica Sorriso" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="cnpj"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CNPJ</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="00.000.000/0000-00"
                                                {...field}
                                                onChange={(e) => {
                                                    handleCNPJChange(e)
                                                    field.onChange(e)
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" className="w-full mt-6 btn-primary" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Configurando sua clínica...
                                </>
                            ) : (
                                "Criar Conta e Clínica"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="justify-center border-t pt-6">
                <p className="text-sm text-muted-foreground">
                    Já tem uma conta?{" "}
                    <a href="/login" className="text-primary hover:underline font-medium">
                        Entrar
                    </a>
                </p>
            </CardFooter>
        </Card>
    )
}
