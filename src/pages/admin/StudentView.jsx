import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Mail,
    Phone,
    Calendar,
    Shield,
    BookOpen,
    Lock,
    Key,
    ArrowLeft,
    Loader2,
    CheckCircle,
    Copy,
    Edit,
    X,
    AlertCircle,
    Save,
    MessageCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { sendWelcomeEmail, generatePassword } from '../../utils/emailService';

const StudentView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState(null);

    // Enrollment States
    const [enrollModalOpen, setEnrollModalOpen] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [generatedCredentials, setGeneratedCredentials] = useState(null);

    useEffect(() => {
        fetchStudentDetails();
        fetchCourses();
    }, [id]);

    const fetchStudentDetails = async () => {
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
                .eq('id', id)
                .single();

            if (error) throw error;

            // Fetch LMS credentials
            const { data: lmsData } = await supabase
                .from('lms_users')
                .select('*')
                .eq('student_id', id)
                .single();

            setStudent({
                ...data,
                lms_account: lmsData,
                enrolledCourses: data.enrollments?.map(e => e.courses?.course_name) || []
            });
        } catch (error) {
            console.error('Error fetching student:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .eq('is_active', true)
                .order('course_name');

            if (data) setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handlePaymentVerificationAndEnroll = async () => {
        if (!selectedCourseId) {
            alert('Please select a course');
            return;
        }

        setIsProcessing(true);
        try {
            const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
            const course = courses.find(c => c.id === parseInt(selectedCourseId));

            if (!course) throw new Error('Course not found');

            // 1. Update status
            const { error: updateError } = await supabase
                .from('registered_student')
                .update({
                    payment_status: 'Paid',
                    account_status: 'Active',
                    payment_verified_at: new Date().toISOString(),
                    verified_by: adminUser.username || 'Admin'
                })
                .eq('id', id);

            if (updateError) throw updateError;

            // 2. LMS User
            let password = generatePassword();
            const { data: newLmsUser, error: lmsError } = await supabase
                .from('lms_users')
                .insert([{
                    student_id: id,
                    email: student.email,
                    password: password,
                    is_active: true
                }])
                .select()
                .single();

            if (lmsError) throw lmsError;

            // 3. Enrollment
            await supabase
                .from('enrollments')
                .insert([{
                    student_id: id,
                    lms_user_id: newLmsUser.id,
                    course_id: parseInt(selectedCourseId),
                    enrolled_by: adminUser.username || 'Admin',
                    status: 'active'
                }]);

            // 4. Email
            await sendWelcomeEmail(student.email, {
                email: student.email,
                password: password,
                courseName: course.course_name
            });

            setGeneratedCredentials({
                email: student.email,
                password: password,
                courseName: course.course_name
            });

            // Refresh student data
            await fetchStudentDetails();

        } catch (error) {
            console.error('Enrollment error:', error);
            alert(error.message || 'Error processing enrollment');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleWhatsAppSend = () => {
        if (!student || !student.lms_account) return;

        // Clean phone number (remove non-digits)
        const phoneNumber = student.whatsapp.replace(/\D/g, '');
        const message = `Hello ${student.name}! 🎓\n\nYour LMS access for SkillNexo has been provisioned.\n\n📧 Email: ${student.lms_account.email}\n🔑 Password: ${student.lms_account.password}\n\nYou can log in at: ${window.location.origin}/lms\n\nHappy Learning! 🚀`;
        const encodedMessage = encodeURIComponent(message);

        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    };

    const handleWhatsAppWelcome = () => {
        if (!student || !student.whatsapp) return;
        const phoneNumber = student.whatsapp.replace(/\D/g, '');
        const message = `ස්තූතියි! 🙌
*SkillNexo – Web Development + AI/ML පාඨමාලාව* සමඟ ලියාපදිංචි වීම ගැන ඔබව අපි සාදරයෙන් පිළිගන්නවා. 🚀

අපගේ පාඨමාලාව සහ ඉගෙනුම් ක්‍රියාවලිය පිළිබඳ සම්පූර්ණ අවබෝධයක් ලබාගැනීමට කරුණාකර පහත වීඩියෝ *පිළිවෙළින්* නරඹන්න.

1️⃣ *පාඨමාලාව පිළිබඳ හැඳින්වීම*
https://youtu.be/9NMjgumglbI

2️⃣ *LMS (Learning Management System) භාවිතා කරන ආකාරය*
https://youtu.be/dblVFYnYh2g

3️⃣ *පාඨමාලා විෂය මාලාව (Roadmap) පැහැදිලි කිරීම*
https://youtu.be/OPqqEzMApzw

---

💳 *පාඨමාලාව සඳහා ගෙවීම් සිදු කිරීමට අවශ්‍ය නම්, කරුණාකර පහත බැංකු ගිණුම් විස්තර භාවිතා කරන්න.*

🏦 *Bank Details*

Bank Name: [බැංකුවේ නම]
Account Name: [ගිණුම් හිමියාගේ නම]
Account Number: [ගිණුම් අංකය]
Branch: [ශාඛාව]

📌 ගෙවීම සිදු කරන විට *Reference Number* සහ *Remarks* දෙකම සඳහා *ඔබගේ දුරකථන අංකය ඇතුළත් කරන්න.*

📌 ගෙවීම සිදු කළ පසු, කරුණාකර *ගෙවීම් රිසිට්පත (Payment Receipt)* අප වෙත *WhatsApp මගින් එවන්න.*

---

📩 පාඨමාලාව සම්බන්ධයෙන් ඔබට කිසියම් ගැටලුවක් තිබේ නම්, හෝ පාඨමාලාව මෙහෙයවන *Instructor – Sehan Arandara* සමඟ සම්බන්ධ වීමට අවශ්‍ය නම්, කරුණාකර අප වෙත පණිවිඩයක් එවන්න.

අපි ඔබට සහාය වීමට සැමවිටම සූදානම්. 🤝

ස්තූතියි!
*Team SkillNexo* 💻🧠`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(type);
        setTimeout(() => setCopySuccess(null), 2000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!student) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-400">Student not found.</p>
                <button
                    onClick={() => navigate('/AdminPanel/students')}
                    className="mt-4 text-blue-400 hover:underline"
                >
                    Back to Students
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in text-left">
            <button
                onClick={() => navigate('/AdminPanel/students')}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Students
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl">
                        {student.name?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{student.name}</h1>
                        <div className="flex flex-wrap gap-2">
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${student.payment_status === 'Paid'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                }`}>
                                PAYMENT: {student.payment_status?.toUpperCase() || 'PENDING'}
                            </span>
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${student.account_status === 'Active'
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}>
                                STATUS: {student.account_status?.toUpperCase() || 'INACTIVE'}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => navigate(`/AdminPanel/students/${student.id}/edit`)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 justify-center"
                >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Basic Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
                        <h3 className="text-lg font-semibold text-white mb-6">Contact & Registration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <DetailItem icon={<Mail className="w-4 h-4 text-blue-400" />} label="Email Address" value={student.email} />
                            <div className="space-y-4">
                                <DetailItem icon={<Phone className="w-4 h-4 text-emerald-400" />} label="WhatsApp Number" value={student.whatsapp} />
                                <button
                                    onClick={handleWhatsAppWelcome}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-all"
                                >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    SEND WELCOME MESSAGE
                                </button>
                            </div>
                            <DetailItem icon={<Calendar className="w-4 h-4 text-purple-400" />} label="Registration Date" value={new Date(student.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })} />
                            <DetailItem icon={<Shield className="w-4 h-4 text-amber-400" />} label="Verified By" value={student.verified_by || 'Not Verified'} />
                        </div>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-400" /> Enrolled Courses
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {student.enrolledCourses?.length > 0 ? (
                                student.enrolledCourses.map((c, i) => (
                                    <div key={i} className="px-5 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-sm text-slate-200 font-medium whitespace-nowrap shadow-sm">
                                        {c}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 w-full border-2 border-dashed border-slate-800 rounded-2xl">
                                    <p className="text-sm text-slate-500 italic">No courses enrolled yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Credentials */}
                <div className="space-y-8">
                    <div className="bg-blue-600/5 border border-blue-500/10 rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                            <Lock className="w-32 h-32" />
                        </div>
                        <h3 className="text-lg font-semibold text-blue-400 mb-6 flex items-center gap-2">
                            <Key className="w-5 h-5" /> LMS Access
                        </h3>

                        {student.lms_account ? (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Username / Email</p>
                                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 group/item">
                                        <span className="text-sm text-slate-200 font-mono truncate flex-1">{student.lms_account.email}</span>
                                        <button
                                            onClick={() => copyToClipboard(student.lms_account.email, 'email')}
                                            className="text-slate-500 hover:text-blue-400 transition-colors"
                                        >
                                            {copySuccess === 'email' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</p>
                                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 group/item">
                                        <span className="text-sm text-blue-400 font-mono font-bold truncate flex-1">{student.lms_account.password}</span>
                                        <button
                                            onClick={() => copyToClipboard(student.lms_account.password, 'pass')}
                                            className="text-slate-500 hover:text-blue-400 transition-colors"
                                        >
                                            {copySuccess === 'pass' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-blue-500/10 space-y-4">
                                    <div className="flex items-center gap-2 text-xs text-blue-300/60 italic">
                                        <Mail className="w-3.5 h-3.5" />
                                        Credentials were sent via email.
                                    </div>

                                    <button
                                        onClick={handleWhatsAppSend}
                                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black tracking-widest transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        SEND VIA WHATSAPP
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-sm text-slate-500 mb-6">No LMS account provisioned.</p>
                                <button
                                    onClick={() => setEnrollModalOpen(true)}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
                                >
                                    PROVISION ACCOUNT
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Account Provisioning Modal */}
            {enrollModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in text-left">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Provision LMS Access</h3>
                            <button onClick={() => { setEnrollModalOpen(false); setGeneratedCredentials(null); }} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8">
                            {!generatedCredentials ? (
                                <div className="space-y-6">
                                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                                        <p className="text-xs text-amber-200 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            <span>Provisioning will mark the student as <b>Paid</b> and <b>Active</b>.</span>
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Initial Course</label>
                                        <select
                                            value={selectedCourseId}
                                            onChange={(e) => setSelectedCourseId(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-blue-500 transition-all cursor-pointer"
                                        >
                                            <option value="">-- Choose Course --</option>
                                            {courses.map(c => (
                                                <option key={c.id} value={c.id}>{c.course_name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        onClick={handlePaymentVerificationAndEnroll}
                                        disabled={isProcessing}
                                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                        Confirm & Send Email
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6 text-center animate-fade-in">
                                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-bold text-white">Access Provisioned!</h4>
                                    <p className="text-sm text-slate-400">Account created and welcome email sent to {student.email}</p>

                                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left space-y-3">
                                        <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
                                            <span className="text-xs text-slate-500 font-bold uppercase">Pass:</span>
                                            <span className="text-sm text-blue-400 font-mono font-bold bg-blue-500/10 px-2 py-1 rounded w-fit">{generatedCredentials.password}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => { setEnrollModalOpen(false); setGeneratedCredentials(null); }}
                                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-medium"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailItem = ({ icon, label, value }) => (
    <div className="space-y-2">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            {icon} {label}
        </p>
        <p className="text-slate-200 text-lg font-medium break-all">{value || 'N/A'}</p>
    </div>
);

export default StudentView;
