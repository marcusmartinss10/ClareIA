// Status de assinatura
export type SubscriptionStatus = 'ACTIVE' | 'OVERDUE' | 'CANCELLED';

// Perfis de usuário
export type UserRole = 'ADMIN' | 'DENTIST' | 'RECEPTIONIST';

// Status de agendamento
export type AppointmentStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

// Status de atendimento
export type ConsultationStatus = 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED';

// Clínica
export interface Clinic {
    id: string;
    name: string;
    cnpj: string;
    email: string;
    phone: string;
    address: {
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

// Plano
export interface Plan {
    id: string;
    name: string;
    price: number;
    features: string[];
    maxUsers: number;
    createdAt: Date;
}

// Assinatura
export interface Subscription {
    id: string;
    clinicId: string;
    planId: string;
    status: SubscriptionStatus;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Usuário
export interface User {
    id: string;
    clinicId: string;
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Usuário sem senha (para frontend)
export type SafeUser = Omit<User, 'passwordHash'>;

// Paciente
export interface Patient {
    id: string;
    clinicId: string;
    name: string;
    cpf: string;
    email?: string;
    phone: string;
    birthDate: Date;
    address?: {
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
    };
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Agendamento
export type PaymentMethod = 'CASH' | 'CARD' | 'PIX' | 'DENTAL_PLAN';

export interface Appointment {
    id: string;
    clinicId: string;
    patientId: string;
    dentistId: string;
    scheduledAt: Date;
    duration: number; // em minutos
    reason: string;
    status: AppointmentStatus;
    adminNotes?: string;
    paymentMethod?: PaymentMethod;
    createdAt: Date;
    updatedAt: Date;
}

// Atendimento
export interface Consultation {
    id: string;
    appointmentId: string;
    clinicId: string;
    patientId: string;
    dentistId: string;
    startedAt: Date;
    pausedAt?: Date;
    endedAt?: Date;
    totalTime: number; // em segundos
    pauseTime: number; // em segundos
    totalPausedTime?: number; // em segundos
    status: ConsultationStatus;
    paymentAmount?: number; // valor cobrado
    createdAt: Date;
    updatedAt: Date;
}

// Prontuário
export interface MedicalRecord {
    id: string;
    consultationId: string;
    clinicId: string;
    patientId: string;
    procedures: {
        name: string;
        tooth?: string;
        notes?: string;
    }[];
    observations?: string;
    createdAt: Date;
}

// Tipos para API responses
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// Tipos para sessão
export interface SessionUser {
    id: string;
    clinicId: string;
    name: string;
    email: string;
    role: UserRole;
    subscriptionStatus: SubscriptionStatus;
}

// ================================
// MÓDULO: Pedidos ao Protético
// ================================

// Status de pedido protético
export type ProstheticOrderStatus =
    | 'pending'      // Aguardando
    | 'received'     // Recebido
    | 'analysis'     // Em Análise
    | 'production'   // Em Produção
    | 'assembly'     // Em Montagem
    | 'adjustment'   // Ajuste Necessário
    | 'ready'        // Pronto
    | 'delivered';   // Entregue

// Tipo de trabalho
export type WorkType =
    | 'crown'              // Coroa
    | 'partial_prosthesis' // Prótese Parcial
    | 'total_prosthesis'   // Prótese Total
    | 'veneer'             // Faceta
    | 'implant'            // Implante
    | 'bridge'             // Ponte
    | 'other';             // Outro

// Urgência
export type OrderUrgency = 'normal' | 'urgent' | 'express';

// Tipo de anexo
export type AttachmentType = 'xray' | 'photo' | 'scan' | 'document';

// Protético (Técnico em Prótese)
export interface Protetico {
    id: string;
    clinicId: string;
    name: string;
    laboratoryName?: string;
    email: string;
    phone?: string;
    specialties: string[];
    passwordHash: string;
    avatar?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Protético sem senha (para frontend)
export type SafeProtetico = Omit<Protetico, 'passwordHash'>;

// Pedido Protético
export interface ProstheticOrder {
    id: string;
    clinicId: string;
    patientId: string;
    dentistId: string;
    proteticoId?: string;
    consultationId?: string;

    // Tipo de trabalho
    workType: WorkType;
    workTypeCustom?: string;

    // Detalhes técnicos
    material?: string;
    shade?: string;
    toothNumbers?: string;
    observations?: string;

    // Urgência e prazo
    urgency: OrderUrgency;
    deadline?: Date;

    // Status
    status: ProstheticOrderStatus;

    createdAt: Date;
    updatedAt: Date;

    // Populated fields (optional)
    patient?: Patient;
    dentist?: SafeUser;
    protetico?: SafeProtetico;
}

// Anexo de pedido
export interface ProstheticOrderAttachment {
    id: string;
    orderId: string;
    fileName: string;
    fileType: AttachmentType;
    fileUrl: string;
    fileSize?: number;
    uploadedBy: string;
    createdAt: Date;
}

// Histórico de status
export interface ProstheticOrderHistory {
    id: string;
    orderId: string;
    previousStatus?: ProstheticOrderStatus;
    newStatus: ProstheticOrderStatus;
    changedByType: 'dentist' | 'protetico' | 'system';
    changedById?: string;
    notes?: string;
    createdAt: Date;
}

// Comentário de pedido
export interface ProstheticOrderComment {
    id: string;
    orderId: string;
    authorType: 'dentist' | 'protetico';
    authorId: string;
    message: string;
    createdAt: Date;

    // Populated field (optional)
    author?: SafeUser | SafeProtetico;
}

// Helper: Labels de status em português
export const ProstheticStatusLabels: Record<ProstheticOrderStatus, string> = {
    pending: 'Aguardando',
    received: 'Recebido',
    analysis: 'Em Análise',
    production: 'Em Produção',
    assembly: 'Em Montagem',
    adjustment: 'Ajuste Necessário',
    ready: 'Pronto',
    delivered: 'Entregue',
};

// Helper: Labels de tipo de trabalho em português
export const WorkTypeLabels: Record<WorkType, string> = {
    crown: 'Coroa',
    partial_prosthesis: 'Prótese Parcial',
    total_prosthesis: 'Prótese Total',
    veneer: 'Faceta',
    implant: 'Implante',
    bridge: 'Ponte',
    other: 'Outro',
};

// Helper: Labels de urgência em português
export const UrgencyLabels: Record<OrderUrgency, string> = {
    normal: 'Normal',
    urgent: 'Urgente',
    express: 'Expresso',
};

// Notificações
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
    id: string;
    userId: string;
    clinicId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
    read: boolean;
    createdAt: Date;
    readAt?: Date;
}
