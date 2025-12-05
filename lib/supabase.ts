import { createClient } from '@supabase/supabase-js';

// Access environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Please check your .env file.');
}

// Create and export the Supabase client
// If keys are missing, we export a dummy client that warns the user
const isValidSetup = supabaseUrl && supabaseAnonKey;

export const supabase = isValidSetup
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createClient('https://placeholder.supabase.co', 'placeholder-key');

if (!isValidSetup) {
    console.error('SUPABASE INITIALIZATION FAILED: Missing environment variables.');
}
