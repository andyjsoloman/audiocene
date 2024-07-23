import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://naiqpffpxlusflmdzeqa.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5haXFwZmZweGx1c2ZsbWR6ZXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4MzA0NzAsImV4cCI6MjAzMTQwNjQ3MH0.Z8zlATYa5yqbHGcdT3NcbnOfxb6w3EdkH1mpkGX7110";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
