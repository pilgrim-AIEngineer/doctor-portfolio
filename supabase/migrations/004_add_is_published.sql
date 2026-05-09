-- Add is_published flag to doctors so unpublished portfolios show a "coming soon" page
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT false;

-- Doctors already in the database were publicly visible before this column existed — keep them live
UPDATE doctors SET is_published = true;
