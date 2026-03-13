-- Migration to exclude admins from counting in interactions
-- This prevents admin activity from skewing the analytics

CREATE OR REPLACE FUNCTION exclude_admin_interactions()
RETURNS TRIGGER AS $$
BEGIN
  -- If the user is an admin, cancel the insert by returning NULL
  IF is_admin() THEN
    RETURN NULL;
  END IF;
  
  -- Otherwise, allow the insert
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS tr_exclude_admin_interactions ON interactions;
CREATE TRIGGER tr_exclude_admin_interactions
BEFORE INSERT ON interactions
FOR EACH ROW
EXECUTE FUNCTION exclude_admin_interactions();
