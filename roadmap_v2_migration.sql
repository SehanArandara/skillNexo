-- ============================================================
-- ROADMAP V2 MIGRATION
-- Run this in your Supabase SQL Editor
-- Date: 2026-03-22
-- ============================================================

-- ── CHANGE 1: Add 'orientation' to the step_type CHECK constraint ──────────
-- The existing constraint only allows: 'class', 'quiz', 'reading', 'assignment'
-- We need to expand it to also allow 'orientation'

-- Step 1a: Drop the existing check constraint
ALTER TABLE public.course_roadmap
DROP CONSTRAINT IF EXISTS course_roadmap_step_type_check;

-- Step 1b: Re-create it with 'orientation' included
ALTER TABLE public.course_roadmap
ADD CONSTRAINT course_roadmap_step_type_check
CHECK (step_type IN ('class', 'quiz', 'reading', 'assignment', 'orientation'));


-- ── CHANGE 2: Confirm day_number allows negative values (Orientation) ─────
-- Orientation sessions use negative day_number values (-1, -2, -3 ...)
-- to keep them sorted BEFORE Day 01 in ascending order.
--   Orientation 01 → day_number = -1
--   Orientation 02 → day_number = -2
--   Orientation 03 → day_number = -3
--   Day 01         → day_number = 1
--   Day 02         → day_number = 2
--
-- The current column is plain INTEGER so this already works.
-- No change needed — just documenting the convention:
-- SELECT * FROM course_roadmap ORDER BY day_number ASC;  ← orientations first, then days


-- ── CHANGE 3: recording_list_url is stored inside content JSONB ───────────
-- The new "Recording List" Drive link is stored as:
--   content->>'recording_list_url'
-- The content column already exists as JSONB, so NO column change needed.
-- Example of what a row's content field looks like:
-- {
--   "recording_list_url": "https://drive.google.com/drive/folders/...",
--   "questions": []          ← only present for quiz type steps
-- }


-- ── VERIFICATION QUERIES ─────────────────────────────────────────────────

-- Check your existing roadmap data:
SELECT id, course_id, day_number, step_type, title
FROM public.course_roadmap
ORDER BY course_id, day_number ASC;

-- Check the constraint is updated correctly:
SELECT conname, pg_get_constraintdef(oid) AS constraint_def
FROM pg_constraint
WHERE conrelid = 'public.course_roadmap'::regclass
  AND contype = 'c';

-- ── THAT'S IT! Only 1 real change is needed. ─────────────────────────────
