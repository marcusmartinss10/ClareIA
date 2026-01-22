-- =====================================================
-- ClareIA - Schema do Banco de Dados Supabase
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA: clinics (Clínicas)
-- =====================================================
CREATE TABLE IF NOT EXISTS clinics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) UNIQUE,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: plans (Planos de Assinatura)
-- =====================================================
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    features JSONB DEFAULT '[]',
    max_users INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir planos padrão
INSERT INTO plans (name, price, features, max_users) VALUES
    ('Plano Básico', 199.90, '["Até 5 usuários", "Agenda ilimitada", "CRM de pacientes", "Prontuário digital"]', 5),
    ('Plano Profissional', 399.90, '["Até 15 usuários", "Agenda ilimitada", "CRM de pacientes", "Prontuário digital", "Relatórios avançados", "Suporte prioritário"]', 15),
    ('Plano Enterprise', 799.90, '["Usuários ilimitados", "Agenda ilimitada", "CRM de pacientes", "Prontuário digital", "Relatórios avançados", "Suporte 24/7", "API access"]', 999)
ON CONFLICT DO NOTHING;

-- =====================================================
-- TABELA: subscriptions (Assinaturas)
-- =====================================================
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'OVERDUE', 'CANCELLED');

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id),
    status subscription_status DEFAULT 'ACTIVE',
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: users (Usuários)
-- =====================================================
CREATE TYPE user_role AS ENUM ('ADMIN', 'DENTIST', 'RECEPTIONIST');

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'RECEPTIONIST',
    avatar VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: patients (Pacientes)
-- =====================================================
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    cpf VARCHAR(14),
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    birth_date DATE,
    address JSONB DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para busca por nome
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients USING gin(to_tsvector('portuguese', name));
CREATE INDEX IF NOT EXISTS idx_patients_clinic ON patients(clinic_id);

-- =====================================================
-- TABELA: appointments (Agendamentos)
-- =====================================================
CREATE TYPE appointment_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    dentist_id UUID NOT NULL REFERENCES users(id),
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration INTEGER DEFAULT 30, -- em minutos
    reason VARCHAR(255) NOT NULL,
    status appointment_status DEFAULT 'SCHEDULED',
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_clinic_date ON appointments(clinic_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_dentist ON appointments(dentist_id);

-- =====================================================
-- TABELA: consultations (Atendimentos)
-- =====================================================
CREATE TYPE consultation_status AS ENUM ('IN_PROGRESS', 'PAUSED', 'COMPLETED');

CREATE TABLE IF NOT EXISTS consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    dentist_id UUID NOT NULL REFERENCES users(id),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    paused_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    total_time INTEGER DEFAULT 0, -- em segundos
    pause_time INTEGER DEFAULT 0, -- em segundos
    status consultation_status DEFAULT 'IN_PROGRESS',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consultations_clinic ON consultations(clinic_id);
CREATE INDEX IF NOT EXISTS idx_consultations_dentist ON consultations(dentist_id);

-- =====================================================
-- TABELA: medical_records (Prontuários)
-- =====================================================
CREATE TABLE IF NOT EXISTS medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID REFERENCES consultations(id),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    procedures JSONB DEFAULT '[]',
    observations TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_records_patient ON medical_records(patient_id);

-- =====================================================
-- TRIGGERS: Atualização automática de updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clinics_updated_at BEFORE UPDATE ON clinics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) - Isolamento Multi-tenant
-- =====================================================
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- Política para service role (backend tem acesso total)
CREATE POLICY "Service role has full access to clinics" ON clinics
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to subscriptions" ON subscriptions
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to users" ON users
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to patients" ON patients
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to appointments" ON appointments
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to consultations" ON consultations
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to medical_records" ON medical_records
    FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- DADOS DE DEMONSTRAÇÃO
-- =====================================================
-- Criar clínica demo
INSERT INTO clinics (id, name, cnpj, email, phone, address) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Clínica Demonstração', '00.000.000/0001-00', 'contato@clinicademo.com', '(11) 99999-9999', 
    '{"street": "Rua Exemplo", "number": "123", "neighborhood": "Centro", "city": "São Paulo", "state": "SP", "zipCode": "01000-000"}')
ON CONFLICT DO NOTHING;

-- Criar assinatura demo (pegar o ID do plano básico)
INSERT INTO subscriptions (clinic_id, plan_id, status, end_date)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    p.id,
    'ACTIVE',
    NOW() + INTERVAL '30 days'
FROM plans p WHERE p.name = 'Plano Básico'
ON CONFLICT DO NOTHING;

-- Criar usuários demo (senha: admin123)
-- Hash bcrypt para 'admin123': $2a$10$j7CxC6gFcG.QWKufmq/kyuo93Fn7BWEsCRtA5X7oX15FvjLkuQo2i
INSERT INTO users (id, clinic_id, name, email, password_hash, role) VALUES
    ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'Administrador', 'admin@clinicademo.com', '$2a$10$j7CxC6gFcG.QWKufmq/kyuo93Fn7BWEsCRtA5X7oX15FvjLkuQo2i', 'ADMIN'),
    ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'Dr. João Silva', 'dentista@clinicademo.com', '$2a$10$j7CxC6gFcG.QWKufmq/kyuo93Fn7BWEsCRtA5X7oX15FvjLkuQo2i', 'DENTIST'),
    ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'Maria Santos', 'recepcao@clinicademo.com', '$2a$10$j7CxC6gFcG.QWKufmq/kyuo93Fn7BWEsCRtA5X7oX15FvjLkuQo2i', 'RECEPTIONIST')
ON CONFLICT DO NOTHING;

-- Criar pacientes demo
INSERT INTO patients (id, clinic_id, name, cpf, phone, email, birth_date) VALUES
    ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000001', 'Carlos Oliveira', '111.222.333-44', '(11) 98888-7777', 'carlos@email.com', '1985-06-15'),
    ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000001', 'Ana Paula Souza', '222.333.444-55', '(11) 97777-6666', 'ana@email.com', '1990-03-20'),
    ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000001', 'Roberto Ferreira', '333.444.555-66', '(11) 96666-5555', NULL, '1978-11-08')
ON CONFLICT DO NOTHING;

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================
