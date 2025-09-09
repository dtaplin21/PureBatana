-- Make user_id optional in reviews table
ALTER TABLE "reviews" ALTER COLUMN "user_id" DROP NOT NULL;

-- Drop the foreign key constraint temporarily
ALTER TABLE "reviews" DROP CONSTRAINT IF EXISTS "reviews_user_id_users_id_fk";

-- Add the foreign key constraint back but allow NULL values
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" 
FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") 
ON DELETE SET NULL ON UPDATE CASCADE;
