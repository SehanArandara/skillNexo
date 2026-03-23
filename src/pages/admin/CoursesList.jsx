import React, { useState } from 'react';
import {
    Plus,
    Edit2,
    Trash2,
    Search,
    X,
    CheckCircle,
    AlertCircle,
    Clock,
    Calendar,
    Tag,
    User,
    Loader2,
    Map
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import RoadmapManager from '../../components/admin/RoadmapManager';

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl scale-in-95">
                <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4 mx-auto">
                    <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2">Delete Course?</h3>
                <p className="text-sm text-slate-400 text-center mb-6">
                    Are you sure you want to delete this course? This action implies removing all related data and cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02]"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const CoursesList = () => {
    const [courses, setCourses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);

    const [showRoadmap, setShowRoadmap] = useState(false);
    const [selectedCourseForRoadmap, setSelectedCourseForRoadmap] = useState(null);

    const fetchCourses = async () => {
        try {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;
            if (data) setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchCourses();
    }, []);

    const initialFormState = {
        courseName: '',
        instructor: '',
        durationDays: '',
        onlineClasses: '',
        category: 'Web Dev',
        isActive: true,
        remark: '',
        recordingListUrl: '',
        resourceUrl: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    const categories = ['AI ML', 'Web Dev', 'Mobile Dev', 'Data Science', 'Cloud Computing', 'Other'];

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleAddNew = () => {
        setFormData(initialFormState);
        setEditingId(null);
        setShowForm(true);
    };

    const handleEdit = (course) => {
        setFormData({
            courseName: course.course_name,
            instructor: course.instructor,
            durationDays: course.duration_days,
            onlineClasses: course.online_classes,
            category: course.category,
            isActive: course.is_active,
            remark: course.remark || '',
            recordingListUrl: course.recording_list_url || '',
            resourceUrl: course.resource_url || ''
        });
        setEditingId(course.id);
        setShowForm(true);
    };

    const confirmDelete = (id) => {
        setCourseToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!courseToDelete) return;

        try {
            const { error } = await supabase
                .from('courses')
                .delete()
                .eq('id', courseToDelete);

            if (error) throw error;

            setCourses(courses.filter(c => c.id !== courseToDelete));
            showNotification('Course deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting course:', error);
            showNotification('Failed to delete course', 'error');
        } finally {
            setDeleteModalOpen(false);
            setCourseToDelete(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.courseName || !formData.instructor) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        try {
            if (editingId) {
                const { error } = await supabase
                    .from('courses')
                    .update({
                        course_name: formData.courseName,
                        instructor: formData.instructor,
                        duration_days: parseInt(formData.durationDays) || 0,
                        online_classes: formData.onlineClasses,
                        category: formData.category,
                        is_active: formData.isActive,
                        remark: formData.remark,
                        recording_list_url: formData.recordingListUrl,
                        resource_url: formData.resourceUrl
                    })
                    .eq('id', editingId);

                if (error) throw error;
                showNotification('Course updated successfully');
            } else {
                const { error } = await supabase
                    .from('courses')
                    .insert([{
                        course_name: formData.courseName,
                        instructor: formData.instructor,
                        duration_days: parseInt(formData.durationDays) || 0,
                        online_classes: formData.onlineClasses,
                        category: formData.category,
                        is_active: formData.isActive,
                        remark: formData.remark,
                        recording_list_url: formData.recordingListUrl,
                        resource_url: formData.resourceUrl
                    }]);

                if (error) throw error;
                showNotification('Course created successfully');
            }
            fetchCourses();
            setShowForm(false);
        } catch (error) {
            console.error('Error saving course:', error);
            showNotification('Failed to save course', 'error');
        }
    };

    const filteredCourses = courses.filter(course =>
        (course.course_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (course.instructor?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p>Loading courses...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col mb-8 text-left">
                <h1 className="text-3xl font-bold text-white tracking-tight animate-fade-in">Courses</h1>
                <p className="text-slate-400 text-sm mt-1">Manage curriculum and active courses.</p>
            </div>

            <DeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
            />
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>
                <button
                    onClick={handleAddNew}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Add New Course
                </button>
            </div>

            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl animate-fade-in ${notification.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                    {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span>{notification.message}</span>
                </div>
            )}

            {/* Course Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {filteredCourses.map((course) => (
                    <div key={course.id} className="bg-slate-900/40 backdrop-blur border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-bold text-slate-100">{course.course_name}</h3>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${course.is_active
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                        }`}>
                                        {course.is_active ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-blue-400">
                                    <User className="w-3 h-3" />
                                    {course.instructor}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setSelectedCourseForRoadmap(course);
                                        setShowRoadmap(true);
                                    }}
                                    className="p-2 bg-slate-800 hover:bg-emerald-600/20 text-slate-400 hover:text-emerald-400 rounded-lg transition-colors"
                                    title="Manage Roadmap"
                                >
                                    <Map className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleEdit(course)}
                                    className="p-2 bg-slate-800 hover:bg-blue-600/20 text-slate-400 hover:text-blue-400 rounded-lg transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => confirmDelete(course.id)}
                                    className="p-2 bg-slate-800 hover:bg-red-600/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="p-2 bg-slate-950/50 rounded-lg border border-slate-800/50 text-left">
                                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Duration
                                </p>
                                <p className="text-sm text-slate-300">{course.duration_days} Days</p>
                            </div>
                            <div className="p-2 bg-slate-950/50 rounded-lg border border-slate-800/50 text-left">
                                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                                    <Tag className="w-3 h-3" /> Category
                                </p>
                                <p className="text-sm text-slate-300">{course.category}</p>
                            </div>
                        </div>

                        <div className="space-y-2 text-left">
                            <div className="text-sm text-slate-400 flex items-start gap-2">
                                <Calendar className="w-4 h-4 mt-0.5 shrink-0" />
                                <span className="text-xs md:text-sm">{course.online_classes}</span>
                            </div>
                            {course.remark && (
                                <div className="text-sm text-slate-500 italic border-l-2 border-slate-700 pl-3">
                                    "{course.remark}"
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-800 p-6 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold text-white">
                                {editingId ? 'Edit Course' : 'Create New Course'}
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="p-1 hover:bg-slate-800 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-300">Course Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.courseName}
                                        onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                        placeholder="e.g. Advanced AI Integration"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Instructor</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.instructor}
                                        onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Course Instructor"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Duration (Days)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.durationDays}
                                        onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                        placeholder="e.g. 60"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Status</label>
                                    <div className="flex items-center gap-4 mt-2">
                                        <label className="flex items-center cursor-pointer gap-2">
                                            <input
                                                type="radio"
                                                name="status"
                                                checked={formData.isActive}
                                                onChange={() => setFormData({ ...formData, isActive: true })}
                                                className="w-4 h-4 text-blue-600 bg-slate-900 border-slate-700 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-slate-300">Active</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer gap-2">
                                            <input
                                                type="radio"
                                                name="status"
                                                checked={!formData.isActive}
                                                onChange={() => setFormData({ ...formData, isActive: false })}
                                                className="w-4 h-4 text-red-600 bg-slate-900 border-slate-700 focus:ring-red-500"
                                            />
                                            <span className="text-sm text-slate-300">Inactive</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-300">Online Classes Schedule</label>
                                    <input
                                        type="text"
                                        value={formData.onlineClasses}
                                        onChange={(e) => setFormData({ ...formData, onlineClasses: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                        placeholder="e.g. 16 days / 8 weeks - 2 classes for one week"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-300">Course Recording List URL</label>
                                    <input
                                        type="url"
                                        value={formData.recordingListUrl}
                                        onChange={(e) => setFormData({ ...formData, recordingListUrl: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                        placeholder="e.g. https://docs.google.com/document/..."
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-300">Course Resources Drive Link</label>
                                    <input
                                        type="url"
                                        value={formData.resourceUrl}
                                        onChange={(e) => setFormData({ ...formData, resourceUrl: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                        placeholder="e.g. https://drive.google.com/drive/folders/..."
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-300">Remarks</label>
                                    <textarea
                                        value={formData.remark}
                                        onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all min-h-[80px]"
                                        placeholder="Additional notes..."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {editingId ? 'Save Changes' : 'Create Course'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Roadmap Manager Modal */}
            {showRoadmap && selectedCourseForRoadmap && (
                <RoadmapManager
                    course={selectedCourseForRoadmap}
                    onClose={() => {
                        setShowRoadmap(false);
                        setSelectedCourseForRoadmap(null);
                    }}
                />
            )}
        </div>
    );
};

export default CoursesList;
