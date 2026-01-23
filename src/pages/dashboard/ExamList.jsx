'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTeacherExams } from '../../services/examService';

export default function ExamList() {
  const [isLoading, setIsLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setIsLoading(true);
        const data = await getTeacherExams();
        const examsList = Array.isArray(data) ? data : data?.content || [];
        setExams(examsList);
      } catch (err) {
        console.error('Failed to fetch exams:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, []);

  const filteredExams = exams.filter((exam) => {
    const matchesStatus = filterStatus === 'all' || exam.status.toLowerCase() === filterStatus;
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (exam.course || exam.subject || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    all: exams.length,
    draft: exams.filter(e => e.status.toLowerCase() === 'draft').length,
    published: exams.filter(e => e.status.toLowerCase() === 'published').length,
    active: exams.filter(e => e.status.toLowerCase() === 'active').length,
    completed: exams.filter(e => e.status.toLowerCase() === 'completed').length,
    archived: exams.filter(e => e.status.toLowerCase() === 'archived').length,
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Exams</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage and organize all your exams
          </p>
        </div>
        <Link
          to="/dashboard/create-exam"
          style={{ background: 'linear-gradient(to right, #0084D1, #006BB3)' }}
          className="flex items-center gap-2 rounded-lg px-5 py-2.5 font-medium text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          Create Exam
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Exams</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{stats.all}</p>
            </div>
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: '#0084D1' }}
            >
              <span className="material-symbols-outlined text-2xl">assignment</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{stats.active}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white">
              <span className="material-symbols-outlined text-2xl">play_circle</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Completed</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{stats.completed}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white">
              <span className="material-symbols-outlined text-2xl">check_circle</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Drafts</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{stats.draft}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white">
              <span className="material-symbols-outlined text-2xl">draft</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2 rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setFilterStatus('all')}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-all ${
                filterStatus === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({stats.all})
            </button>
            <button
              onClick={() => setFilterStatus('draft')}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-all ${
                filterStatus === 'draft'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Drafts ({stats.draft})
            </button>
            <button
              onClick={() => setFilterStatus('published')}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-all ${
                filterStatus === 'published'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Published ({stats.published})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-all ${
                filterStatus === 'active'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active ({stats.active})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-all ${
                filterStatus === 'completed'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed ({stats.completed})
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search exams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm focus:outline-none md:w-64"
              onFocus={(e) => {
                e.target.style.borderColor = '#0084D1';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 132, 209, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
      </div>

      {/* Exams List */}
      <div className="space-y-4">
        {filteredExams.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-slate-200">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <span className="material-symbols-outlined text-3xl text-slate-400">assignment</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">No exams found</h3>
            <p className="text-sm text-slate-600">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Create your first exam to get started'}
            </p>
          </div>
        ) : (
          filteredExams.map((exam) => <ExamCard key={exam.id} exam={exam} />)
        )}
      </div>
    </div>
  );
}

// Exam Card Component
function ExamCard({ exam }) {
  const statusConfig = {
    draft: {
      label: 'Draft',
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
    published: {
      label: 'Published',
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    active: {
      label: 'Active',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    completed: {
      label: 'Completed',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    archived: {
      label: 'Archived',
      color: 'text-slate-700',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
    },
  };

  const difficultyConfig = {
    easy: { label: 'Easy', color: 'text-green-600' },
    medium: { label: 'Medium', color: 'text-amber-600' },
    hard: { label: 'Hard', color: 'text-red-600' },
  };

  const examTypeConfig = {
    mcq: { label: 'MCQ', icon: 'check_box' },
    cq: { label: 'Written', icon: 'edit_note' },
  };

  const status = statusConfig[exam.status?.toLowerCase()] || statusConfig.draft;
  const difficulty = difficultyConfig[exam.difficulty];
  const examType = examTypeConfig[exam.examType?.toLowerCase()];
  const course = exam.course || exam.subject || 'No course';
  const duration = exam.durationMinutes || exam.duration;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: '#0084D1' }}
            >
              <span className="material-symbols-outlined text-xl">assignment</span>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-900">{exam.title}</h3>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${status.color} ${status.bgColor} ${status.borderColor}`}
                >
                  {status.label}
                </span>
                {examType && (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                    {examType.label}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-600">{course}</p>

              {/* Exam Details */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">quiz</span>
                  <span>{exam.totalQuestions || exam.questions?.length || 0} questions</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  <span>{duration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">military_tech</span>
                  <span>{exam.totalMarks} marks</span>
                </div>
                {exam.passingMarks && (
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">verified</span>
                    <span>Pass: {exam.passingMarks}</span>
                  </div>
                )}
                {exam.difficulty && difficulty && (
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">signal_cellular_alt</span>
                    <span className={difficulty.color}>{difficulty.label}</span>
                  </div>
                )}
                {['active', 'completed'].includes(exam.status?.toLowerCase()) && (
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">people</span>
                    <span>{exam.submissions || 0} submissions</span>
                  </div>
                )}
              </div>

              {/* Dates */}
              {(exam.startDateTime || exam.startDate) && (
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    Start: {exam.startDateTime 
                      ? new Date(exam.startDateTime).toLocaleString() 
                      : exam.startDate}
                  </span>
                  {(exam.endDateTime || exam.dueDate) && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">event</span>
                      End: {exam.endDateTime 
                        ? new Date(exam.endDateTime).toLocaleString() 
                        : exam.dueDate}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to={`/dashboard/exam/${exam.id}`}
            style={{ backgroundColor: '#0084D1' }}
            className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
          >
            <span className="material-symbols-outlined text-lg">
              {exam.status?.toLowerCase() === 'draft' ? 'edit' : 'visibility'}
            </span>
            {exam.status?.toLowerCase() === 'draft' ? 'Edit' : 'View'}
          </Link>
        </div>
      </div>
    </div>
  );
}

// Loading Skeleton
function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200"></div>
          <div className="mt-2 h-4 w-96 animate-pulse rounded bg-slate-200"></div>
        </div>
        <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-200"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200"></div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="h-20 animate-pulse rounded-2xl bg-slate-200"></div>

      {/* Exams Skeleton */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-xl bg-slate-200"></div>
        ))}
      </div>
    </div>
  );
}
