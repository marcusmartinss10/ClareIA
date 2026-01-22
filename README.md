# 🦷 ClareIA - Sistema de Gestão Odontológica

Sistema moderno de gestão para clínicas odontológicas, construído com Next.js e Supabase.

![ClareIA Dashboard](https://img.shields.io/badge/Status-Em%20Desenvolvimento-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

## ✨ Funcionalidades

### 📅 Agenda Inteligente
- Agendamento de consultas com visualização diária/semanal
- Lembretes automáticos para pacientes
- Gerenciamento de múltiplos profissionais

### 👥 CRM de Pacientes
- Cadastro completo de pacientes
- Prontuário digital integrado
- Histórico clínico e linha do tempo

### ⏱️ Controle de Atendimento
- Timer de consulta (iniciar, pausar, finalizar)
- Registro de procedimentos realizados
- Métricas de produtividade

### 📊 Dashboards Gerenciais
- Estatísticas em tempo real
- Relatórios de performance
- Análise de procedimentos

### 🔗 Integração com Laboratórios
- Envio de pedidos protéticos
- Acompanhamento de status
- Comunicação dentista ↔ protético

### 🔒 Segurança
- Autenticação segura
- Perfis de acesso (Admin, Dentista, Recepcionista)
- Conformidade com LGPD

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+
- Conta no Supabase

### Clone o repositório
```bash
git clone https://github.com/seu-usuario/clareia.git
cd clareia
```

### Instale as dependências
```bash
npm install
```

### Configure as variáveis de ambiente
Copie o arquivo de exemplo e configure suas credenciais:
```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas credenciais do Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

### Configure o banco de dados
Execute o script SQL no Supabase:
```bash
# Copie o conteúdo de supabase-schema.sql
# Cole no SQL Editor do Supabase Dashboard
```

### Inicie o servidor de desenvolvimento
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
clareia/
├── src/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── (auth)/            # Páginas de autenticação
│   │   ├── (dashboard)/       # Páginas do dashboard
│   │   ├── (marketing)/       # Páginas institucionais
│   │   └── api/               # API Routes
│   ├── components/            # Componentes React
│   ├── lib/                   # Bibliotecas e utilitários
│   │   ├── db/               # Camada de banco de dados
│   │   └── supabase/         # Cliente Supabase
│   └── types/                 # Tipos TypeScript
├── public/                    # Arquivos estáticos
└── supabase-schema.sql       # Schema do banco de dados
```

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Gera build de produção
npm run start    # Inicia o servidor de produção
npm run lint     # Executa o linter
```

## 👤 Usuários de Teste

Para testes em desenvolvimento:

| Usuário | Email | Senha | Perfil |
|---------|-------|-------|--------|
| Admin | admin@clinicademo.com | admin123 | ADMIN |
| Dentista | dentista@clinicademo.com | admin123 | DENTIST |
| Recepção | recepcao@clinicademo.com | admin123 | RECEPTIONIST |

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React, TypeScript
- **Estilização**: CSS-in-JS (styled-jsx)
- **Backend**: Next.js API Routes
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Cookies HTTP-only
- **Ícones**: Material Symbols

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie sua Feature Branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a Branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

Desenvolvido com ❤️ por ClareIA Systems
