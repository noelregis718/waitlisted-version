import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vnauqaugenbmgvqrjxty.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuYXVxYXVnZW5ibWd2cXJqeHR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMzUyNzcsImV4cCI6MjA2NTkxMTI3N30.sTRg4C8MXanvtTg3tQW-lmQ5n_87StA12R3BFxB0Pe0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 