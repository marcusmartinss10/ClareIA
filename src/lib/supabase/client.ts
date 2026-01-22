import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Cliente para uso no frontend (com RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente para uso no backend
// Usa service key se disponível e válida (começa com eyJ), senão usa anon key como fallback
const isValidServiceKey = supabaseServiceKey &&
    supabaseServiceKey.startsWith('eyJ') &&
    !supabaseServiceKey.includes('cole_sua');

const adminKey = isValidServiceKey ? supabaseServiceKey : supabaseAnonKey;

export const supabaseAdmin = createClient(supabaseUrl, adminKey);

export default supabase;
