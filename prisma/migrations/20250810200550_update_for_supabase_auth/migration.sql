/*
  Update for Supabase Auth:
  - Make password optional (for Supabase auth users)
  - Set temporary supabaseUserId for existing users, then make it required
*/

-- First, update existing users with temporary supabaseUserId
UPDATE "public"."User" 
SET "supabaseUserId" = 'temp_' || "id" 
WHERE "supabaseUserId" IS NULL;

-- Now make the column required and password optional
ALTER TABLE "public"."User" 
ALTER COLUMN "supabaseUserId" SET NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
