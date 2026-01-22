import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'ClareIA - Sistema Odontológico Inteligente',
    description: 'Gestão inteligente para clínicas odontológicas. Agenda, prontuário, CRM e controle de produtividade.',
    keywords: 'odontologia, saas, gestão clínica, agenda, prontuário, CRM',
    authors: [{ name: 'ClareIA' }],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
