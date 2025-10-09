-- Create storage bucket for quote attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('quote-attachments', 'quote-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Add file_urls column to quote_requests
ALTER TABLE public.quote_requests 
ADD COLUMN IF NOT EXISTS file_urls text[];

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_quote_requests_status_created 
ON public.quote_requests(status, created_at DESC);

-- RLS policies for storage
CREATE POLICY "Anyone can upload quote attachments"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'quote-attachments');

CREATE POLICY "Admins can view quote attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'quote-attachments' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete quote attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'quote-attachments' 
  AND has_role(auth.uid(), 'admin'::app_role)
);