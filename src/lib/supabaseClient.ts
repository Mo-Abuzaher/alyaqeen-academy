/// <reference types="vite/client" />
import { createClient } from "@supabase/supabase-js";

const rawUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

// Sanitize URL to remove trailing slashes or /rest/v1 paths entered by mistake
export const supabaseUrl = rawUrl.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isSupabaseConfigured) {
  console.warn(
    "Supabase credentials are not configured in your environment variables.\n" +
    "To enable global parent review storage, set the following variables:\n" +
    "- VITE_SUPABASE_URL\n" +
    "- VITE_SUPABASE_ANON_KEY\n" +
    "The application will automatically fallback to safe offline localStorage so that it never breaks!"
  );
}
