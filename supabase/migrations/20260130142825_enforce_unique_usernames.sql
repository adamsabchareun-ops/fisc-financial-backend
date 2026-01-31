-- Make sure usernames are unique so we don't have duplicates
ALTER TABLE "public"."profiles"
ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");