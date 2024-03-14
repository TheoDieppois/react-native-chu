import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://lpdqkvcibcpvunqeevsw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwZHFrdmNpYmNwdnVucWVldnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA4MjAyOTQsImV4cCI6MjAxNjM5NjI5NH0.ihsyefhb3WSjzobc8BCVqIi7tYuFxpoKzWplrjXg7AU'
//const supabaseKey = process.env.SUPABASE_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)