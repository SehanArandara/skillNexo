import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, BookOpen } from 'lucide-react';
import studentsData from '../data/students.json';

const StudentLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        // Find student
        const student = studentsData.find(s => s.email === email);

        if (!student) {
            setError('Account not found. Please register first.');
            return;
        }

        if (student.accountStatus !== 'Active') {
            setError('Your account is not active yet. Please complete payment or contact support.');
            return;
        }

        // For this demo, we accept any password since we don't store them in the JSON yet
        // In a real app, you'd verify the hash
        if (password.length > 5) {
            localStorage.setItem('isStudentAuthenticated', 'true');
            localStorage.setItem('studentUser', JSON.stringify({
                name: student.name,
                email: student.email,
                id: student.id
            }));
            navigate('/lms/dashboard');
        } else {
            setError('Invalid password. (Hint: Use any 6+ char password for demo)');
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
                                className="w-full bg-slate-950/50 border border-slate-700 text-slate-100 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-600"
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
                                className="w-full bg-slate-950/50 border border-slate-700 text-slate-100 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-600"
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
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
                    >
                        Access LMS
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-8 text-center space-y-2">
                    <p className="text-sm text-slate-400">
                        Don't have an account? <span className="text-emerald-400 hover:underline cursor-pointer">Register now</span>
                    </p>
                    <p className="text-xs text-slate-500">
                        (Demo: Use 'saman@example.com' with any password)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StudentLogin;
