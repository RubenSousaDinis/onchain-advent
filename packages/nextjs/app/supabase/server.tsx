import { createClient } from "@supabase/supabase-js";

export const createSupabaseClient = () => {
  if (!process.env.NEXT_SUPABASE_URL) {
    throw "Missing NEXT_SUPABASE_URL";
  }
  if (!process.env.NEXT_SUPABASE_ANON_KEY) {
    throw "Missing NEXT_SUPABASE_ANON_KEY";
  }
  return createClient(process.env.NEXT_SUPABASE_URL, process.env.NEXT_SUPABASE_ANON_KEY);
};
