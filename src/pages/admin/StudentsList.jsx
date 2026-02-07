import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    CheckCircle,
    AlertCircle,
    Mail,
    Phone,
    Calendar,
    DollarSign,
    BookOpen,
    Edit,
    Loader2,
    Eye,
    MessageCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const StudentsList = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleWhatsAppSend = (student) => {
        if (!student || !student.whatsapp) return;
        const phoneNumber = student.whatsapp.replace(/\D/g, '');
        window.open(`https://wa.me/${phoneNumber}`, '_blank');
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('registered_student')
                .select(`
                    *,
                    enrollments (
                        id,
                        course_id,
                        courses (
                            course_name
                        )
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const transformedStudents = data.map(student => ({
                ...student,
                enrolledCourses: student.enrollments?.map(e => e.courses?.course_name) || []
            }));

            setStudents(transformedStudents);
        } catch (error) {
            console.error('Error fetching students:', error);
            showNotification('Error loading students', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.whatsapp?.includes(searchTerm);

        const matchesFilter =
            filterStatus === 'All' ||
            student.account_status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col mb-8 text-left">
                <h1 className="text-3xl font-bold text-white tracking-tight animate-fade-in">Students</h1>
                <p className="text-slate-400 text-sm mt-1">View and manage all registered students.</p>
            </div>

            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>

                <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                    {['All', 'Active', 'Inactive'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${filterStatus === status
                                ? 'bg-slate-800 text-white shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl animate-fade-in ${notification.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                    {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span>{notification.message}</span>
                </div>
            )}

            {/* Students Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400">
                                <th className="px-6 py-4 font-medium">Student Info</th>
                                <th className="px-6 py-4 font-medium">Contact</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Enrolled Courses</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-800/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                                    {student.name?.substring(0, 2).toUpperCase() || '??'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-200">{student.name}</p>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(student.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    <span className="text-slate-300">{student.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    <span className="text-slate-300">{student.whatsapp}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border w-fit ${student.payment_status === 'Paid'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                    }`}>
                                                    <DollarSign className="w-3 h-3" />
                                                    {student.payment_status?.toUpperCase() || 'PENDING'}
                                                </span>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border w-fit ${student.account_status === 'Active'
                                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                                                    }`}>
                                                    {student.account_status?.toUpperCase() || 'INACTIVE'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {student.enrolledCourses.length > 0 ? (
                                                    student.enrolledCourses.map((course, idx) => (
                                                        <span key={idx} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700">
                                                            {course}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-slate-600 italic text-xs">No courses enrolled</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 text-xs">
                                                <button
                                                    onClick={() => navigate(`/AdminPanel/students/${student.id}/edit`)}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                                                >
                                                    <Edit className="w-3.5 h-3.5" />
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleWhatsAppSend(student)}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                                                    title="Chat on WhatsApp"
                                                >
                                                    <MessageCircle className="w-3.5 h-3.5" />
                                                </button>

                                                <button
                                                    onClick={() => navigate(`/AdminPanel/students/${student.id}`)}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-all"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    View Details
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <Search className="w-8 h-8 opacity-20" />
                                            <p>No students found matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentsList;
