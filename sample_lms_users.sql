-- Sample LMS Users for Testing Student Login
-- Run this AFTER running sample_students_data.sql

-- This script creates LMS user accounts for the sample students
-- These are the credentials students will use to log into the LMS

-- Insert LMS users for the sample students
-- Password format: LMS@ + 4-digit number for easy testing

INSERT INTO public.lms_users (student_id, email, password, is_active)
VALUES 
-- Student 1: Saman Perera (account inactive - payment pending)
(1, 'saman.perera@example.com', 'LMS@1234', false),

-- Student 2: Nimali Fernando (account inactive - payment pending)
(2, 'nimali.fernando@example.com', 'LMS@5678', false),

-- Student 3: Kasun Silva (account active - paid)
(3, 'kasun.silva@example.com', 'LMS@9012', true),

-- Student 4: Amaya Jayasinghe (account inactive - payment pending)
(4, 'amaya.j@example.com', 'LMS@3456', false),

-- Student 5: Ruwan Bandara (account active - paid)
(5, 'ruwan.b@example.com', 'LMS@7890', true)
ON CONFLICT (email) DO UPDATE 
SET password = EXCLUDED.password,
    is_active = EXCLUDED.is_active;

-- Sample enrollments for active students
-- Both Kasun and Ruwan are enrolled in their respective courses

INSERT INTO public.enrollments (student_id, lms_user_id, course_id, enrolled_by, status)
VALUES 
-- Kasun Silva enrolled in course 1 (AI & ML)
(3, 3, 1, 'SehanAdmin', 'active'),

-- Ruwan Bandara enrolled in course 1 (AI & ML)
(5, 5, 1, 'SehanAdmin', 'active')
ON CONFLICT (student_id, course_id) DO NOTHING;

-- Display the created test accounts
SELECT 
    rs.name,
    lu.email,
    lu.password,
    lu.is_active as account_active,
    rs.account_status,
    rs.payment_status,
    COALESCE(
        (SELECT string_agg(c.course_name, ', ')
         FROM enrollments e
         JOIN courses c ON e.course_id = c.id
         WHERE e.lms_user_id = lu.id AND e.status = 'active'
        ), 
        'No courses enrolled'
    ) as enrolled_courses
FROM lms_users lu
JOIN registered_student rs ON lu.student_id = rs.id
ORDER BY lu.id;

-- Test Accounts Summary:
-- ========================
-- 
-- ACTIVE ACCOUNTS (Can login):
-- 1. kasun.silva@example.com / LMS@9012
--    - Status: Active, Paid
--    - Enrolled in: Introduction to AI & Machine Learning
--
-- 2. ruwan.b@example.com / LMS@7890
--    - Status: Active, Paid
--    - Enrolled in: Introduction to AI & Machine Learning
--
-- INACTIVE ACCOUNTS (Cannot login - need payment):
-- 3. saman.perera@example.com / LMS@1234
-- 4. nimali.fernando@example.com / LMS@5678
-- 5. amaya.j@example.com / LMS@3456
