'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teacherExams } from '../../data/mockData';

export default function ExamList() {
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'published', 'draft'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredExams = teacherExams.filter((exam) => {
    const matchesStatus = filterStatus === 'all' || exam.status === filterStatus;
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exam.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    all: teacherExams.length,
    published: teacherExams.filter(e => e.status === 'published').length,
    draft: teacherExams.filter(e => e.status === 'draft').length,
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
      <div className="grid gap-4 sm:grid-cols-3">
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
              <p className="text-sm font-medium text-slate-600">Published</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{stats.published}</p>
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
          <div className="flex gap-2 rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setFilterStatus('all')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                filterStatus === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({stats.all})
            </button>
            <button
              onClick={() => setFilterStatus('published')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                filterStatus === 'published'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Published ({stats.published})
            </button>
            <button
              onClick={() => setFilterStatus('draft')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                filterStatus === 'draft'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Drafts ({stats.draft})
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

  const difficultyConfig = {
    easy: { label: 'Easy', color: 'text-green-600' },
    medium: { label: 'Medium', color: 'text-amber-600' },
    hard: { label: 'Hard', color: 'text-red-600' },
  };

  const status = statusConfig[exam.status];
  const difficulty = difficultyConfig[exam.difficulty];

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
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-900">{exam.title}</h3>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${status.color} ${status.bgColor} ${status.borderColor}`}
                >
                  {status.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{exam.subject}</p>

              {/* Exam Details */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">quiz</span>
                  <span>{exam.totalQuestions} questions</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  <span>{exam.duration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">military_tech</span>
                  <span>{exam.totalMarks} marks</span>
                </div>
                {exam.difficulty && (
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">signal_cellular_alt</span>
                    <span className={difficulty.color}>{difficulty.label}</span>
                  </div>
                )}
                {exam.status === 'published' && (
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">people</span>
                    <span>{exam.submissions} submissions</span>
                  </div>
                )}
              </div>

              {/* Dates */}
              {exam.startDate && (
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    Start: {exam.startDate}
                  </span>
                  {exam.dueDate && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">event</span>
                      Due: {exam.dueDate}
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
              {exam.status === 'draft' ? 'edit' : 'visibility'}
            </span>
            {exam.status === 'draft' ? 'Edit' : 'View'}
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
