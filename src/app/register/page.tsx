import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
            <div className="mb-8 text-center">
                <Link href="/" className="inline-block">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        ClareIA
                    </h1>
                </Link>
            </div>
            <RegisterForm />
            <div className="mt-8 text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} ClareIA Systems. Todos os direitos reservados.</p>
            </div>
        </div>
    )
}
