import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tengdztvrfbmiwwscnka.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlbmdkenR2cmZibWl3d3NjbmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NTc2NTYsImV4cCI6MjA2NzAzMzY1Nn0.MF_VZ5sInLdwz0Ybh8-fA76Uq6pdoc8nL0bG3WPsnRw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
