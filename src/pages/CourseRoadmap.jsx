import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ChevronLeft,
    Flame,
    Lock,
    CheckCircle2,
    Video,
    FileText,
    HelpCircle,
    BookOpen,
    ArrowRight,
    Loader2,
    Trophy,
    Target,
    Link as LinkIcon,
    TrendingUp,
    AlertCircle,
    GraduationCap,
    ListVideo,
    FolderOpen,
    ExternalLink,
    CheckSquare,
    Square,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

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

    const groupedByDay = roadmap.reduce((acc, step) => {
        const key = step.day_number;
        if (!acc[key]) acc[key] = [];
        acc[key].push(step);
        return acc;
    }, {});

    const sortedDayKeys = Object.keys(groupedByDay).map(Number).sort((a, b) => a - b);

    const isDayGroupCompleted = (dayNumber) => {
        const steps = groupedByDay[dayNumber] || [];
        return steps.every(s => isStepCompleted(s.id));
    };

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

    // Find the next incomplete step after the currently selected one
    const getNextStep = () => {
        if (!selectedStep) return null;
        const currentIdx = roadmap.findIndex(s => s.id === selectedStep.id);
        for (let i = currentIdx + 1; i < roadmap.length; i++) {
            if (!isStepCompleted(roadmap[i].id)) return roadmap[i];
        }
        return null;
    };

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

            // Keep overlay open so student can see completion state & navigate to next step
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

        setQuizResult({ score, total: totalQuestions, percentage: Math.round(percentage), passed });

        if (passed) {
            await handleMarkAsCompleted(selectedStep);
        }
    };

    const closeStep = () => {
        setSelectedStep(null);
        setQuizResult(null);
        setQuizAnswers({});
    };

    const openNextStep = () => {
        const next = getNextStep();
        if (next) {
            setSelectedStep(next);
            setQuizResult(null);
            setQuizAnswers({});
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
            <div className="min-h-screen bg-[#080d16] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                    <p className="text-slate-500 text-sm tracking-widest uppercase animate-pulse">Loading curriculum...</p>
                </div>
            </div>
        );
    }

    const nextStep = getNextStep();

    return (
        <div className="min-h-screen bg-[#080d16] text-slate-100 pb-20">

            {/* ── Sticky Header ── */}
            <div className="sticky top-0 z-40 bg-[#080d16]/90 backdrop-blur-md border-b border-slate-800/60">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <Link
                                to="/lms/dashboard"
                                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors bg-slate-800/60 hover:bg-slate-800 px-3 py-2 rounded-xl text-sm font-medium border border-slate-700/50"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>
                            <div>
                                <h1 className="text-base font-bold text-white leading-tight line-clamp-1">{course?.course_name}</h1>
                                <p className="text-[11px] text-slate-500 font-medium">Learning Roadmap</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Streak */}
                            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
                                <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-400' : 'text-slate-600'}`} />
                                <span className={`text-sm font-bold ${streak > 0 ? 'text-white' : 'text-slate-500'}`}>{streak}</span>
                            </div>
                            {/* Progress % */}
                            <div className="hidden sm:flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-xl">
                                <TrendingUp className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-bold text-white">{overallProgress}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${overallProgress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-teal-400 rounded-full"
                        />
                    </div>
                </div>
            </div>

            {/* ── Course Resource Links ── */}
            {(course?.recording_list_url || course?.resource_url) && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 -mb-2">
                    <div className="flex flex-wrap items-center gap-3">
                        {course?.recording_list_url && (
                            <a
                                href={course.recording_list_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl font-bold text-sm hover:bg-violet-500/20 transition-all"
                            >
                                <ListVideo className="w-4 h-4" />
                                All Recordings
                                <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>
                        )}
                        {course?.resource_url && (
                            <a
                                href={course.resource_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl font-bold text-sm hover:bg-blue-500/20 transition-all"
                            >
                                <FolderOpen className="w-4 h-4" />
                                Course Resources
                                <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* ── Roadmap Timeline ── */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 space-y-8">
                {roadmap.length === 0 && (
                    <div className="text-center py-20 bg-slate-900/30 border border-slate-800 border-dashed rounded-3xl mt-6">
                        <BookOpen className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                        <h3 className="text-base font-semibold text-slate-400">Roadmap is coming soon</h3>
                        <p className="text-sm text-slate-600 mt-1">The administrator is preparing your curriculum.</p>
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
                    const isLastDay = dayKeyIndex === sortedDayKeys.length - 1;

                    return (
                        <div key={dayNumber} className="flex gap-6 sm:gap-8">

                            {/* ── Left: Timeline column ── */}
                            <div className="flex flex-col items-center shrink-0">
                                {/* Day circle — opacity only on circle, not connector */}
                                <div className={groupLocked ? 'opacity-40' : ''}>
                                    <motion.div
                                        whileHover={!groupLocked ? { scale: 1.05 } : {}}
                                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-500 relative ${
                                            groupCompleted
                                                ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                                                : groupLocked
                                                    ? 'bg-slate-900 border-slate-800 text-slate-600'
                                                    : isOrientation
                                                        ? 'bg-slate-900 border-violet-500 text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                                                        : 'bg-slate-900 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                                        }`}
                                    >
                                        {groupCompleted ? (
                                            <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                                        ) : groupLocked ? (
                                            <Lock className="w-5 h-5 sm:w-6 sm:h-6 opacity-40" />
                                        ) : (
                                            <>
                                                <span className="text-[8px] font-bold uppercase opacity-50 tracking-wider leading-none">{isOrientation ? 'ORT' : 'DAY'}</span>
                                                <span className="text-base sm:text-xl font-black leading-none">{dayLabelShort}</span>
                                            </>
                                        )}
                                        {/* Pulse ring for active group */}
                                        {isCurrentGroup && (
                                            <div className={`absolute -inset-1 rounded-2xl animate-ping opacity-15 -z-10 ${isOrientation ? 'bg-violet-500' : 'bg-blue-500'}`} />
                                        )}
                                    </motion.div>
                                </div>

                                {/* Connector line — color reflects completion, never fades for locked */}
                                {!isLastDay && (
                                    <div className={`w-0.5 flex-1 mt-2 min-h-[2rem] rounded-full transition-colors duration-700 ${
                                        groupCompleted ? 'bg-emerald-500/50' : 'bg-slate-800'
                                    }`} />
                                )}
                            </div>

                            {/* ── Right: Cards — opacity only on cards ── */}
                            <div className={`flex-1 pb-2 ${groupLocked ? 'opacity-40' : ''}`}>
                                {/* Day label row */}
                                <div className="flex items-center gap-2 mb-3 mt-1">
                                    <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                                        isOrientation
                                            ? 'text-violet-400 bg-violet-500/10 border-violet-500/20'
                                            : 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                                    }`}>
                                        {dayLabel}
                                    </span>
                                    {groupCompleted && (
                                        <span className="text-[10px] font-bold text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full bg-emerald-500/5">
                                            ALL DONE
                                        </span>
                                    )}
                                    {!groupCompleted && !groupLocked && stepsInDay.length > 1 && (
                                        <span className="text-[10px] text-slate-500">{completedCount}/{stepsInDay.length} done</span>
                                    )}
                                </div>

                                {/* Activity cards */}
                                <div className="space-y-3">
                                    {stepsInDay.map((step, actIdx) => {
                                        const stepCompleted = isStepCompleted(step.id);
                                        const stepLocked = groupLocked || (actIdx > 0 && !isStepCompleted(stepsInDay[actIdx - 1].id));

                                        return (
                                            <div
                                                key={step.id}
                                                onClick={() => !stepLocked && setSelectedStep(step)}
                                                className={`relative bg-slate-900 border rounded-2xl p-5 sm:p-6 transition-all duration-200 ${
                                                    stepLocked
                                                        ? 'border-slate-800 cursor-not-allowed'
                                                        : stepCompleted
                                                            ? 'border-slate-700/50 hover:border-emerald-500/30 cursor-pointer hover:bg-emerald-500/5'
                                                            : isOrientation
                                                                ? 'border-violet-500/30 hover:border-violet-500 hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-violet-500/5'
                                                                : 'border-blue-500/30 hover:border-blue-500 hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-blue-500/5'
                                                }`}
                                            >
                                                {/* Top row: type badge + status icon */}
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider flex items-center gap-1.5 ${getStepTypeColor(step.step_type)}`}>
                                                            {getStepTypeIcon(step.step_type, 'w-3 h-3')}
                                                            {getStepTypeLabel(step.step_type)}
                                                        </span>
                                                        {stepsInDay.length > 1 && (
                                                            <span className="text-[10px] text-slate-600">Activity {actIdx + 1}</span>
                                                        )}
                                                    </div>
                                                    {stepCompleted ? (
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                    ) : !stepLocked ? (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                                    ) : (
                                                        <Lock className="w-3.5 h-3.5 text-slate-700" />
                                                    )}
                                                </div>

                                                <h3 className="text-base sm:text-lg font-bold text-white mb-1">{step.title}</h3>

                                                {step.description && (
                                                    <p className="text-sm text-slate-400 line-clamp-2 mb-4">{step.description}</p>
                                                )}

                                                {/* CTA button */}
                                                <div className="flex justify-end mt-3">
                                                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                                                        stepLocked
                                                            ? 'text-slate-700 bg-slate-800/50'
                                                            : stepCompleted
                                                                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                                                                : 'text-white bg-blue-600 hover:bg-blue-500 shadow-sm shadow-blue-500/30'
                                                    }`}>
                                                        {stepCompleted ? <><CheckCircle2 className="w-3 h-3" />Completed</> : stepLocked ? <><Lock className="w-3 h-3" />Locked</> : <>Open <ArrowRight className="w-3 h-3" /></>}
                                                    </span>
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

            {/* ── Full-Page Step Detail Overlay ── */}
            {selectedStep && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-[#080d16] text-slate-100 animate-in slide-in-from-bottom-6 duration-300">
                    <div className="min-h-screen flex flex-col">

                        {/* Detail Header */}
                        <div className="sticky top-0 z-40 bg-[#080d16]/90 backdrop-blur-xl border-b border-slate-800/60 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-wrap">
                                <button
                                    onClick={closeStep}
                                    className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl text-sm font-bold border border-slate-700"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Back
                                </button>

                                {/* Type + Day badges — visible on all screens */}
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-full border flex items-center gap-1.5 ${getStepTypeColor(selectedStep.step_type)}`}>
                                    {getStepTypeIcon(selectedStep.step_type, 'w-3 h-3')}
                                    {getStepTypeLabel(selectedStep.step_type)}
                                </span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800/60 px-2.5 py-1.5 rounded-full border border-slate-700/50">
                                    {selectedStep.day_number <= 0
                                        ? `Orientation ${(orientationKeys.indexOf(selectedStep.day_number) + 1).toString().padStart(2, '0')}`
                                        : `Day ${selectedStep.day_number.toString().padStart(2, '0')}`}
                                </span>
                            </div>

                            {/* Progress pill */}
                            <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                                {overallProgress}% complete
                            </div>
                        </div>

                        {/* Detail Body */}
                        <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
                            {/* Title */}
                            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-8">
                                {selectedStep.title}
                            </h2>

                            <div className="space-y-8">

                                {/* ── CLASS / ORIENTATION ── */}
                                {(selectedStep.step_type === 'class' || selectedStep.step_type === 'orientation') && (
                                    <>
                                        {selectedStep.recording_url ? (
                                            <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                                                <iframe
                                                    className="w-full h-full"
                                                    src={getYouTubeEmbedUrl(selectedStep.recording_url)}
                                                    title="Video Lesson"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-video bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700 gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center">
                                                    <Video className="w-7 h-7 opacity-40" />
                                                </div>
                                                <div className="text-center px-8">
                                                    <p className="font-semibold text-slate-400 mb-1">Recording Not Available Yet</p>
                                                    <p className="text-sm opacity-60">The class recording will appear here after the live session ends.</p>
                                                </div>
                                            </div>
                                        )}

                                        {selectedStep.description && (
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Description</h4>
                                                <p className="text-slate-300 leading-relaxed">{selectedStep.description}</p>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* ── QUIZ ── */}
                                {selectedStep.step_type === 'quiz' && (
                                    <div className="space-y-8">
                                        {quizResult ? (
                                            /* Quiz result screen */
                                            <div className="text-center py-10 space-y-6 animate-in zoom-in-95 duration-300">
                                                <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-white shadow-2xl ${quizResult.passed ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-red-500 shadow-red-500/30'}`}>
                                                    {quizResult.passed ? <Trophy className="w-12 h-12" /> : <AlertCircle className="w-12 h-12" />}
                                                </div>

                                                <div>
                                                    <h3 className="text-3xl font-black text-white tracking-tight">
                                                        {quizResult.passed ? 'Mission Accomplished!' : 'Not Quite Yet'}
                                                    </h3>
                                                    <p className="text-slate-400 mt-2">
                                                        <span className="font-bold text-white">{quizResult.score} / {quizResult.total}</span> correct &mdash; {quizResult.percentage}%
                                                    </p>

                                                    <div className="flex flex-col items-center mt-4 gap-2">
                                                        <div className="w-56 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${quizResult.percentage}%` }}
                                                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                                                className={`h-full rounded-full ${quizResult.passed ? 'bg-emerald-500' : 'bg-red-500'}`}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-slate-500">80% required to pass</span>
                                                    </div>
                                                </div>

                                                <div className={`p-5 rounded-2xl border max-w-sm mx-auto ${quizResult.passed ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-red-500/5 border-red-500/15'}`}>
                                                    <p className="text-sm text-slate-400 leading-relaxed">
                                                        {quizResult.passed
                                                            ? "You've mastered this module. The next step is now unlocked!"
                                                            : `You need ${Math.ceil(80 - quizResult.percentage)}% more to pass. Review and try again.`}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-center gap-3 pt-2">
                                                    {!quizResult.passed && (
                                                        <button
                                                            onClick={() => { setQuizResult(null); setQuizAnswers({}); }}
                                                            className="px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl transition-all flex items-center gap-2"
                                                        >
                                                            Try Again
                                                            <ArrowRight className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {quizResult.passed && nextStep && (
                                                        <button
                                                            onClick={openNextStep}
                                                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                                                        >
                                                            Next Step
                                                            <ArrowRight className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={closeStep}
                                                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all"
                                                    >
                                                        {quizResult.passed ? 'Back to Roadmap' : 'Close'}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Quiz questions */
                                            <div className="space-y-10">
                                                {selectedStep.content?.questions?.map((q, qidx) => {
                                                    const isAnswered = !!(quizAnswers[q.id]?.length);
                                                    return (
                                                        <div key={q.id} className="space-y-4">
                                                            <div className="flex gap-4 items-start">
                                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${isAnswered ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                                                                    {isAnswered ? <CheckCircle2 className="w-4 h-4" /> : qidx + 1}
                                                                </div>
                                                                <div>
                                                                    <h5 className="text-lg font-bold text-white leading-snug">{q.text}</h5>
                                                                    {q.type === 'multiple' && (
                                                                        <span className="text-xs text-amber-400 font-semibold mt-1 block">Select all that apply</span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 gap-3 pl-12">
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
                                                                                    newAns = current.includes(oidx)
                                                                                        ? current.filter(i => i !== oidx)
                                                                                        : [...current, oidx];
                                                                                }
                                                                                setQuizAnswers({ ...quizAnswers, [q.id]: newAns });
                                                                            }}
                                                                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                                                                                isSelected
                                                                                    ? 'bg-blue-500/10 border-blue-500 text-blue-300'
                                                                                    : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800/60'
                                                                            }`}
                                                                        >
                                                                            {/* Indicator: circle for single, square for multiple */}
                                                                            <div className="shrink-0">
                                                                                {q.type === 'single' ? (
                                                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-600'}`}>
                                                                                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                                                                    </div>
                                                                                ) : isSelected ? (
                                                                                    <CheckSquare className="w-5 h-5 text-blue-400" />
                                                                                ) : (
                                                                                    <Square className="w-5 h-5 text-slate-600" />
                                                                                )}
                                                                            </div>
                                                                            <span className="font-medium leading-snug">{opt}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                                {/* Answered counter + Submit */}
                                                {(() => {
                                                    const totalQ = selectedStep.content?.questions?.length || 0;
                                                    const answeredQ = Object.keys(quizAnswers).filter(k => quizAnswers[k]?.length > 0).length;
                                                    const allAnswered = answeredQ >= totalQ;
                                                    return (
                                                        <div className="space-y-3 pt-4">
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-slate-400">
                                                                    <span className={`font-bold ${allAnswered ? 'text-emerald-400' : 'text-white'}`}>{answeredQ}</span>
                                                                    <span className="text-slate-600"> / {totalQ} answered</span>
                                                                </span>
                                                                {!allAnswered && (
                                                                    <span className="text-amber-400 text-xs font-semibold">{totalQ - answeredQ} remaining</span>
                                                                )}
                                                            </div>
                                                            <button
                                                                disabled={!allAnswered}
                                                                onClick={handleQuizSubmit}
                                                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-base font-bold rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                                                            >
                                                                Submit Answers
                                                            </button>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ── WATCH & READ / ASSIGNMENT ── */}
                                {(selectedStep.step_type === 'reading' || selectedStep.step_type === 'assignment') && (
                                    <div className="space-y-6">
                                        {/* YouTube embed for Watch & Read */}
                                        {selectedStep.step_type === 'reading' && selectedStep.recording_url && (
                                            <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                                                <iframe
                                                    className="w-full h-full"
                                                    src={getYouTubeEmbedUrl(selectedStep.recording_url)}
                                                    title="Watch Lesson"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            </div>
                                        )}

                                        {/* Description — left-aligned, readable */}
                                        {selectedStep.description && (
                                            <p className="text-slate-300 text-base leading-relaxed">
                                                {selectedStep.description}
                                            </p>
                                        )}

                                        {/* Resource links */}
                                        {selectedStep.content?.resources?.length > 0 && (
                                            <div className="space-y-3">
                                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Attached Materials</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {selectedStep.content.resources.map((res, rIdx) => (
                                                        <a
                                                            key={rIdx}
                                                            href={res.url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="flex items-center gap-3 p-4 bg-slate-900 border border-slate-700 hover:border-amber-500/40 hover:bg-slate-800 rounded-xl transition-all text-left group"
                                                        >
                                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${selectedStep.step_type === 'reading' ? 'bg-amber-500/10 text-amber-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                                                <LinkIcon className="w-4 h-4" />
                                                            </div>
                                                            <div className="overflow-hidden">
                                                                <p className="text-sm font-semibold text-white truncate">{res.title || 'Reference Link'}</p>
                                                                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Open Link</p>
                                                            </div>
                                                            <ExternalLink className="w-3.5 h-3.5 text-slate-600 ml-auto shrink-0 group-hover:text-slate-400 transition-colors" />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Empty fallback */}
                                        {!selectedStep.description && !selectedStep.content?.resources?.length && !selectedStep.recording_url && (
                                            <div className="text-center py-14 border border-dashed border-slate-800 rounded-2xl">
                                                <BookOpen className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                                                <p className="text-slate-500 text-sm">Content will be available soon.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Completion Footer ── */}
                        <div className="mt-auto">
                            {!isStepCompleted(selectedStep.id) && selectedStep.step_type !== 'quiz' && (
                                <div className="border-t border-slate-800 bg-slate-900/60 backdrop-blur-sm px-4 sm:px-8 py-6 flex flex-col items-center gap-3">
                                    <button
                                        onClick={() => handleMarkAsCompleted(selectedStep)}
                                        disabled={isSubmitting}
                                        className="w-full max-w-md py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-base font-bold rounded-2xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                        Mark as Completed
                                    </button>
                                    <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                                        Completing today extends your {streak}-day streak
                                    </p>
                                </div>
                            )}

                            {isStepCompleted(selectedStep.id) && (
                                <div className="border-t border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm px-4 sm:px-8 py-6">
                                    <div className="max-w-md mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-emerald-400 text-sm">Step Completed!</p>
                                                <p className="text-xs text-slate-500">Great work, keep going.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={closeStep}
                                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold transition-all"
                                            >
                                                Roadmap
                                            </button>
                                            {nextStep && (
                                                <button
                                                    onClick={openNextStep}
                                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20"
                                                >
                                                    Next Step
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
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
