import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL ||
  "https://ncccwwzblxjeptjnmpzb.supabase.co";
const supabaseKey =
  process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_yMee_EXE_WL2nJyG-dZp5g_gIkePin_";

// Debug environment variables
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseKey ? "Key exists" : "Key missing");

export const supabase = createClient(supabaseUrl, supabaseKey);
