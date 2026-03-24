import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Story = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string;
  content: string | null;
  image_url: string | null;
  category: string | null;
  tags: string[] | null;
  company: string | null;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type Tool = {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string | null;
  url: string;
  logo_url: string | null;
  category: string | null;
  tags: string[] | null;
  pricing: 'free' | 'freemium' | 'paid' | null;
  is_open_source: boolean;
  featured: boolean;
  approved: boolean;
  submitted_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ToolSubmission = {
  id: string;
  tool_name: string;
  tool_url: string;
  description: string | null;
  submitter_email: string | null;
  submitter_name: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};
