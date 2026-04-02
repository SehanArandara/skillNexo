import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ChevronLeft,
    Flame,
    Lock,
    PlayCircle,
    CheckCircle2,
    Calendar,
    Video,
    FileText,
    HelpCircle,
    BookOpen,
    ArrowRight,
    Loader2,
    Trophy,
    Target,
    Link as LinkIcon,
    X,
    TrendingUp,
    AlertCircle,
    GraduationCap,
    ListVideo,
    FolderOpen,
    Layers,
    ExternalLink,
    CheckSquare,
    Square
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

const CourseRoadmap = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [roadmap, setRoadmap] = useState([]);
    const [progress, setProgress] = useState([]);
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedStep, setSelectedStep] = useState(null);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizResult, setQuizResult] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const studentUser = JSON.parse(localStorage.getItem('studentUser') || '{}');

    useEffect(() => {
        if (!studentUser.id) {
            navigate('/lms');
            return;
        }
        fetchCourseData();
    }, [courseId]);

    const fetchCourseData = async () => {
        setLoading(true);
        try {
            const { data: courseData, error: courseError } = await supabase
                .from('courses')
                .select('*')
                .eq('id', courseId)
                .single();
            if (courseError) throw courseError;
            setCourse(courseData);

            // Security check
            const { data: userData, error: userError } = await supabase
                .from('lms_users')
                .select('is_active')
                .eq('id', studentUser.id)
                .single();

            if (userError || (userData && !userData.is_active)) {
                localStorage.removeItem('isStudentAuthenticated');
                localStorage.removeItem('studentUser');
                navigate('/lms');
                return;
            }

            const { data: roadmapData, error: roadmapError } = await supabase
                .from('course_roadmap')
                .select('*')
                .eq('course_id', courseId)
                .order('sort_order', { ascending: true });
            if (roadmapError) throw roadmapError;
            setRoadmap(roadmapData || []);

            const { data: progressData, error: progressError } = await supabase
                .from('student_progress')
                .select('*')
                .eq('student_id', studentUser.id)
                .eq('course_id', courseId);
            if (progressError) throw progressError;
            setProgress(progressData || []);

            const { data: streakData } = await supabase
                .from('student_streaks')
                .select('current_streak')
                .eq('student_id', studentUser.id)
                .eq('course_id', courseId)
                .single();
            setStreak(streakData?.current_streak || 0);

        } catch (error) {
            console.error('Error fetching course data:', error);
        } finally {
            setLoading(false);
        }
    };

    const isStepCompleted = (stepId) => progress.some(p => p.step_id === stepId);

    // ── Group roadmap steps by day_number
    const groupedByDay = roadmap.reduce((acc, step) => {
        const key = step.day_number;
        if (!acc[key]) acc[key] = [];
        acc[key].push(step);
        return acc;
    }, {});

    const sortedDayKeys = Object.keys(groupedByDay).map(Number).sort((a, b) => a - b);

    // A full "day group" is completed only when ALL activities in it are done
    const isDayGroupCompleted = (dayNumber) => {
        const steps = groupedByDay[dayNumber] || [];
        return steps.every(s => isStepCompleted(s.id));
    };

    // A day group is locked if the previous group is not fully completed
    const isDayGroupLocked = (dayKeyIndex) => {
        if (dayKeyIndex === 0) return false;
        const prevDayKey = sortedDayKeys[dayKeyIndex - 1];
        return !isDayGroupCompleted(prevDayKey);
    };

    const orientationKeys = sortedDayKeys.filter(k => k <= 0);

    const completedGroups = sortedDayKeys.filter(k => isDayGroupCompleted(k)).length;
    const overallProgress = sortedDayKeys.length > 0
        ? Math.round((completedGroups / sortedDayKeys.length) * 100)
        : 0;

    const handleMarkAsCompleted = async (step) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const { error: progressError } = await supabase
                .from('student_progress')
                .upsert({
                    student_id: studentUser.id,
                    course_id: courseId,
                    step_id: step.id,
                    status: 'completed'
                });
            if (progressError) throw progressError;

            await updateStreak();

            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#10b981', '#3b82f6', '#ffffff']
            });

            setSelectedStep(null);
            fetchCourseData();
        } catch (error) {
            console.error('Error completing step:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateStreak = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const { data: currentStreakData } = await supabase
                .from('student_streaks')
                .select('*')
                .eq('student_id', studentUser.id)
                .eq('course_id', courseId)
                .single();

            if (!currentStreakData) {
                await supabase.from('student_streaks').insert({
                    student_id: studentUser.id,
                    course_id: courseId,
                    current_streak: 1,
                    last_activity_date: today
                });
            } else {
                const lastDate = currentStreakData.last_activity_date;
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                if (lastDate === today) {
                    return;
                } else if (lastDate === yesterdayStr) {
                    await supabase.from('student_streaks').update({
                        current_streak: currentStreakData.current_streak + 1,
                        last_activity_date: today
                    }).eq('id', currentStreakData.id);
                } else {
                    await supabase.from('student_streaks').update({
                        current_streak: 1,
                        last_activity_date: today
                    }).eq('id', currentStreakData.id);
                }
            }
        } catch (err) {
            console.error('Streak update failed:', err);
        }
    };

    const handleQuizSubmit = async () => {
        const questions = selectedStep.content?.questions || [];
        let score = 0;

        questions.forEach((q) => {
            const userAns = quizAnswers[q.id] || [];
            const correctAns = q.correctAnswers || [];
            if (JSON.stringify(userAns.sort()) === JSON.stringify(correctAns.sort())) {
                score++;
            }
        });

        const totalQuestions = questions.length;
        const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
        const passed = percentage >= 80;

        setQuizResult({
            score,
            total: totalQuestions,
            percentage: Math.round(percentage),
            passed
        });

        if (passed) {
            await handleMarkAsCompleted(selectedStep);
        }
    };

    const getStepTypeColor = (type) => {
        switch (type) {
            case 'class': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'orientation': return 'text-violet-400 bg-violet-500/10 border-violet-500/20';
            case 'quiz': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
            case 'reading': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'assignment': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    const getStepTypeIcon = (type, size = 'w-5 h-5') => {
        switch (type) {
            case 'class': return <Video className={size} />;
            case 'orientation': return <GraduationCap className={size} />;
            case 'quiz': return <HelpCircle className={size} />;
            case 'reading': return <BookOpen className={size} />;
            case 'assignment': return <Target className={size} />;
            default: return <FileText className={size} />;
        }
    };

    const getStepTypeLabel = (type) => {
        switch (type) {
            case 'class': return 'Class';
            case 'orientation': return 'Orientation';
            case 'quiz': return 'Quiz';
            case 'reading': return 'Watch & Read';
            case 'assignment': return 'Assignment';
            default: return type;
        }
    };

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            return `https://www.youtube.com/embed/${match[2]}`;
        }
        return url;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                    <p className="text-slate-400">Loading curriculum...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Link to="/lms/dashboard" className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
                                <ChevronLeft className="w-6 h-6 text-slate-400" />
                            </Link>
                            <div>
                                <h1 className="text-lg font-bold text-white leading-tight">{course?.course_name}</h1>
                                <p className="text-xs text-slate-400">Learning Roadmap</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
                                <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-500 animate-pulse' : 'text-slate-600'}`} />
                                <span className={`text-sm font-bold ${streak > 0 ? 'text-white' : 'text-slate-500'}`}>{streak}</span>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-xl">
                                <TrendingUp className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-bold text-white">{overallProgress}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${overallProgress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-emerald-500 to-teal-500 rounded-full"
                        />
                    </div>
                </div>
            </div>

            {/* Course Resources Action Bar */}
            {(course?.recording_list_url || course?.resource_url) && (
                <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 -mb-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {course?.recording_list_url && (
                            <a
                                href={course.recording_list_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl font-bold text-sm hover:bg-violet-500/20 hover:scale-105 transition-all shadow-lg"
                            >
                                <ListVideo className="w-4 h-4" />
                                All Class Recordings
                                <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-1" />
                            </a>
                        )}
                        {course?.resource_url && (
                            <a
                                href={course.resource_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl font-bold text-sm hover:bg-blue-500/20 hover:scale-105 transition-all shadow-lg"
                            >
                                <FolderOpen className="w-4 h-4" />
                                Course Resources
                                <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-1" />
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 space-y-10">
                {roadmap.length === 0 && (
                    <div className="text-center py-20 bg-slate-900/30 border border-slate-800 border-dashed rounded-[40px] mt-10">
                        <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-400">Roadmap is coming soon...</h3>
                        <p className="text-sm text-slate-600">The administrator is preparing your curriculum.</p>
                    </div>
                )}

                {sortedDayKeys.map((dayNumber, dayKeyIndex) => {
                    const stepsInDay = groupedByDay[dayNumber];
                    const isOrientation = dayNumber <= 0;
                    const orientationNum = isOrientation ? orientationKeys.indexOf(dayNumber) + 1 : 0;
                    const dayLabel = isOrientation
                        ? `Orientation ${orientationNum < 10 ? `0${orientationNum}` : orientationNum}`
                        : `Day ${dayNumber < 10 ? `0${dayNumber}` : dayNumber}`;
                    const dayLabelShort = isOrientation
                        ? `${orientationNum < 10 ? `0${orientationNum}` : orientationNum}`
                        : `${dayNumber < 10 ? `0${dayNumber}` : dayNumber}`;

                    const groupCompleted = isDayGroupCompleted(dayNumber);
                    const groupLocked = isDayGroupLocked(dayKeyIndex);
                    const completedCount = stepsInDay.filter(s => isStepCompleted(s.id)).length;
                    const isCurrentGroup = !groupCompleted && !groupLocked;

                    return (
                        <div key={dayNumber} className={`flex gap-6 sm:gap-10 ${groupLocked ? 'opacity-50' : ''}`}>
                            {/* Left: Day Indicator */}
                            <div className="flex flex-col items-center">
                                <motion.div
                                    whileHover={!groupLocked ? { scale: 1.05 } : {}}
                                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] flex flex-col items-center justify-center border-4 transform transition-all duration-500 relative shrink-0 ${groupCompleted
                                        ? 'bg-emerald-500 border-emerald-500/20 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                                        : groupLocked
                                            ? 'bg-slate-900 border-slate-800 text-slate-600'
                                            : isOrientation
                                                ? 'bg-slate-900 border-violet-500 shadow-[0_0_30px_rgba(139,92,246,0.2)] text-violet-400 ring-4 ring-violet-500/5'
                                                : 'bg-slate-900 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)] text-blue-400 ring-4 ring-blue-500/5'
                                        }`}
                                >
                                    {groupCompleted ? (
                                        <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
                                    ) : groupLocked ? (
                                        <Lock className="w-6 h-6 sm:w-8 sm:h-8 opacity-40" />
                                    ) : (
                                        <>
                                            <span className="text-[9px] font-bold uppercase opacity-60 tracking-wider">{isOrientation ? 'ORT' : 'DAY'}</span>
                                            <span className="text-lg sm:text-2xl font-black leading-none">{dayLabelShort}</span>
                                        </>
                                    )}

                                    {/* Pulse for current */}
                                    {isCurrentGroup && (
                                        <div className={`absolute -inset-1 rounded-[2rem] animate-ping opacity-20 -z-10 ${isOrientation ? 'bg-violet-500' : 'bg-blue-500'}`}></div>
                                    )}
                                </motion.div>
                                {/* Connector line down */}
                                {dayKeyIndex < sortedDayKeys.length - 1 && (
                                    <div className="w-0.5 flex-1 mt-2 bg-slate-800 min-h-[2rem]" />
                                )}
                            </div>

                            {/* Right: Card Group */}
                            <div className="flex-1 pb-2">
                                {/* Day label + progress */}
                                <div className="flex items-center gap-3 mb-3">
                                    <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${isOrientation
                                        ? 'text-violet-400 bg-violet-500/10 border-violet-500/20'
                                        : 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                                        }`}>
                                        {dayLabel}
                                    </span>
                                    {groupCompleted ? (
                                        <span className="text-[10px] font-bold text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-full bg-emerald-500/5">ALL DONE</span>
                                    ) : !groupLocked && stepsInDay.length > 1 ? (
                                        <span className="text-[10px] text-slate-500">{completedCount}/{stepsInDay.length} complete</span>
                                    ) : null}
                                </div>

                                {/* Activity Cards stack */}
                                <div className="space-y-3">
                                    {stepsInDay.map((step, actIdx) => {
                                        const stepCompleted = isStepCompleted(step.id);
                                        const stepLocked = groupLocked || (actIdx > 0 && !isStepCompleted(stepsInDay[actIdx - 1].id));

                                        return (
                                            <div
                                                key={step.id}
                                                onClick={() => !stepLocked && setSelectedStep(step)}
                                                className={`relative bg-slate-900 border rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-7 transition-all duration-300 ${stepLocked
                                                    ? 'border-slate-800 cursor-not-allowed opacity-50'
                                                    : stepCompleted
                                                        ? 'border-slate-800 hover:border-emerald-500/30 cursor-pointer hover:bg-emerald-500/5'
                                                        : 'border-blue-500/30 hover:border-blue-500 hover:-translate-y-1 active:scale-[0.98] cursor-pointer shadow-xl shadow-blue-500/5'
                                                    } ${isOrientation && !stepCompleted && !stepLocked ? '!border-violet-500/30 hover:!border-violet-500' : ''}`}
                                            >
                                                {/* Activity badge + status */}
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-widest flex items-center gap-1.5 ${getStepTypeColor(step.step_type)}`}>
                                                            {getStepTypeIcon(step.step_type, 'w-3 h-3')}
                                                            {getStepTypeLabel(step.step_type)}
                                                        </span>
                                                        {stepsInDay.length > 1 && (
                                                            <span className="text-[10px] text-slate-600">Activity {actIdx + 1}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {stepCompleted ? (
                                                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                                        ) : !stepLocked ? (
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                                                        ) : (
                                                            <Lock className="w-4 h-4 text-slate-700" />
                                                        )}
                                                    </div>
                                                </div>

                                                <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">{step.title}</h3>
                                                <p className="text-sm text-slate-400 line-clamp-2 mb-4">{step.description}</p>

                                                <div className="flex justify-end">
                                                    <button className={`flex items-center gap-2 text-sm font-bold transition-all ${stepLocked ? 'text-slate-700' : stepCompleted ? 'text-emerald-400' : 'text-blue-400 hover:gap-3'}`}>
                                                        {stepCompleted ? 'Completed' : stepLocked ? 'Locked' : 'Open'}
                                                        {!stepLocked && <ArrowRight className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Full-Page Interaction View */}
            {selectedStep && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 text-slate-100 animate-in slide-in-from-bottom-8 duration-500">
                    <div className="min-h-screen flex flex-col">
                        {/* Full-Page Header */}
                        <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-2xl border-b border-slate-800 px-4 sm:px-8 py-4 sm:py-6 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4 order-2 sm:order-1">
                                <button
                                    onClick={() => {
                                        setSelectedStep(null);
                                        setQuizResult(null);
                                        setQuizAnswers({});
                                    }}
                                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-900 hover:bg-slate-800 px-4 py-2.5 rounded-2xl font-bold border border-slate-800"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    Back to Roadmap
                                </button>
                                <div className="hidden sm:flex items-center gap-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${getStepTypeColor(selectedStep.step_type)}`}>
                                        {getStepTypeIcon(selectedStep.step_type, 'w-3.5 h-3.5')}
                                        {getStepTypeLabel(selectedStep.step_type)}
                                    </span>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        {selectedStep.day_number <= 0
                                            ? `Orientation ${(orientationKeys.indexOf(selectedStep.day_number) + 1).toString().padStart(2, '0')}`
                                            : `Day ${selectedStep.day_number.toString().padStart(2, '0')}`}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Full-Page Body */}
                        <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
                            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-8 sm:mb-12 text-center sm:text-left">
                                {selectedStep.title}
                            </h2>

                            <div className="max-w-5xl mx-auto space-y-10">
                                {/* ── CLASS or ORIENTATION content ── */}
                                {(selectedStep.step_type === 'class' || selectedStep.step_type === 'orientation') && (
                                    <>
                                        {selectedStep.recording_url ? (
                                            <div className="aspect-video bg-slate-950 rounded-[32px] overflow-hidden border border-slate-800 shadow-2xl">
                                                <iframe
                                                    className="w-full h-full"
                                                    src={getYouTubeEmbedUrl(selectedStep.recording_url)}
                                                    title="Video Lesson"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-video bg-slate-800/50 rounded-[32px] flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700">
                                                <Video className="w-16 h-16 mb-4 opacity-20" />
                                                <p className="font-medium">Live Class Only</p>
                                                <p className="text-sm opacity-60">Join the live session to participate.</p>
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            <h4 className="font-bold text-white text-xl">Description</h4>
                                            <p className="text-slate-400 leading-relaxed text-lg">{selectedStep.description}</p>
                                        </div>

                                    </>
                                )}

                                {/* ── QUIZ content ── */}
                                {selectedStep.step_type === 'quiz' && (
                                    <div className="space-y-8">
                                        {quizResult ? (
                                            <div className="text-center py-10 space-y-6 animate-in zoom-in-95 duration-500">
                                                <div className={`w-28 h-28 rounded-full mx-auto flex items-center justify-center text-white relative ${quizResult.passed ? 'bg-emerald-500 shadow-emerald-500/30 shadow-2xl' : 'bg-red-500 shadow-red-500/30'}`}>
                                                    {quizResult.passed ? <Trophy className="w-14 h-14" /> : <AlertCircle className="w-14 h-14" />}
                                                    <div className="absolute -inset-4 border-2 border-dashed border-slate-700 rounded-full animate-spin-slow"></div>
                                                </div>
                                                <div>
                                                    <h3 className="text-4xl font-black text-white tracking-tight">
                                                        {quizResult.passed ? 'Mission Accomplished!' : 'Target Not Met'}
                                                    </h3>
                                                    <div className="flex flex-col items-center mt-4">
                                                        <span className="text-slate-400 font-medium">Your Accuracy Grade</span>
                                                        <div className="w-64 h-3 bg-slate-800 rounded-full mt-3 overflow-hidden border border-slate-700">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${quizResult.percentage}%` }}
                                                                className={`h-full ${quizResult.passed ? 'bg-emerald-500' : 'bg-red-500'}`}
                                                            />
                                                        </div>
                                                        <span className={`text-2xl font-black mt-2 ${quizResult.passed ? 'text-emerald-400' : 'text-red-400'}`}>{quizResult.percentage}%</span>
                                                    </div>
                                                </div>

                                                <div className={`p-6 rounded-[32px] border ${quizResult.passed ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-red-500/5 border-red-500/10'} max-w-sm mx-auto`}>
                                                    <p className="text-sm text-slate-400 leading-relaxed">
                                                        {quizResult.passed
                                                            ? "You've successfully mastered this module. The next milestone is now unlocked!"
                                                            : `Passing requires at least 80% accuracy. You need ${Math.ceil(80 - quizResult.percentage)}% more to proceed.`}
                                                    </p>
                                                </div>

                                                {!quizResult.passed && (
                                                    <div className="flex justify-center pt-4">
                                                        <button
                                                            onClick={() => { setQuizResult(null); setQuizAnswers({}); }}
                                                            className="px-12 py-4 bg-white text-slate-900 hover:bg-slate-200 font-black rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-white/10 flex items-center gap-2"
                                                        >
                                                            Try Again Now
                                                            <ArrowRight className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-10">
                                                {selectedStep.content?.questions?.map((q, qidx) => (
                                                    <div key={q.id} className="space-y-6">
                                                        <div className="flex gap-4">
                                                            <div className="bg-slate-800 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-slate-400 shrink-0">{qidx + 1}</div>
                                                            <h5 className="text-xl font-bold text-white pt-2 leading-tight">{q.text}</h5>
                                                        </div>
                                                        <div className="grid grid-cols-1 gap-3 pl-14">
                                                            {q.options?.map((opt, oidx) => {
                                                                const isSelected = (quizAnswers[q.id] || []).includes(oidx);
                                                                return (
                                                                    <div
                                                                        key={oidx}
                                                                        onClick={() => {
                                                                            let newAns;
                                                                            if (q.type === 'single') {
                                                                                newAns = [oidx];
                                                                            } else {
                                                                                const current = quizAnswers[q.id] || [];
                                                                                newAns = current.includes(oidx) ? current.filter(i => i !== oidx) : [...current, oidx];
                                                                            }
                                                                            setQuizAnswers({ ...quizAnswers, [q.id]: newAns });
                                                                        }}
                                                                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${isSelected ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                                                                    >
                                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-700'}`}>
                                                                            {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                                                        </div>
                                                                        <span className="text-lg font-medium">{opt}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}

                                                <button
                                                    disabled={Object.keys(quizAnswers).length < (selectedStep.content?.questions?.length || 0)}
                                                    onClick={handleQuizSubmit}
                                                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xl font-black rounded-3xl shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                >
                                                    Submit Answers
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ── WATCH & READ / ASSIGNMENT content ── */}
                                {(selectedStep.step_type === 'reading' || selectedStep.step_type === 'assignment') && (
                                    <div className="space-y-8">
                                        {selectedStep.step_type === 'reading' && selectedStep.recording_url && (
                                            <div className="aspect-video bg-slate-950 rounded-[32px] overflow-hidden border border-slate-800 shadow-2xl">
                                                <iframe
                                                    className="w-full h-full"
                                                    src={getYouTubeEmbedUrl(selectedStep.recording_url)}
                                                    title="Watch Lesson"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            </div>
                                        )}
                                        <div className="p-10 bg-slate-900 border border-slate-800 rounded-[40px] text-center space-y-4 shadow-xl">
                                            {selectedStep.step_type === 'reading'
                                                ? <BookOpen className="w-20 h-20 text-amber-500 mx-auto opacity-90" />
                                                : <Target className="w-20 h-20 text-orange-500 mx-auto opacity-90" />}
                                            <p className="text-slate-300 text-xl leading-relaxed max-w-3xl mx-auto pt-4">{selectedStep.description}</p>
                                            
                                            {selectedStep.content?.resources?.length > 0 && (
                                                <div className="pt-6 space-y-3">
                                                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest text-left">Attached Materials</h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {selectedStep.content.resources.map((res, rIdx) => (
                                                            <a
                                                                key={rIdx}
                                                                href={res.url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="flex items-center gap-3 p-4 bg-slate-900 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800 rounded-2xl transition-all text-left group"
                                                            >
                                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedStep.step_type === 'reading' ? 'bg-amber-500/10 text-amber-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                                                    <LinkIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                                </div>
                                                                <div className="overflow-hidden">
                                                                    <p className="text-sm font-bold text-white truncate">{res.title || 'Reference Link'}</p>
                                                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Click to Open</p>
                                                                </div>
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Spacer & Completion Bar */}
                        <div className="mt-auto">
                            {!isStepCompleted(selectedStep.id) && selectedStep.step_type !== 'quiz' && (
                                <div className="p-8 border-t border-slate-800 bg-slate-900/50 flex flex-col items-center">
                                    <button
                                        onClick={() => handleMarkAsCompleted(selectedStep)}
                                        disabled={isSubmitting}
                                        className="w-full max-w-lg py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xl font-black rounded-3xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                                    >
                                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
                                        Mark as Completed
                                    </button>
                                    <p className="text-center text-xs text-slate-500 mt-4 uppercase tracking-[0.2em] font-bold">
                                        Completing today will extend your 🔥 {streak} day streak
                                    </p>
                                </div>
                            )}
                            {isStepCompleted(selectedStep.id) && (
                                <div className="p-8 bg-emerald-500/5 border-t border-emerald-500/20 text-center flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mb-3">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <p className="text-emerald-400 text-lg font-bold">
                                        Great Job! You have completed this milestone.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseRoadmap;
