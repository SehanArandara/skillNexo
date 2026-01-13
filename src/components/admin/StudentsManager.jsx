import React, { useState } from 'react';
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
    BookOpen
} from 'lucide-react';
import initialStudents from '../../data/students.json';
import coursesData from '../../data/courses.json';

const StudentsManager = () => {
    const [students, setStudents] = useState(initialStudents);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All'); // All, Active, Inactive, Pending Payment
    const [notification, setNotification] = useState(null);

    // Enrollment Modal State
    const [enrollModalOpen, setEnrollModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [generatedCredentials, setGeneratedCredentials] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const openEnrollModal = (student) => {
        setSelectedStudent(student);
        setSelectedCourseId('');
        setGeneratedCredentials(null);
        setEnrollModalOpen(true);
    };

    const handleEnrollAndPay = () => {
        if (!selectedCourseId) {
            showNotification('Please select a course', 'error');
            return;
        }

        const courseToEnroll = coursesData.find(c => c.id === parseInt(selectedCourseId));
        if (!courseToEnroll) return;

        // Generate temporary password
        const autoPassword = `LMS@${Math.floor(1000 + Math.random() * 9000)}`;

        setStudents(students.map(student => {
            if (student.id === selectedStudent.id) {
                const currentCourses = student.enrolledCourses || [];
                // Avoid duplicate enrollment
                const newCourses = currentCourses.includes(courseToEnroll.courseName)
                    ? currentCourses
                    : [...currentCourses, courseToEnroll.courseName];

                return {
                    ...student,
                    paymentStatus: 'Paid',
                    accountStatus: 'Active', // Auto-activate
                    enrolledCourses: newCourses,
                    tempPassword: autoPassword // Store for demo purposes
                };
            }
            return student;
        }));

        setGeneratedCredentials({
            email: selectedStudent.email,
            password: autoPassword,
            course: courseToEnroll.courseName
        });

        showNotification('Payment verified & User enrolled successfully!');
    };

    const toggleAccountStatus = (id) => {
        setStudents(students.map(student => {
            if (student.id === id) {
                const newStatus = student.accountStatus === 'Active' ? 'Inactive' : 'Active';
                const newPaymentStatus = newStatus === 'Active' ? 'Paid' : 'Pending'; // Auto-update payment for simplicity, or keep separate

                showNotification(
                    `User ${student.name} is now ${newStatus}`,
                    newStatus === 'Active' ? 'success' : 'error'
                );

                return {
                    ...student,
                    accountStatus: newStatus,
                    paymentStatus: newPaymentStatus
                };
            }
            return student;
        }));
    };

    const handlePaymentUpdate = (id, status) => {
        setStudents(students.map(student =>
            student.id === id ? { ...student, paymentStatus: status } : student
        ));
        showNotification('Payment status updated', 'success');
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.whatsapp.includes(searchTerm);

        const matchesFilter =
            filterStatus === 'All' ||
            student.accountStatus === filterStatus;

        return matchesSearch && matchesFilter;
    });

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
                                                    {student.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-200">{student.name}</p>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                                        <Calendar className="w-3 h-3" />
                                                        {student.registeredDate}
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
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${student.paymentStatus === 'Paid'
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                <DollarSign className="w-3 h-3" />
                                                {student.paymentStatus}
                                            </span>
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
                                                    onClick={() => openEnrollModal(student)}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                                                    title="Review Payment & Enroll"
                                                >
                                                    <BookOpen className="w-3.5 h-3.5" />
                                                    Enroll
                                                </button>

                                                <button
                                                    onClick={() => toggleAccountStatus(student.id)}
                                                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${student.accountStatus === 'Active'
                                                            ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                                                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                                        }`}
                                                >
                                                    {student.accountStatus === 'Active' ? (
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
                                            {coursesData.filter(c => c.isActive).map(course => (
                                                <option key={course.id} value={course.id}>
                                                    {course.courseName} ({course.durationDays} Days)
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            onClick={() => setEnrollModalOpen(false)}
                                            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleEnrollAndPay}
                                            className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-500 rounded-lg shadow-lg shadow-green-500/20 flex items-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Confirm Payment & Enroll
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
                                        <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Auto-Generated Credentials</h5>
                                        <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
                                            <span className="text-slate-500">Email:</span>
                                            <span className="text-slate-200 font-mono select-all">{generatedCredentials.email}</span>
                                            <span className="text-slate-500">Password:</span>
                                            <span className="text-slate-200 font-mono select-all font-bold bg-slate-800 px-2 rounded w-fit">
                                                {generatedCredentials.password}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 italic mt-2">
                                            * Please copy and share these credentials with the student securely. An email would typically be sent here.
                                        </p>
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
        </div>
    );
};

export default StudentsManager;
