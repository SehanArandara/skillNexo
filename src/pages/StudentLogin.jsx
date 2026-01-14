import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, BookOpen, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const StudentLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Step 1: Check if LMS user exists with these credentials
            const { data: lmsUser, error: lmsError } = await supabase
                .from('lms_users')
                .select(`
                    *,
                    registered_student (
                        id,
                        name,
                        email,
                        account_status,
                        payment_status
                    )
                `)
                .eq('email', email)
                .eq('password', password)
                .single();

            if (lmsError || !lmsUser) {
                setError('Invalid email or password. Please check your credentials.');
                setIsLoading(false);
                return;
            }

            // Step 2: Check if account is active
            if (!lmsUser.is_active) {
                setError('Your account has been deactivated. Please contact support.');
                setIsLoading(false);
                return;
            }

            if (lmsUser.registered_student?.account_status !== 'Active') {
                setError('Your account is not active yet. Please complete payment or contact support.');
                setIsLoading(false);
                return;
            }

            // Step 3: Get student's enrolled courses
            const { data: enrollments, error: enrollError } = await supabase
                .from('enrollments')
                .select(`
                    *,
                    courses (
                        id,
                        course_name,
                        instructor,
                        duration_days
                    )
                `)
                .eq('lms_user_id', lmsUser.id)
                .eq('status', 'active');

            if (enrollError) {
                console.error('Error fetching enrollments:', enrollError);
            }

            // Step 4: Update last login timestamp
            await supabase
                .from('lms_users')
                .update({ last_login: new Date().toISOString() })
                .eq('id', lmsUser.id);

            // Step 5: Store session data
            const studentData = {
                id: lmsUser.id,
                studentId: lmsUser.student_id,
                name: lmsUser.registered_student.name,
                email: lmsUser.email,
                enrolledCourses: enrollments?.map(e => ({
                    id: e.courses.id,
                    name: e.courses.course_name,
                    instructor: e.courses.instructor,
                    duration: e.courses.duration_days,
                    enrollmentId: e.id
                })) || []
            };

            localStorage.setItem('isStudentAuthenticated', 'true');
            localStorage.setItem('studentUser', JSON.stringify(studentData));

            // Navigate to dashboard
            navigate('/lms/dashboard');

        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred during login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] bg-teal-600/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 mb-4 shadow-lg shadow-emerald-500/20">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Student Portal</h1>
                    <p className="text-slate-400">Welcome back! Continue your learning journey.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full bg-slate-950/50 border border-slate-700 text-slate-100 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full bg-slate-950/50 border border-slate-700 text-slate-100 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-500 text-sm flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                Access LMS
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center space-y-3">
                    <p className="text-sm text-slate-400">
                        Don't have an account? <a href="/" className="text-emerald-400 hover:underline">Register now</a>
                    </p>

                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-2 font-medium">📧 How to get your credentials:</p>
                        <p className="text-xs text-slate-500">
                            Your login credentials are sent to your email after payment verification by the admin.
                        </p>
                    </div>

                    <p className="text-xs text-slate-600">
                        Need help? Contact support
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StudentLogin;
