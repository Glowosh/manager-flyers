/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta as any).env
  .VITE_REACT_APP_SUPABASE_URL as string;
const supabaseAnonKey = (import.meta as any).env
  .VITE_REACT_APP_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
