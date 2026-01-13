import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    LogOut,
    Bell,
    User,
    PlayCircle
} from 'lucide-react';
import studentsData from '../data/students.json';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isStudentAuthenticated');
        const userStr = localStorage.getItem('studentUser');

        if (!isAuthenticated || !userStr) {
            navigate('/lms');
            return;
        }

        // Reload student data from JSON to get latest enrollments (simulating backend fetch)
        const userObj = JSON.parse(userStr);
        const liveData = studentsData.find(s => s.id === userObj.id);
        setStudent(liveData || userObj);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isStudentAuthenticated');
        localStorage.removeItem('studentUser');
        navigate('/lms');
    };

    if (!student) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            {/* Navbar */}
            <header className="h-16 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-4 lg:px-8 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white hidden md:block">Student Portal</span>
                </div>

                <div className="flex items-center gap-6">
                    <button className="text-slate-400 hover:text-white transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-medium text-white">{student.name}</p>
                            <p className="text-xs text-slate-400">{student.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Welcome Section */}
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-gradient-to-r from-slate-900 to-slate-900/50 border border-slate-800 rounded-2xl p-8 shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {student.name.split(' ')[0]}! 👋</h1>
                            <p className="text-slate-400 max-w-xl">
                                You are enrolled in <span className="text-emerald-400 font-semibold">{student.enrolledCourses?.length || 0} courses</span>.
                                Continue where you left off.
                            </p>
                        </div>
                        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-600/10 to-transparent pointer-events-none"></div>
                    </div>

                    {/* My Courses */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <LayoutDashboard className="w-5 h-5 text-emerald-500" />
                            My Courses
                        </h2>

                        {student.enrolledCourses && student.enrolledCourses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {student.enrolledCourses.map((courseName, index) => (
                                    <div key={index} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all hover:-translate-y-1 shadow-lg">
                                        <div className="h-32 bg-slate-800 relative">
                                            {/* Placeholder Course Art */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                                <BookOpen className="w-12 h-12 text-slate-700 group-hover:text-emerald-500/50 transition-colors" />
                                            </div>
                                            <div className="absolute top-3 right-3 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                                                Active
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{courseName}</h3>
                                            <p className="text-sm text-slate-400 mb-4">Master the fundamentals and advanced concepts.</p>

                                            <div className="w-full bg-slate-800 h-1.5 rounded-full mb-4 overflow-hidden">
                                                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '0%' }}></div>
                                            </div>

                                            <button className="w-full py-2.5 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 rounded-xl font-medium transition-all flex items-center justify-center gap-2 group-hover:bg-emerald-600 group-hover:text-white">
                                                <PlayCircle className="w-4 h-4" />
                                                Start Learning
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                                    <BookOpen className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-medium text-white mb-1">No Courses Found</h3>
                                <p className="text-slate-500 max-w-sm mx-auto mb-6">You haven't been enrolled in any courses yet. Please contact the administrator.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
