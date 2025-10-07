-- Add constraint to limit maximum 2 admin roles
CREATE OR REPLACE FUNCTION public.check_max_admins()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'admin' THEN
    IF (SELECT COUNT(*) FROM public.user_roles WHERE role = 'admin') >= 2 THEN
      RAISE EXCEPTION 'Máximo de 2 administradores permitidos';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_max_admins
BEFORE INSERT ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.check_max_admins();