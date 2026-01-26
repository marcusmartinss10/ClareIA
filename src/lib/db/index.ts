/**
 * ClareIA Database - Supabase Implementation
 * Conexão real com banco de dados PostgreSQL via Supabase
 */

import { supabaseAdmin } from '@/lib/supabase/client';
import type {
    Clinic,
    Plan,
    Subscription,
    User,
    Patient,
    Appointment,
    Consultation,
    MedicalRecord,
} from '@/types';

// Helper para converter snake_case para camelCase
function toCamelCase<T>(obj: any): T {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(item => toCamelCase(item)) as any;

    const newObj: any = {};
    for (const key in obj) {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        newObj[camelKey] = toCamelCase(obj[key]);
    }
    return newObj;
}

// Helper para converter camelCase para snake_case
function toSnakeCase(obj: any): any {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(item => toSnakeCase(item));
    if (obj instanceof Date) return obj.toISOString();

    const newObj: any = {};
    for (const key in obj) {
        const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        newObj[snakeKey] = toSnakeCase(obj[key]);
    }
    return newObj;
}

// Database operations
export const database = {
    // Clinics
    clinics: {
        findById: async (id: string): Promise<Clinic | null> => {
            const { data, error } = await supabaseAdmin
                .from('clinics')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) return null;
            return toCamelCase<Clinic>(data);
        },

        create: async (data: Omit<Clinic, 'id' | 'createdAt' | 'updatedAt'>): Promise<Clinic> => {
            const { data: clinic, error } = await supabaseAdmin
                .from('clinics')
                .insert(toSnakeCase(data))
                .select()
                .single();

            if (error) throw new Error(error.message);
            return toCamelCase<Clinic>(clinic);
        },
    },

    // Users
    users: {
        findById: async (id: string): Promise<User | null> => {
            const { data, error } = await supabaseAdmin
                .from('users')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) return null;
            return toCamelCase<User>(data);
        },

        findByEmail: async (email: string): Promise<User | null> => {
            const { data, error } = await supabaseAdmin
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error || !data) return null;
            return toCamelCase<User>(data);
        },

        findByClinic: async (clinicId: string): Promise<User[]> => {
            const { data, error } = await supabaseAdmin
                .from('users')
                .select('*')
                .eq('clinic_id', clinicId);

            if (error || !data) return [];
            return data.map(u => toCamelCase<User>(u));
        },

        create: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
            const { data: user, error } = await supabaseAdmin
                .from('users')
                .insert(toSnakeCase(data))
                .select()
                .single();

            if (error) throw new Error(error.message);
            return toCamelCase<User>(user);
        },

        update: async (id: string, data: Partial<User>): Promise<User | null> => {
            const { data: user, error } = await supabaseAdmin
                .from('users')
                .update(toSnakeCase(data))
                .eq('id', id)
                .select()
                .single();

            if (error) return null;
            return toCamelCase<User>(user);
        },

        delete: async (id: string): Promise<boolean> => {
            const { error } = await supabaseAdmin
                .from('users')
                .delete()
                .eq('id', id);

            return !error;
        },
    },

    // Subscriptions
    subscriptions: {
        findByClinic: async (clinicId: string): Promise<Subscription | null> => {
            const { data, error } = await supabaseAdmin
                .from('subscriptions')
                .select('*')
                .eq('clinic_id', clinicId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error || !data) return null;
            return toCamelCase<Subscription>(data);
        },
    },

    // Patients
    patients: {
        findById: async (id: string): Promise<Patient | null> => {
            const { data, error } = await supabaseAdmin
                .from('patients')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) return null;
            return toCamelCase<Patient>(data);
        },

        findByClinic: async (clinicId: string): Promise<Patient[]> => {
            const { data, error } = await supabaseAdmin
                .from('patients')
                .select('*')
                .eq('clinic_id', clinicId)
                .order('name');

            if (error || !data) return [];
            return data.map(p => toCamelCase<Patient>(p));
        },

        search: async (clinicId: string, query: string): Promise<Patient[]> => {
            const { data, error } = await supabaseAdmin
                .from('patients')
                .select('*')
                .eq('clinic_id', clinicId)
                .or(`name.ilike.%${query}%,cpf.ilike.%${query}%,phone.ilike.%${query}%`)
                .order('name');

            if (error || !data) return [];
            return data.map(p => toCamelCase<Patient>(p));
        },

        create: async (data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> => {
            const { data: patient, error } = await supabaseAdmin
                .from('patients')
                .insert(toSnakeCase(data))
                .select()
                .single();

            if (error) throw new Error(error.message);
            return toCamelCase<Patient>(patient);
        },

        update: async (id: string, data: Partial<Patient>): Promise<Patient | null> => {
            const { data: patient, error } = await supabaseAdmin
                .from('patients')
                .update(toSnakeCase(data))
                .eq('id', id)
                .select()
                .single();

            if (error) return null;
            return toCamelCase<Patient>(patient);
        },

        delete: async (id: string): Promise<boolean> => {
            const { error } = await supabaseAdmin
                .from('patients')
                .delete()
                .eq('id', id);

            return !error;
        },
    },

    // Appointments
    appointments: {
        findById: async (id: string): Promise<Appointment | null> => {
            const { data, error } = await supabaseAdmin
                .from('appointments')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) return null;
            return toCamelCase<Appointment>(data);
        },

        findByClinic: async (clinicId: string): Promise<Appointment[]> => {
            const { data, error } = await supabaseAdmin
                .from('appointments')
                .select('*')
                .eq('clinic_id', clinicId)
                .order('scheduled_at', { ascending: false });

            if (error || !data) return [];
            return data.map(a => toCamelCase<Appointment>(a));
        },

        findByDate: async (clinicId: string, date: Date): Promise<Appointment[]> => {
            // Usar a data como string para evitar problemas de timezone
            // Buscar todos agendamentos e filtrar pela data local
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

            // Criar range do dia em UTC considerando timezone Brasil (-03:00)
            // Dia começa às 03:00 UTC (00:00 em Brasília) e termina às 02:59:59 UTC do dia seguinte
            const startUTC = `${dateStr}T03:00:00.000Z`;
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            const endDateStr = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
            const endUTC = `${endDateStr}T02:59:59.999Z`;



            const { data, error } = await supabaseAdmin
                .from('appointments')
                .select('*')
                .eq('clinic_id', clinicId)
                .gte('scheduled_at', startUTC)
                .lte('scheduled_at', endUTC)
                .order('scheduled_at');

            if (error) {
                return [];
            }
            if (!data) return [];
            return data.map(a => toCamelCase<Appointment>(a));
        },

        findByDateRange: async (clinicId: string, start: Date, end: Date): Promise<Appointment[]> => {
            const { data, error } = await supabaseAdmin
                .from('appointments')
                .select('*')
                .eq('clinic_id', clinicId)
                .gte('scheduled_at', start.toISOString())
                .lte('scheduled_at', end.toISOString())
                .order('scheduled_at');

            if (error || !data) return [];
            return data.map(a => toCamelCase<Appointment>(a));
        },

        create: async (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> => {
            const { data: appointment, error } = await supabaseAdmin
                .from('appointments')
                .insert(toSnakeCase(data))
                .select()
                .single();

            if (error) throw new Error(error.message);
            return toCamelCase<Appointment>(appointment);
        },

        update: async (id: string, data: Partial<Appointment>): Promise<Appointment | null> => {
            const { data: appointment, error } = await supabaseAdmin
                .from('appointments')
                .update(toSnakeCase(data))
                .eq('id', id)
                .select()
                .single();

            if (error) return null;
            return toCamelCase<Appointment>(appointment);
        },

        delete: async (id: string): Promise<boolean> => {
            const { error } = await supabaseAdmin
                .from('appointments')
                .delete()
                .eq('id', id);

            return !error;
        },
    },

    // Consultations
    consultations: {
        findById: async (id: string): Promise<Consultation | null> => {
            const { data, error } = await supabaseAdmin
                .from('consultations')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) return null;
            return toCamelCase<Consultation>(data);
        },

        findByAppointment: async (appointmentId: string): Promise<Consultation | null> => {
            const { data, error } = await supabaseAdmin
                .from('consultations')
                .select('*')
                .eq('appointment_id', appointmentId)
                .single();

            if (error || !data) return null;
            return toCamelCase<Consultation>(data);
        },

        findByClinic: async (clinicId: string): Promise<Consultation[]> => {
            const { data, error } = await supabaseAdmin
                .from('consultations')
                .select('*')
                .eq('clinic_id', clinicId)
                .order('started_at', { ascending: false });

            if (error || !data) return [];
            return data.map(c => toCamelCase<Consultation>(c));
        },

        findByDentist: async (dentistId: string): Promise<Consultation[]> => {
            const { data, error } = await supabaseAdmin
                .from('consultations')
                .select('*')
                .eq('dentist_id', dentistId)
                .order('started_at', { ascending: false });

            if (error || !data) return [];
            return data.map(c => toCamelCase<Consultation>(c));
        },

        create: async (data: Omit<Consultation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Consultation> => {
            const { data: consultation, error } = await supabaseAdmin
                .from('consultations')
                .insert(toSnakeCase(data))
                .select()
                .single();

            if (error) throw new Error(error.message);
            return toCamelCase<Consultation>(consultation);
        },

        update: async (id: string, data: Partial<Consultation>): Promise<Consultation | null> => {
            const { data: consultation, error } = await supabaseAdmin
                .from('consultations')
                .update(toSnakeCase(data))
                .eq('id', id)
                .select()
                .single();

            if (error) return null;
            return toCamelCase<Consultation>(consultation);
        },
    },

    // Medical Records
    medicalRecords: {
        findByPatient: async (patientId: string): Promise<MedicalRecord[]> => {
            const { data, error } = await supabaseAdmin
                .from('medical_records')
                .select('*')
                .eq('patient_id', patientId)
                .order('created_at', { ascending: false });

            if (error || !data) return [];
            return data.map(r => toCamelCase<MedicalRecord>(r));
        },

        findByConsultation: async (consultationId: string): Promise<MedicalRecord | null> => {
            const { data, error } = await supabaseAdmin
                .from('medical_records')
                .select('*')
                .eq('consultation_id', consultationId)
                .single();

            if (error || !data) return null;
            return toCamelCase<MedicalRecord>(data);
        },

        create: async (data: Omit<MedicalRecord, 'id' | 'createdAt'>): Promise<MedicalRecord> => {
            const { data: record, error } = await supabaseAdmin
                .from('medical_records')
                .insert(toSnakeCase(data))
                .select()
                .single();

            if (error) throw new Error(error.message);
            return toCamelCase<MedicalRecord>(record);
        },
    },

    // Reports & Analytics
    reports: {
        getClinicStats: async (clinicId: string, startDate: Date, endDate: Date) => {
            const { data: consultations, error } = await supabaseAdmin
                .from('consultations')
                .select('*')
                .eq('clinic_id', clinicId)
                .eq('status', 'COMPLETED')
                .gte('started_at', startDate.toISOString())
                .lte('started_at', endDate.toISOString());

            if (error || !consultations) {
                return { totalConsultations: 0, totalTime: 0, avgTime: 0, byDentist: {} };
            }

            const totalConsultations = consultations.length;
            const totalTime = consultations.reduce((sum, c) => sum + (c.total_time || 0), 0);
            const avgTime = totalConsultations > 0 ? totalTime / totalConsultations : 0;

            const byDentist: Record<string, { count: number; totalTime: number }> = {};
            consultations.forEach(c => {
                if (!byDentist[c.dentist_id]) {
                    byDentist[c.dentist_id] = { count: 0, totalTime: 0 };
                }
                byDentist[c.dentist_id].count++;
                byDentist[c.dentist_id].totalTime += c.total_time || 0;
            });

            return { totalConsultations, totalTime, avgTime, byDentist };
        },
    },

    // ================================
    // MÓDULO: Pedidos ao Protético
    // ================================

    // Laboratórios (Protéticos)
    laboratories: {
        findById: async (id: string) => {
            const { data, error } = await supabaseAdmin
                .from('laboratories')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) return null;
            return toCamelCase<any>(data);
        },

        findByClinic: async (clinicId: string) => {
            const { data, error } = await supabaseAdmin
                .from('laboratories')
                .select('*')
                .eq('clinic_id', clinicId)
                .eq('active', true)
                .order('name');

            if (error || !data) return [];
            return data.map(p => toCamelCase<any>(p));
        },

        findByEmail: async (email: string) => {
            const { data, error } = await supabaseAdmin
                .from('laboratories')
                .select('*')
                .eq('email', email)
                .single();

            if (error || !data) return null;
            return toCamelCase<any>(data);
        },

        create: async (labData: any) => {
            const { data, error } = await supabaseAdmin
                .from('laboratories')
                .insert(toSnakeCase(labData))
                .select()
                .single();

            if (error) throw new Error(error.message);
            return toCamelCase<any>(data);
        },

        update: async (id: string, labData: any) => {
            const { data, error } = await supabaseAdmin
                .from('laboratories')
                .update({ ...toSnakeCase(labData), updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw new Error(error.message);
            return toCamelCase<any>(data);
        },

        deactivate: async (id: string) => {
            const { error } = await supabaseAdmin
                .from('laboratories')
                .update({ active: false, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) throw new Error(error.message);
            return true;
        },
    },

    // Alias for backwards compatibility
    proteticos: {
        findById: async (id: string) => database.laboratories.findById(id),
        findByClinic: async (clinicId: string) => database.laboratories.findByClinic(clinicId),
        findByEmail: async (email: string) => database.laboratories.findByEmail(email),
        create: async (data: any) => database.laboratories.create(data),
        update: async (id: string, data: any) => database.laboratories.update(id, data),
        deactivate: async (id: string) => database.laboratories.deactivate(id),
    },

    // Pedidos Protéticos
    prostheticRequests: {
        findById: async (id: string) => {
            const { data, error } = await supabaseAdmin
                .from('prosthetic_requests')
                .select(`
                    *,
                    patients:patient_id (*),
                    dentists:dentist_id (*),
                    laboratories:laboratory_id (*)
                `)
                .eq('id', id)
                .single();

            if (error || !data) return null;
            const order = toCamelCase<any>(data);
            // Flatten relations
            if (order.patients) order.patient = order.patients;
            if (order.dentists) order.dentist = order.dentists;
            if (order.laboratories) order.laboratory = order.laboratories;
            delete order.patients;
            delete order.dentists;
            delete order.laboratories;
            return order;
        },

        findByClinic: async (clinicId: string, filters?: { status?: string; dentistId?: string; laboratoryId?: string }) => {
            let query = supabaseAdmin
                .from('prosthetic_requests')
                .select(`
                    *,
                    patients:patient_id (id, name),
                    dentists:dentist_id (id, name),
                    laboratories:laboratory_id (id, name, responsible_name)
                `)
                .eq('clinic_id', clinicId)
                .order('created_at', { ascending: false });

            if (filters?.status) query = query.eq('status', filters.status);
            if (filters?.dentistId) query = query.eq('dentist_id', filters.dentistId);
            if (filters?.laboratoryId) query = query.eq('laboratory_id', filters.laboratoryId);

            const { data, error } = await query;

            if (error || !data) return [];
            return data.map(d => {
                const order = toCamelCase<any>(d);
                if (order.patients) order.patient = order.patients;
                if (order.dentists) order.dentist = order.dentists;
                if (order.laboratories) { order.laboratory = order.laboratories; order.protetico = order.laboratories; }
                delete order.patients;
                delete order.dentists;
                delete order.laboratories;
                return order;
            });
        },

        findByPatient: async (patientId: string) => {
            const { data, error } = await supabaseAdmin
                .from('prosthetic_requests')
                .select('*')
                .eq('patient_id', patientId)
                .order('created_at', { ascending: false });

            if (error || !data) return [];
            return data.map(d => toCamelCase<any>(d));
        },

        findByLaboratory: async (laboratoryId: string) => {
            const { data, error } = await supabaseAdmin
                .from('prosthetic_requests')
                .select(`
                    *,
                    patients:patient_id (id, name),
                    dentists:dentist_id (id, name)
                `)
                .eq('laboratory_id', laboratoryId)
                .order('created_at', { ascending: false });

            if (error || !data) return [];
            return data.map(d => {
                const order = toCamelCase<any>(d);
                if (order.patients) order.patient = order.patients;
                if (order.dentists) order.dentist = order.dentists;
                delete order.patients;
                delete order.dentists;
                return order;
            });
        },

        create: async (requestData: any) => {
            const { data, error } = await supabaseAdmin
                .from('prosthetic_requests')
                .insert(toSnakeCase(requestData))
                .select()
                .single();

            if (error) throw new Error(error.message);
            return toCamelCase<any>(data);
        },

        update: async (id: string, requestData: any) => {
            const { data, error } = await supabaseAdmin
                .from('prosthetic_requests')
                .update({ ...toSnakeCase(requestData), updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw new Error(error.message);
            return toCamelCase<any>(data);
        },

        updateStatus: async (id: string, newStatus: string, changedByType: string, changedById?: string, notes?: string) => {
            // Get current status
            const { data: current } = await supabaseAdmin
                .from('prosthetic_requests')
                .select('status')
                .eq('id', id)
                .single();

            const previousStatus = current?.status;

            // Update request status
            const { data, error } = await supabaseAdmin
                .from('prosthetic_requests')
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw new Error(error.message);

            // Log status change to history
            await supabaseAdmin
                .from('prosthetic_request_history')
                .insert({
                    request_id: id,
                    previous_status: previousStatus,
                    new_status: newStatus,
                    changed_by: changedById,
                    changed_by_type: changedByType,
                    notes: notes,
                });

            return toCamelCase<any>(data);
        },

        delete: async (id: string) => {
            const { error } = await supabaseAdmin
                .from('prosthetic_requests')
                .delete()
                .eq('id', id);

            if (error) throw new Error(error.message);
            return true;
        },
    },

    // Alias for backwards compatibility
    prostheticOrders: {
        findById: async (id: string) => database.prostheticRequests.findById(id),
        findByClinic: async (clinicId: string, filters?: any) => database.prostheticRequests.findByClinic(clinicId, filters),
        findByPatient: async (patientId: string) => database.prostheticRequests.findByPatient(patientId),
        findByProtetico: async (labId: string) => database.prostheticRequests.findByLaboratory(labId),
        create: async (data: any) => database.prostheticRequests.create(data),
        update: async (id: string, data: any) => database.prostheticRequests.update(id, data),
        updateStatus: async (id: string, status: string, type: string, byId?: string, notes?: string) =>
            database.prostheticRequests.updateStatus(id, status, type, byId, notes),
        delete: async (id: string) => database.prostheticRequests.delete(id),
    },

    // Histórico de Pedidos
    prostheticRequestHistory: {
        findByRequest: async (requestId: string) => {
            const { data, error } = await supabaseAdmin
                .from('prosthetic_request_history')
                .select('*')
                .eq('request_id', requestId)
                .order('created_at', { ascending: true });

            if (error || !data) return [];
            return data.map(h => toCamelCase<any>(h));
        },
    },

    // Alias
    prostheticOrderHistory: {
        findByOrder: async (orderId: string) => database.prostheticRequestHistory.findByRequest(orderId),
    },

    // Comentários de Pedidos
    prostheticRequestComments: {
        findByRequest: async (requestId: string) => {
            const { data, error } = await supabaseAdmin
                .from('prosthetic_request_comments')
                .select('*')
                .eq('request_id', requestId)
                .order('created_at', { ascending: true });

            if (error || !data) return [];
            return data.map(c => toCamelCase<any>(c));
        },

        create: async (commentData: any) => {
            const { data, error } = await supabaseAdmin
                .from('prosthetic_request_comments')
                .insert(toSnakeCase(commentData))
                .select()
                .single();

            if (error) throw new Error(error.message);
            return toCamelCase<any>(data);
        },
    },

    // Alias
    prostheticOrderComments: {
        findByOrder: async (orderId: string) => database.prostheticRequestComments.findByRequest(orderId),
        create: async (data: any) => database.prostheticRequestComments.create(data),
    },

    // Arquivos de Pedidos
    prostheticRequestFiles: {
        findByRequest: async (requestId: string) => {
            const { data, error } = await supabaseAdmin
                .from('prosthetic_request_files')
                .select('*')
                .eq('request_id', requestId)
                .order('created_at', { ascending: true });

            if (error || !data) return [];
            return data.map(a => toCamelCase<any>(a));
        },

        create: async (fileData: any) => {
            const { data, error } = await supabaseAdmin
                .from('prosthetic_request_files')
                .insert(toSnakeCase(fileData))
                .select()
                .single();

            if (error) throw new Error(error.message);
            return toCamelCase<any>(data);
        },

        delete: async (id: string) => {
            const { error } = await supabaseAdmin
                .from('prosthetic_request_files')
                .delete()
                .eq('id', id);

            if (error) throw new Error(error.message);
            return true;
        },
    },

    // Alias
    prostheticOrderAttachments: {
        findByOrder: async (orderId: string) => database.prostheticRequestFiles.findByRequest(orderId),
        create: async (data: any) => database.prostheticRequestFiles.create(data),
        delete: async (id: string) => database.prostheticRequestFiles.delete(id),
    },

    // Notificações
    notifications: {
        findByRecipient: async (recipientId: string, recipientType: string, unreadOnly = false) => {
            let query = supabaseAdmin
                .from('notifications')
                .select('*')
                .eq('recipient_id', recipientId)
                .eq('recipient_type', recipientType)
                .order('created_at', { ascending: false })
                .limit(50);

            if (unreadOnly) {
                query = query.eq('read', false);
            }

            const { data, error } = await query;

            if (error || !data) return [];
            return data.map(n => toCamelCase<any>(n));
        },

        countUnread: async (recipientId: string, recipientType: string) => {
            const { count, error } = await supabaseAdmin
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('recipient_id', recipientId)
                .eq('recipient_type', recipientType)
                .eq('read', false);

            if (error) return 0;
            return count || 0;
        },

        markAsRead: async (notificationId: string) => {
            const { error } = await supabaseAdmin
                .from('notifications')
                .update({ read: true, read_at: new Date().toISOString() })
                .eq('id', notificationId);

            if (error) throw new Error(error.message);
            return true;
        },

        markAllAsRead: async (recipientId: string, recipientType: string) => {
            const { error } = await supabaseAdmin
                .from('notifications')
                .update({ read: true, read_at: new Date().toISOString() })
                .eq('recipient_id', recipientId)
                .eq('recipient_type', recipientType)
                .eq('read', false);

            if (error) throw new Error(error.message);
            return true;
        },

        create: async (notificationData: any) => {
            const { data, error } = await supabaseAdmin
                .from('notifications')
                .insert(toSnakeCase(notificationData))
                .select()
                .single();

            if (error) throw new Error(error.message);
            return toCamelCase<any>(data);
        },
    },
};

export default database;
