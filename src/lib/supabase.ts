import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://lfpwwrxxumazocleldft.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmcHd3cnh4dW1hem9jbGVsZGZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NDc1NjksImV4cCI6MjA5NDAyMzU2OX0.Zvy2OqJq0xdsCX41efRA4tvCoQEG-jczKy2erxc0q0A";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
