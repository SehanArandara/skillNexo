import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen,
    LogOut,
    ArrowRight,
    Loader2,
    GraduationCap,
    Clock,
    Rocket,
    LayoutGrid,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const COURSE_GRADIENTS = [
    { from: 'from-blue-600', to: 'to-indigo-700', glow: 'shadow-blue-500/20' },
    { from: 'from-emerald-600', to: 'to-teal-700', glow: 'shadow-emerald-500/20' },
    { from: 'from-violet-600', to: 'to-purple-700', glow: 'shadow-violet-500/20' },
    { from: 'from-orange-500', to: 'to-rose-600', glow: 'shadow-orange-500/20' },
];

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
};

const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            const isAuthenticated = localStorage.getItem('isStudentAuthenticated');
            const userStr = localStorage.getItem('studentUser');

            if (!isAuthenticated || !userStr) {
                navigate('/lms');
                return;
            }

            try {
                const userObj = JSON.parse(userStr);

                const { data: lmsUser, error: lmsError } = await supabase
                    .from('lms_users')
                    .select(`
                        *,
                        registered_student (
                            name,
                            email
                        ),
                        enrollments (
                            id,
                            courses (
                                id,
                                course_name,
                                instructor,
                                duration_days
                            )
                        )
                    `)
                    .eq('id', userObj.id)
                    .single();

                if (lmsError || !lmsUser) throw new Error('User not found');

                if (!lmsUser.is_active) {
                    handleLogout();
                    return;
                }

                const transformedStudent = {
                    id: lmsUser.id,
                    name: lmsUser.registered_student.name,
                    email: lmsUser.email,
                    enrolledCourses: lmsUser.enrollments?.map(e => ({
                        id: e.courses.id,
                        name: e.courses.course_name,
                        instructor: e.courses.instructor,
                        duration: e.courses.duration_days,
                        enrollmentId: e.id,
                    })) || [],
                };

                setStudent(transformedStudent);
                localStorage.setItem('studentUser', JSON.stringify(transformedStudent));
            } catch {
                const fallbackData = JSON.parse(userStr);
                setStudent(fallbackData);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isStudentAuthenticated');
        localStorage.removeItem('studentUser');
        navigate('/lms');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#080d16] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                    <p className="text-slate-500 text-sm tracking-widest uppercase animate-pulse">Loading your portal...</p>
                </div>
            </div>
        );
    }

    if (!student) return null;

    const firstName = student.name?.split(' ')[0] || 'Student';
    const initials = getInitials(student.name);

    return (
        <div className="min-h-screen bg-[#080d16] text-slate-100 flex flex-col">

            {/* ── Top Navigation ── */}
            <header className="sticky top-0 z-50 h-16 bg-[#0d1421]/80 backdrop-blur-xl border-b border-slate-800/60 flex items-center justify-between px-4 lg:px-8">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <Rocket className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <span className="text-base font-bold text-white tracking-tight">SkillNexo</span>
                        <span className="hidden md:inline text-xs text-slate-500 ml-2 font-medium">Student Portal</span>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {/* Avatar + name */}
                    <div className="flex items-center gap-3 pl-3">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-semibold text-white leading-none">{student.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{student.email}</p>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/20">
                            {initials}
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        title="Sign Out"
                        className="ml-1 flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-medium border border-transparent hover:border-red-500/20"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden md:inline">Sign Out</span>
                    </button>
                </div>
            </header>

            {/* ── Main Content ── */}
            <main className="flex-1 px-4 lg:px-8 py-8 max-w-6xl mx-auto w-full space-y-10">

                {/* ── Welcome Hero ── */}
                <div className="relative rounded-3xl overflow-hidden border border-slate-800/60 bg-gradient-to-br from-slate-900 via-[#0d1421] to-slate-900 p-8 md:p-10 shadow-2xl">
                    {/* Background glow blobs */}
                    <div className="absolute -top-16 -left-16 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        {/* Large Avatar */}
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-emerald-500/30 shrink-0">
                            {initials}
                        </div>

                        <div className="flex-1">
                            <p className="text-sm font-semibold text-emerald-400 uppercase tracking-widest mb-1">
                                {getGreeting()}
                            </p>
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
                                {firstName}!
                            </h1>
                            <p className="text-slate-400 mt-2 text-sm max-w-md">
                                Ready to keep building? Your learning journey continues below.
                            </p>
                        </div>

                        {/* Stats pill */}
                        <div className="flex items-center gap-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl px-6 py-4 shrink-0">
                            <div className="text-center">
                                <p className="text-2xl font-black text-white">{student.enrolledCourses?.length || 0}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Courses</p>
                            </div>
                            <div className="w-px h-10 bg-slate-700" />
                            <div className="text-center">
                                <p className="text-2xl font-black text-emerald-400">
                                    {student.enrolledCourses?.reduce((sum, c) => sum + (c.duration || 0), 0) || '—'}
                                </p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Days</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── My Courses ── */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <LayoutGrid className="w-4 h-4 text-emerald-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white">My Courses</h2>
                        <span className="text-xs font-bold text-slate-600 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full">
                            {student.enrolledCourses?.length || 0}
                        </span>
                    </div>

                    {student.enrolledCourses && student.enrolledCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {student.enrolledCourses.map((course, index) => {
                                const gradient = COURSE_GRADIENTS[index % COURSE_GRADIENTS.length];
                                return (
                                    <div
                                        key={course.id || index}
                                        className={`group flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 shadow-xl ${gradient.glow}`}
                                    >
                                        {/* Card Top Banner */}
                                        <div className={`relative h-36 bg-gradient-to-br ${gradient.from} ${gradient.to} p-6 flex flex-col justify-between overflow-hidden`}>
                                            {/* Decorative circles */}
                                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/5 rounded-full" />
                                            <div className="absolute -bottom-8 -right-2 w-24 h-24 bg-white/5 rounded-full" />

                                            <div className="relative z-10 flex justify-between items-start">
                                                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                                    <GraduationCap className="w-5 h-5 text-white" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest bg-white/15 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                                                    Active
                                                </span>
                                            </div>
                                            <div className="relative z-10">
                                                {course.duration && (
                                                    <div className="flex items-center gap-1.5 text-white/70 text-xs font-medium">
                                                        <Clock className="w-3 h-3" />
                                                        {course.duration} Days Program
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="flex-1 flex flex-col p-5 gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-base font-bold text-white leading-snug line-clamp-2">
                                                    {course.name}
                                                </h3>
                                                {course.instructor && (
                                                    <p className="text-xs text-slate-500 mt-1.5 font-medium">
                                                        by {course.instructor}
                                                    </p>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => navigate(`/lms/course/${course.id}`)}
                                                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 bg-gradient-to-r ${gradient.from} ${gradient.to} text-white opacity-80 hover:opacity-100 hover:gap-3 shadow-lg group-hover:shadow-xl`}
                                            >
                                                <BookOpen className="w-4 h-4" />
                                                Continue Learning
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl">
                            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-8 h-8 text-slate-600" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">No Courses Yet</h3>
                            <p className="text-slate-500 text-sm max-w-sm mx-auto">
                                You haven't been enrolled in any courses yet. Please contact the administrator.
                            </p>
                        </div>
                    )}
                </section>
            </main>

            {/* ── Footer ── */}
            <footer className="border-t border-slate-800/60 py-5 px-8 text-center">
                <p className="text-xs text-slate-600">
                    SkillNexo LMS &mdash; Fueling Your Future in Tech
                </p>
            </footer>
        </div>
    );
};

export default StudentDashboard;
