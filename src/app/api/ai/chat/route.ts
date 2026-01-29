import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// System prompt for the dental assistant
const SYSTEM_PROMPT = `Você é a ClareIA, uma assistente de IA integrada ao sistema ClareIA - um SaaS para gestão de clínicas odontológicas.

Seu papel é:
1. Ajudar os usuários a navegar e usar o sistema
2. Responder dúvidas sobre funcionalidades
3. Fornecer insights sobre dados da clínica quando solicitado
4. Dar sugestões para melhorar a gestão da clínica

Você tem acesso ao contexto da página atual do usuário e pode usar as informações do banco de dados fornecidas para responder perguntas específicas.

Seja sempre:
- Amigável e profissional
- Conciso nas respostas (máximo 3-4 parágrafos)
- Proativo em sugerir ações relevantes
- Use emojis ocasionalmente para ser mais amigável 😊

Quando o usuário perguntar sobre dados, use APENAS as informações que foram fornecidas no contexto. Não invente números.

Se não souber algo ou não tiver acesso aos dados necessários, seja honesto e diga que não tem essa informação no momento.`;

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

async function getClinicContext(supabase: any, clinicId: string, currentPage: string) {
    const context: string[] = [];
    const today = new Date().toISOString().split('T')[0];

    try {
        // Get today's appointments count
        const { count: todayAppointments } = await supabase
            .from('appointments')
            .select('id', { count: 'exact', head: true })
            .eq('organization_id', clinicId)
            .gte('scheduled_at', `${today}T00:00:00`)
            .lte('scheduled_at', `${today}T23:59:59`);

        context.push(`📅 Agendamentos hoje: ${todayAppointments || 0}`);

        // Get pending appointments
        const { count: pendingAppointments } = await supabase
            .from('appointments')
            .select('id', { count: 'exact', head: true })
            .eq('organization_id', clinicId)
            .eq('status', 'PENDING')
            .gte('scheduled_at', today);

        context.push(`⏳ Agendamentos pendentes: ${pendingAppointments || 0}`);

        // Get total patients
        const { count: totalPatients } = await supabase
            .from('patients')
            .select('id', { count: 'exact', head: true })
            .eq('organization_id', clinicId);

        context.push(`👥 Total de pacientes: ${totalPatients || 0}`);

        // Get this month's revenue if we have consultations
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
        const { data: monthConsultations } = await supabase
            .from('consultations')
            .select('payment_amount')
            .eq('organization_id', clinicId)
            .gte('started_at', startOfMonth);

        if (monthConsultations) {
            const revenue = monthConsultations.reduce((sum: number, c: any) => sum + (c.payment_amount || 0), 0);
            context.push(`💰 Faturamento do mês: R$ ${revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
        }

        // Add page-specific context
        context.push(`\n📍 Página atual do usuário: ${currentPage}`);

    } catch (error) {
        console.error('Error fetching clinic context:', error);
    }

    return context.join('\n');
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Get user and clinic
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { data: member } = await supabase
            .from('organization_members')
            .select('organization_id, role')
            .eq('user_id', user.id)
            .single();

        if (!member) {
            return NextResponse.json({ error: 'Clínica não encontrada' }, { status: 404 });
        }

        const body = await request.json();
        const { messages, currentPage }: { messages: Message[]; currentPage: string } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Mensagens inválidas' }, { status: 400 });
        }

        // Get clinic context
        const clinicContext = await getClinicContext(supabase, member.organization_id, currentPage);

        // Build messages for OpenAI
        const systemMessage = `${SYSTEM_PROMPT}

--- CONTEXTO DA CLÍNICA ---
${clinicContext}
--- FIM DO CONTEXTO ---`;

        const openaiMessages = [
            { role: 'system', content: systemMessage },
            ...messages.map(m => ({ role: m.role, content: m.content }))
        ];

        // Check for OpenAI API key
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            // Return a mock response if no API key
            return NextResponse.json({
                message: {
                    role: 'assistant',
                    content: `Olá! 👋 Sou a ClareIA, sua assistente virtual.

⚠️ **Configuração necessária**: A API da OpenAI ainda não está configurada. Para ativar a IA, adicione a variável \`OPENAI_API_KEY\` nas variáveis de ambiente do Vercel.

Enquanto isso, posso te ajudar com informações básicas:
${clinicContext}

Precisa de ajuda para configurar? 🛠️`
                }
            });
        }

        // Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4-turbo-preview',
                messages: openaiMessages,
                temperature: 0.7,
                max_tokens: 500,
                stream: false
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('OpenAI API error:', error);
            return NextResponse.json({
                message: {
                    role: 'assistant',
                    content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente. 😅'
                }
            });
        }

        const data = await response.json();
        const assistantMessage = data.choices[0]?.message?.content || 'Não consegui gerar uma resposta.';

        return NextResponse.json({
            message: {
                role: 'assistant',
                content: assistantMessage
            }
        });

    } catch (error) {
        console.error('Error in AI chat:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
