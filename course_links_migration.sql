-- ============================================================
-- COURSE LINKS MIGRATION
-- Run this in your Supabase SQL Editor
-- Date: 2026-03-23
-- ============================================================

-- Add global course-level links
ALTER TABLE public.courses
ADD COLUMN recording_list_url TEXT,
ADD COLUMN resource_url TEXT;

-- (Optional) Update existing course with the links provided:
-- UPDATE public.courses 
-- SET recording_list_url = 'https://docs.google.com/document/d/1H8tYAi0yv91sCLoAQvTCZg62sICyrnjkBCkBQzId1ck/edit?usp=sharing',
--     resource_url = 'https://drive.google.com/drive/folders/1aj0SCBVPuQQIAg2YsaPC1872xC8Wpwnv?usp=sharing'
-- WHERE id = '<course_id>';
