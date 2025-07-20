import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL ||
  "https://nzfgsguwxcezsjwlwyoz.supabase.co";
const supabaseKey =
  process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_jZBH-xwYN9WXnjLGRWo5nA_LLMUcc1E";

export const supabase = createClient(supabaseUrl, supabaseKey);
