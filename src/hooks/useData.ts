import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { Appointment, Consultation, Patient } from '@/types';

// Hook para Agendamentos
export function useAppointments(date?: string | Date, options?: any) {
    // Formatar data se for objeto Date
    const dateStr = date instanceof Date
        ? date.toISOString().split('T')[0]
        : date;

    // Se não passar data, assume hoje ou busca geral (depende da API, aqui vamos assumir que precisa de data ou range)
    // Para simplificar, se não tiver data, não busca (ou busca todos se a API suportar)
    const query = dateStr ? `?date=${dateStr}` : '';

    // Usar SWR
    const { data, error, isLoading, mutate } = useSWR(
        `/api/appointments${query}`,
        fetcher,
        {
            refreshInterval: 30000, // Revalidar a cada 30s
            ...options
        }
    );

    return {
        appointments: (data?.agendamentos || []) as any[], // Tipagem fraca temporária para compatibilidade com o frontend existente que estende Appointment
        isLoading,
        isError: error,
        mutate,
    };
}

// Hook para Atendimentos (Consultations)
export function useConsultations(status?: string, options?: any) {
    const query = status ? `?status=${status}` : '';

    const { data, error, isLoading, mutate } = useSWR(
        `/api/consultations${query}`,
        fetcher,
        {
            refreshInterval: 5000, // Revalidar a cada 5s para atendimentos (status pode mudar rápido)
            ...options
        }
    );

    return {
        consultations: (data?.atendimentos || []) as Consultation[],
        isLoading,
        isError: error,
        mutate,
    };
}

// Hook para Pacientes
export function usePatients(search?: string, options?: any) {
    const query = search ? `?q=${search}` : '';

    const { data, error, isLoading, mutate } = useSWR(
        `/api/patients${query}`,
        fetcher,
        options
    );

    return {
        patients: (data?.pacientes || []) as Patient[],
        isLoading,
        isError: error,
        mutate,
    };
}
