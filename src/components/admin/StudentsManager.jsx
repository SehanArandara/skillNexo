import React, { useState, useEffect } from 'react';
import {
    Search,
    CheckCircle,
    XCircle,
    AlertCircle,
    MoreVertical,
    Mail,
    Phone,
    Calendar,
    DollarSign,
    UserCheck,
    UserX,
    BookOpen,
    Edit,
    Send,
    Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { sendWelcomeEmail, generatePassword } from '../../utils/emailService';


const StudentsManager = () => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modals & Selections
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [enrollModalOpen, setEnrollModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [generatedCredentials, setGeneratedCredentials] = useState(null);

    // Action Confirmation States
    const [confirmModal, setConfirmModal] = useState({ open: false, type: '', data: null });

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    // Fetch students and courses from Supabase
    useEffect(() => {
        fetchStudents();
        fetchCourses();
    }, []);

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
            console.log(data);
            // Transform data to match our UI structure
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

    const fetchCourses = async () => {
        try {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .eq('is_active', true)
                .order('course_name');

            if (error) throw error;
            setCourses(data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const openEditModal = (student) => {
        setEditingStudent({ ...student });
        setEditModalOpen(true);
    };

    const handleEditStudent = async () => {
        try {
            const { error } = await supabase
                .from('registered_student')
                .update({
                    name: editingStudent.name,
                    email: editingStudent.email,
                    whatsapp: editingStudent.whatsapp
                })
                .eq('id', editingStudent.id);

            if (error) throw error;

            showNotification('Student details updated successfully');
            setEditModalOpen(false);
            fetchStudents(); // Refresh list
        } catch (error) {
            console.error('Error updating student:', error);
            showNotification('Error updating student', 'error');
        }
    };

    const handleUpdatePaymentStatus = async (student, newStatus) => {
        try {
            const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
            console.log(newStatus)
            const { error } = await supabase
                .from('registered_student')
                .update({
                    payment_status: newStatus,
                    verified_by: adminUser.username || 'Admin'
                })
                .eq('id', student.id);

            if (error) throw error;

            showNotification(`Payment status for ${student.name} updated to ${newStatus}`);
            fetchStudents();
            setConfirmModal({ open: false, type: '', data: null });
        } catch (error) {
            console.error('Error updating payment:', error);
            showNotification('Failed to update payment status', 'error');
        }
    };

    const openEnrollModal = (student) => {
        setSelectedStudent(student);
        setSelectedCourseId('');
        setGeneratedCredentials(null);
        setEnrollModalOpen(true);
    };

    const handlePaymentVerificationAndEnroll = async () => {
        if (!selectedCourseId) {
            showNotification('Please select a course', 'error');
            return;
        }

        setIsSendingEmail(true);
        try {
            const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
            const course = courses.find(c => c.id === parseInt(selectedCourseId));

            if (!course) {
                throw new Error('Course not found');
            }

            // 1. Update payment status
            const { error: updateError } = await supabase
                .from('registered_student')
                .update({
                    payment_status: 'Paid',
                    account_status: 'Active',
                    payment_verified_at: new Date().toISOString(),
                    verified_by: adminUser.username || 'Admin'
                })
                .eq('id', selectedStudent.id);

            if (updateError) throw updateError;

            // 2. Check if LMS user already exists
            const { data: existingLmsUser } = await supabase
                .from('lms_users')
                .select('*')
                .eq('student_id', selectedStudent.id)
                .single();

            let lmsUserId;
            let password;

            if (existingLmsUser) {
                lmsUserId = existingLmsUser.id;
                password = existingLmsUser.password;

                // Activate the account if it was deactivated
                await supabase
                    .from('lms_users')
                    .update({ is_active: true })
                    .eq('id', lmsUserId);
            } else {
                // 3. Create LMS user with generated password
                password = generatePassword();
                const { data: newLmsUser, error: lmsError } = await supabase
                    .from('lms_users')
                    .insert([{
                        student_id: selectedStudent.id,
                        email: selectedStudent.email,
                        password: password,
                        is_active: true
                    }])
                    .select()
                    .single();

                if (lmsError) throw lmsError;
                lmsUserId = newLmsUser.id;
            }

            // 4. Create enrollment record
            const { error: enrollError } = await supabase
                .from('enrollments')
                .insert([{
                    student_id: selectedStudent.id,
                    lms_user_id: lmsUserId,
                    course_id: parseInt(selectedCourseId),
                    enrolled_by: adminUser.username || 'Admin',
                    status: 'active'
                }]);

            // If enrollment already exists, that's okay (unique constraint will prevent duplicate)
            if (enrollError && !enrollError.message.includes('duplicate')) {
                throw enrollError;
            }

            // 5. Send welcome email with credentials
            const emailResult = await sendWelcomeEmail(selectedStudent.email, {
                email: selectedStudent.email,
                password: password,
                courseName: course.course_name
            });

            setGeneratedCredentials({
                email: selectedStudent.email,
                password: password,
                courseName: course.course_name
            });

            showNotification('Payment verified, student enrolled, and email sent!');
            fetchStudents(); // Refresh the list

        } catch (error) {
            console.error('Error in enrollment process:', error);
            showNotification(error.message || 'Error processing enrollment', 'error');
        } finally {
            setIsSendingEmail(false);
        }
    };

    const toggleAccountStatus = async (student) => {
        try {
            const newStatus = student.account_status === 'Active' ? 'Inactive' : 'Active';

            // Update registered student
            const { error: studentError } = await supabase
                .from('registered_student')
                .update({ account_status: newStatus })
                .eq('id', student.id);

            if (studentError) throw studentError;

            // Update LMS user if exists
            await supabase
                .from('lms_users')
                .update({ is_active: newStatus === 'Active' })
                .eq('student_id', student.id);

            showNotification(
                `Student ${student.name} is now ${newStatus}`,
                newStatus === 'Active' ? 'success' : 'error'
            );

            fetchStudents();
            setConfirmModal({ open: false, type: '', data: null });
        } catch (error) {
            console.error('Error toggling account status:', error);
            showNotification('Error updating account status', 'error');
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
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search students by name, email, or whatsapp..."
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
                                <th className="px-6 py-4 font-medium">Payment Status</th>
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
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${student.payment_status === 'Paid'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                    }`}>
                                                    <DollarSign className="w-3 h-3" />
                                                    {student.payment_status || 'Pending'}
                                                </span>
                                                <button
                                                    onClick={() => setConfirmModal({
                                                        open: true,
                                                        type: 'payment',
                                                        data: student
                                                    })}
                                                    className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-blue-400 transition-colors"
                                                    title="Change payment status"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                </button>
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
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(student)}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-700 transition-all"
                                                    title="Edit student details"
                                                >
                                                    <Edit className="w-3.5 h-3.5" />
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => openEnrollModal(student)}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                                                    title="Verify Payment & Enroll"
                                                >
                                                    <BookOpen className="w-3.5 h-3.5" />
                                                    Enroll
                                                </button>

                                                <button
                                                    onClick={() => setConfirmModal({
                                                        open: true,
                                                        type: 'status',
                                                        data: student
                                                    })}
                                                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${student.account_status === 'Active'
                                                        ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                                                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                                        }`}
                                                >
                                                    {student.account_status === 'Active' ? (
                                                        <>
                                                            <UserX className="w-3.5 h-3.5" />
                                                            Deactivate
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserCheck className="w-3.5 h-3.5" />
                                                            Activate
                                                        </>
                                                    )}
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

            {/* Edit Student Modal */}
            {editModalOpen && editingStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in">
                        <div className="p-6 border-b border-slate-800">
                            <h3 className="text-xl font-bold text-white">Edit Student Details</h3>
                            <p className="text-sm text-slate-400 mt-1">Update student information</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={editingStudent.name}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={editingStudent.email}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">WhatsApp</label>
                                <input
                                    type="text"
                                    value={editingStudent.whatsapp}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, whatsapp: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditStudent}
                                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-500/20 flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Enrollment Modal */}
            {enrollModalOpen && selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in">
                        <div className="p-6 border-b border-slate-800">
                            <h3 className="text-xl font-bold text-white">Enrollment & Payment Review</h3>
                            <p className="text-sm text-slate-400 mt-1">Reviewing for: <span className="text-slate-200">{selectedStudent.name}</span></p>
                        </div>

                        <div className="p-6 space-y-6">
                            {!generatedCredentials ? (
                                <>
                                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                        <h4 className="flex items-center gap-2 text-amber-400 font-medium mb-2">
                                            <AlertCircle className="w-4 h-4" /> Payment Status Confirmation
                                        </h4>
                                        <p className="text-xs text-slate-400">
                                            By proceeding, you confirm that you have received the payment from this student. This action will mark them as <b>Paid</b> and <b>Active</b>.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-slate-300">Select Course to Enroll</label>
                                        <select
                                            value={selectedCourseId}
                                            onChange={(e) => setSelectedCourseId(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 outline-none focus:border-blue-500"
                                        >
                                            <option value="">-- Select a Course --</option>
                                            {courses.map(course => (
                                                <option key={course.id} value={course.id}>
                                                    {course.course_name} ({course.duration_days} Days)
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            onClick={() => setEnrollModalOpen(false)}
                                            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
                                            disabled={isSendingEmail}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handlePaymentVerificationAndEnroll}
                                            disabled={isSendingEmail}
                                            className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-500 rounded-lg shadow-lg shadow-green-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSendingEmail ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Confirm & Send Email
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mb-4">
                                            <CheckCircle className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-lg font-bold text-white">Enrollment Successful!</h4>
                                        <p className="text-sm text-slate-400">The student has been activated and enrolled.</p>
                                    </div>

                                    <div className="bg-slate-950 border border-slate-700 rounded-xl p-4 space-y-3">
                                        <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Login Credentials (Email Sent)</h5>
                                        <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                                            <span className="text-slate-500">Email:</span>
                                            <span className="text-slate-200 font-mono select-all">{generatedCredentials.email}</span>
                                            <span className="text-slate-500">Password:</span>
                                            <span className="text-slate-200 font-mono select-all font-bold bg-slate-800 px-2 rounded w-fit">
                                                {generatedCredentials.password}
                                            </span>
                                            <span className="text-slate-500">Course:</span>
                                            <span className="text-emerald-400 font-medium">{generatedCredentials.courseName}</span>
                                        </div>
                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-3">
                                            <p className="text-xs text-blue-300 flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5" />
                                                An email with these credentials has been sent to the student's email address.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setEnrollModalOpen(false)}
                                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium"
                                    >
                                        Done
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Global Confirmation Modal */}
            {confirmModal.open && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in divide-y divide-slate-800">
                        <div className="p-6">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${confirmModal.type === 'payment' ? 'bg-amber-500/20 text-amber-400' :
                                confirmModal.data?.account_status === 'Active' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                                }`}>
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white">
                                {confirmModal.type === 'payment' ? 'Update Payment Status' : 'Update Account Status'}
                            </h3>
                            <p className="text-slate-400 mt-2">
                                {confirmModal.type === 'payment' ? (
                                    <>Are you sure you want to change payment status for <span className="text-white font-medium">{confirmModal.data?.name}</span> to <b>{confirmModal.data?.payment_status === 'Paid' ? 'Pending' : 'Paid'}</b>?</>
                                ) : (
                                    <>Are you sure you want to <b>{confirmModal.data?.account_status === 'Active' ? 'Deactivate' : 'Activate'}</b> the account for <span className="text-white font-medium">{confirmModal.data?.name}</span>?</>
                                )}
                            </p>
                        </div>
                        <div className="p-6 flex gap-3">
                            <button
                                onClick={() => setConfirmModal({ open: false, type: '', data: null })}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (confirmModal.type === 'payment') {
                                        console.log(confirmModal.data);
                                        handleUpdatePaymentStatus(
                                            confirmModal.data,
                                            confirmModal.data.payment_status === 'Paid' ? 'Pending' : 'Paid'
                                        );
                                    } else {
                                        toggleAccountStatus(confirmModal.data);
                                    }
                                }}
                                className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium shadow-lg transition-all ${confirmModal.type === 'payment' ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20' :
                                    confirmModal.data?.account_status === 'Active' ? 'bg-red-600 hover:bg-red-500 shadow-red-500/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                                    }`}
                            >
                                Confirm Action
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentsManager;
