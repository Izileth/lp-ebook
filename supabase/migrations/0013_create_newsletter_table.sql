-- Create newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (anyone can subscribe)
CREATE POLICY "Enable insert for everyone" ON public.newsletter_subscriptions
    FOR INSERT WITH CHECK (true);

-- Only authenticated admins can view subscriptions
CREATE POLICY "Enable read for admins only" ON public.newsletter_subscriptions
    FOR SELECT USING (is_admin());
