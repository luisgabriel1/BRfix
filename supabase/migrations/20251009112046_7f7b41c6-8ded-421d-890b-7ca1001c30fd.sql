-- Add new fields to quote_requests for better service tracking
ALTER TABLE public.quote_requests 
ADD COLUMN IF NOT EXISTS service_type TEXT,
ADD COLUMN IF NOT EXISTS service_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS service_address TEXT;

-- Add index for faster queries on closed services
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON public.quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_service_date ON public.quote_requests(service_date);

-- Add policy for admins to delete quote requests
CREATE POLICY "Admins can delete quote requests"
ON public.quote_requests
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));