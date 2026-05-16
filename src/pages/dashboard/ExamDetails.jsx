'use client';

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getExamById, deleteExam, updateExam } from '../../services/examService';

export default function ExamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'questions'
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setIsLoading(true);
        const response = await getExamById(id, { includeQuestions: true, includeStats: true });
        
        // Handle both direct response and wrapped response
        const examData = response?.data || response;
        setExam(examData);
        setQuestions(examData?.questions || []);
      } catch (err) {
        console.error('Failed to fetch exam:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExam();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      await deleteExam(id);
      navigate('/dashboard/exams');
    } catch (err) {
      console.error('Failed to delete exam:', err);
      alert('Failed to delete exam. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      await updateExam(id, { ...exam, status: 'PUBLISHED' });
      setExam(prev => ({ ...prev, status: 'published' }));
    } catch (err) {
      console.error('Failed to publish exam:', err);
      alert('Failed to publish exam. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!exam) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-card">
            <span className="material-symbols-outlined text-3xl text-muted-soft">assignment</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-ink">Exam not found</h3>
          <p className="mb-4 text-sm text-body">The exam you're looking for doesn't exist.</p>
          <Link
            to="/dashboard/exams"
 
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Exams
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = {
    published: {
      label: 'Published',
      color: 'text-[#2f6e3d]',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/25',
    },
    draft: {
      label: 'Draft',
      color: 'text-[#7a5a0e]',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/30',
    },
    active: {
      label: 'Active',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
    },
    completed: {
      label: 'Completed',
      color: 'text-[#8a5a1a]',
      bgColor: 'bg-accent-amber/10',
      borderColor: 'border-accent-amber/25',
    },
    archived: {
      label: 'Archived',
      color: 'text-body',
      bgColor: 'bg-surface-card',
      borderColor: 'border-hairline',
    },
  };

  const examStatus = (exam.status || 'draft').toLowerCase();
  const status = statusConfig[examStatus] || statusConfig.draft;
  
  // Get course/subject and duration with fallbacks
  const course = exam.course || exam.subject || 'N/A';
  const duration = exam.durationMinutes || exam.duration || 0;
  const totalQuestions = exam.totalQuestions || questions.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/exams')}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-hairline text-body transition-colors hover:bg-surface-soft"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-[32px] leading-tight tracking-[-0.02em] text-ink">{exam.title}</h1>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${status.color} ${status.bgColor} ${status.borderColor}`}
                >
                  {status.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-body">{course}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {examStatus === 'draft' && (
            <button
              onClick={handlePublish}
              disabled={isPublishing}
 
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-lg">
                {isPublishing ? 'hourglass_empty' : 'publish'}
              </span>
              {isPublishing ? 'Publishing...' : 'Publish'}
            </button>
          )}
          <button
            onClick={() => {
              navigate(`/dashboard/create-exam?edit=${exam.id}`);
            }}
            className="flex items-center gap-2 rounded-lg border border-hairline px-4 py-2 text-sm font-medium text-body-strong transition-colors hover:bg-surface-soft"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-lg border border-error/25 px-4 py-2 text-sm font-medium text-[#8a3636] transition-colors hover:bg-error/10 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-lg">
              {isDeleting ? 'hourglass_empty' : 'delete'}
            </span>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 rounded-lg p-1" >
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
            activeTab === 'overview'
              ? 'bg-canvas text-ink shadow-sm'
              : 'text-body hover:text-ink'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">info</span>
            Overview
          </span>
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
            activeTab === 'questions'
              ? 'bg-canvas text-ink shadow-sm'
              : 'text-body hover:text-ink'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">quiz</span>
            Questions ({questions.length})
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' ? (
        <div className="space-y-6">
          {/* Exam Information */}
          <div className="rounded-lg bg-canvas p-6 shadow-sm border border-hairline">
            <h2 className="mb-4 text-lg font-semibold text-ink">Exam Information</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <InfoItem icon="assignment" label="Exam Title" value={exam.title} />
              <InfoItem icon="school" label="Course" value={course} />
              <InfoItem icon="quiz" label="Total Questions" value={totalQuestions} />
              <InfoItem icon="schedule" label="Duration" value={`${duration} minutes`} />
              <InfoItem icon="military_tech" label="Total Marks" value={exam.totalMarks || 0} />
              <InfoItem icon="check_circle" label="Passing Marks" value={exam.passingMarks || 0} />
              {exam.startDateTime && (
                <InfoItem 
                  icon="calendar_today" 
                  label="Start Date" 
                  value={new Date(exam.startDateTime).toLocaleString()} 
                />
              )}
              {exam.endDateTime && (
                <InfoItem 
                  icon="event" 
                  label="End Date" 
                  value={new Date(exam.endDateTime).toLocaleString()} 
                />
              )}
              {(examStatus === 'published' || examStatus === 'active' || examStatus === 'completed') && (
                <InfoItem icon="people" label="Submissions" value={exam.submissions || exam.submissionCount || 0} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <QuestionCard key={question.id || index} question={question} index={index} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-card">
                <span className="material-symbols-outlined text-3xl text-muted-soft">quiz</span>
              </div>
              <h3 className="font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">No questions yet</h3>
              <p className="mt-1 text-sm text-body">Add questions to this exam to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// InfoItem Component
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg"
 
      >
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <div>
        <p className="text-xs font-medium text-body">{label}</p>
        <p className="text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
}

// QuestionCard Component
function QuestionCard({ question, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-hairline bg-canvas shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 flex-1">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-on-primary"
 
          >
            {index + 1}
          </div>
          <div className="flex-1">
            <p className="font-medium text-ink">{question.question}</p>
            <div className="mt-1 flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">
                  {question.type === 'mcq' ? 'radio_button_checked' : 'edit_note'}
                </span>
                {question.type === 'mcq' ? 'MCQ' : 'Short Answer'}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">military_tech</span>
                {question.marks} marks
              </span>
            </div>
          </div>
        </div>
        {question.type === 'mcq' && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-lg p-2 text-body transition-colors hover:bg-surface-card"
          >
            <span className="material-symbols-outlined text-xl">
              {expanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        )}
      </div>

      {expanded && question.type === 'mcq' && (
        <div className="border-t border-hairline bg-surface-soft p-4">
          <div className="space-y-2">
            {question.options.map((option, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-lg border p-3 bg-canvas"
                style={
                  idx === question.correctAnswer
                    ? {}
                    : { borderColor: '#e2e8f0' }
                }
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-hairline text-xs font-medium">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm text-body-strong">{option}</span>
                {idx === question.correctAnswer && (
                  <span className="ml-auto text-xs font-medium" >
                    ✓ Correct
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Loading Skeleton
function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-hairline"></div>
          <div>
            <div className="h-8 w-96 animate-pulse rounded-lg bg-hairline"></div>
            <div className="mt-2 h-4 w-48 animate-pulse rounded bg-hairline"></div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 animate-pulse rounded-lg bg-hairline"></div>
          <div className="h-10 w-20 animate-pulse rounded-lg bg-hairline"></div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="h-12 animate-pulse rounded-lg bg-hairline"></div>

      {/* Content Skeleton */}
      <div className="h-96 animate-pulse rounded-lg bg-hairline"></div>
    </div>
  );
}
