-- Sample Student Data for Testing
-- Run this in Supabase SQL Editor after running db_setup.sql

-- Insert sample registered students
INSERT INTO public.registered_student (name, email, whatsapp, level, course_id, payment_status, account_status)
VALUES 
('Saman Perera', 'saman.perera@example.com', '0771234567', 'Beginner', 1, 'Pending', 'Inactive'),
('Nimali Fernando', 'nimali.fernando@example.com', '0779876543', 'Intermediate', 2, 'Pending', 'Inactive'),
('Kasun Silva', 'kasun.silva@example.com', '0765551234', 'Beginner', 1, 'Paid', 'Active'),
('Amaya Jayasinghe', 'amaya.j@example.com', '0712345678', 'Advanced', 2, 'Pending', 'Inactive'),
('Ruwan Bandara', 'ruwan.b@example.com', '0723456789', 'Beginner', 1, 'Paid', 'Active')
ON CONFLICT DO NOTHING;

-- Note: These are sample students for testing purposes
-- The course_id values (1 and 2) should match courses in your courses table
