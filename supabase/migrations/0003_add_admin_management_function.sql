-- supabase/migrations/0003_add_admin_management_function.sql

-- Function to add a user to the admin_users table
CREATE OR REPLACE FUNCTION add_admin_user(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can add other administrators.';
  END IF;

  -- Check if the user already exists in admin_users
  IF EXISTS (SELECT 1 FROM admin_users WHERE user_id = p_user_id) THEN
    RAISE EXCEPTION 'User is already an administrator.';
  END IF;

  -- Ensure the user_id exists in auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'User ID not found in authentication system.';
  END IF;

  -- Add the user to the admin_users table
  INSERT INTO admin_users (user_id)
  VALUES (p_user_id);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant usage to authenticated users so admins can call it
GRANT EXECUTE ON FUNCTION add_admin_user(UUID) TO authenticated;