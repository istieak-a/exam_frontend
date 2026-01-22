'use client';

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { teacherExams, examQuestions } from '../../data/mockData';

export default function ExamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'questions'

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Find the exam by ID
  const exam = teacherExams.find(e => e.id === id);
  
  // Get questions for this exam
  const mockQuestions = examQuestions[id] || [];

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!exam) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <span className="material-symbols-outlined text-3xl text-slate-400">assignment</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-900">Exam not found</h3>
          <p className="mb-4 text-sm text-slate-600">The exam you're looking for doesn't exist.</p>
          <Link
            to="/dashboard/exams"
            style={{ backgroundColor: '#0084D1' }}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
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
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    draft: {
      label: 'Draft',
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
  };

  const status = statusConfig[exam.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/exams')}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{exam.title}</h1>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${status.color} ${status.bgColor} ${status.borderColor}`}
                >
                  {status.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{exam.subject}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {exam.status === 'draft' && (
            <button
              onClick={() => {
                // TODO: Implement publish functionality
                alert('Publishing exam...');
              }}
              style={{ backgroundColor: '#0084D1' }}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
            >
              <span className="material-symbols-outlined text-lg">publish</span>
              Publish
            </button>
          )}
          <button
            onClick={() => {
              // TODO: Implement edit functionality
              navigate(`/dashboard/create-exam?edit=${exam.id}`);
            }}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this exam?')) {
                // TODO: Implement delete functionality
                alert('Deleting exam...');
                navigate('/dashboard/exams');
              }
            }}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
            Delete
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 rounded-lg p-1" style={{ backgroundColor: '#F0F9FF' }}>
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
            activeTab === 'overview'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
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
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">quiz</span>
            Questions ({mockQuestions.length})
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' ? (
        <div className="space-y-6">
          {/* Exam Information */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Exam Information</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <InfoItem icon="assignment" label="Exam Title" value={exam.title} />
              <InfoItem icon="category" label="Subject" value={exam.subject} />
              <InfoItem icon="quiz" label="Total Questions" value={exam.totalQuestions} />
              <InfoItem icon="schedule" label="Duration" value={`${exam.duration} minutes`} />
              <InfoItem icon="military_tech" label="Total Marks" value={exam.totalMarks} />
              {exam.startDate && (
                <InfoItem icon="calendar_today" label="Start Date" value={exam.startDate} />
              )}
              {exam.dueDate && (
                <InfoItem icon="event" label="Due Date" value={exam.dueDate} />
              )}
              {exam.status === 'published' && (
                <InfoItem icon="people" label="Submissions" value={exam.submissions || 0} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {mockQuestions.map((question, index) => (
            <QuestionCard key={index} question={question} index={index} />
          ))}
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
        style={{ backgroundColor: '#F0F9FF', color: '#0084D1' }}
      >
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <div>
        <p className="text-xs font-medium text-slate-600">{label}</p>
        <p className="text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

// QuestionCard Component
function QuestionCard({ question, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 flex-1">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: '#0084D1' }}
          >
            {index + 1}
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-900">{question.question}</p>
            <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
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
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
          >
            <span className="material-symbols-outlined text-xl">
              {expanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        )}
      </div>

      {expanded && question.type === 'mcq' && (
        <div className="border-t border-slate-200 bg-slate-50 p-4">
          <div className="space-y-2">
            {question.options.map((option, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-lg border p-3 bg-white"
                style={
                  idx === question.correctAnswer
                    ? { borderColor: '#0084D1', backgroundColor: '#F0F9FF' }
                    : { borderColor: '#e2e8f0' }
                }
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-300 text-xs font-medium">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm text-slate-700">{option}</span>
                {idx === question.correctAnswer && (
                  <span className="ml-auto text-xs font-medium" style={{ color: '#0084D1' }}>
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
          <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-200"></div>
          <div>
            <div className="h-8 w-96 animate-pulse rounded-lg bg-slate-200"></div>
            <div className="mt-2 h-4 w-48 animate-pulse rounded bg-slate-200"></div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 animate-pulse rounded-lg bg-slate-200"></div>
          <div className="h-10 w-20 animate-pulse rounded-lg bg-slate-200"></div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="h-12 animate-pulse rounded-lg bg-slate-200"></div>

      {/* Content Skeleton */}
      <div className="h-96 animate-pulse rounded-2xl bg-slate-200"></div>
    </div>
  );
}
