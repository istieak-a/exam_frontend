'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllSubmissions, getTeacherExams } from '../../services/examService';

export default function Submissions() {
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [exams, setExams] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'graded', 'in-review'
  const [selectedExam, setSelectedExam] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch submissions and exams in parallel
        const [submissionsData, examsData] = await Promise.all([
          getAllSubmissions(),
          getTeacherExams(),
        ]);
        
        const submissionsList = Array.isArray(submissionsData) ? submissionsData : submissionsData?.content || [];
        const examsList = Array.isArray(examsData) ? examsData : examsData?.content || [];
        
        setSubmissions(submissionsList);
        setExams(examsList);
      } catch (err) {
        console.error('Failed to fetch submissions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesStatus = filterStatus === 'all' || submission.status === filterStatus;
    const matchesExam = selectedExam === 'all' || submission.examTitle === selectedExam;
    const matchesSearch = submission.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          submission.student.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesExam && matchesSearch;
  });

  const stats = {
    all: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    inReview: submissions.filter(s => s.status === 'in-review').length,
    graded: submissions.filter(s => s.status === 'graded').length,
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Submissions</h1>
        <p className="mt-1 text-sm text-slate-600">
          Review and grade student submissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{stats.all}</p>
            </div>
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: '#0084D1' }}
            >
              <span className="material-symbols-outlined text-2xl">fact_check</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pending</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{stats.pending}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white">
              <span className="material-symbols-outlined text-2xl">pending_actions</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">In Review</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{stats.inReview}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white">
              <span className="material-symbols-outlined text-2xl">rate_review</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Graded</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{stats.graded}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white">
              <span className="material-symbols-outlined text-2xl">check_circle</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col gap-4">
          {/* Status Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Filter by Status</label>
            <div className="flex gap-2 rounded-lg bg-slate-100 p-1">
              <button
                onClick={() => setFilterStatus('all')}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  filterStatus === 'all'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({stats.all})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  filterStatus === 'pending'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setFilterStatus('in-review')}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  filterStatus === 'in-review'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                In Review ({stats.inReview})
              </button>
              <button
                onClick={() => setFilterStatus('graded')}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  filterStatus === 'graded'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Graded ({stats.graded})
              </button>
            </div>
          </div>

          {/* Exam Filter and Search */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-slate-700">Filter by Exam</label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none"
                onFocus={(e) => {
                  e.target.style.borderColor = '#0084D1';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 132, 209, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="all">All Exams</option>
                {exams.filter(e => ['published', 'active', 'completed'].includes(e.status?.toLowerCase())).map((exam) => (
                  <option key={exam.id} value={exam.title}>
                    {exam.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-slate-700">Search Student</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm focus:outline-none"
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
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-slate-200">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <span className="material-symbols-outlined text-3xl text-slate-400">fact_check</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">No submissions found</h3>
            <p className="text-sm text-slate-600">
              {searchQuery || selectedExam !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No submissions available yet'}
            </p>
          </div>
        ) : (
          filteredSubmissions.map((submission) => (
            <SubmissionCard key={submission.id} submission={submission} />
          ))
        )}
      </div>
    </div>
  );
}

// Submission Card Component
function SubmissionCard({ submission }) {
  const statusConfig = {
    pending: {
      label: 'Pending Review',
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      icon: 'pending_actions',
    },
    'in-review': {
      label: 'In Review',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: 'rate_review',
    },
    graded: {
      label: 'Graded',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: 'check_circle',
    },
  };

  const status = statusConfig[submission.status];

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200 transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Student Info */}
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-lg font-bold text-white">
              {submission.student.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-900">{submission.student.name}</h3>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${status.color} ${status.bgColor} ${status.borderColor}`}
                >
                  {status.label}
                </span>
              </div>
              <p className="text-sm text-slate-600">{submission.student.id}</p>

              {/* Exam Title */}
              <div className="mt-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-slate-400">assignment</span>
                <span className="font-medium text-slate-700">{submission.examTitle}</span>
              </div>

              {/* Submission Details */}
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    {submission.examType === 'mcq' ? 'radio_button_checked' : 'edit_note'}
                  </span>
                  <span className="font-medium">
                    {submission.examType === 'mcq' ? 'MCQ Exam' : 'CQ Exam'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  <span>{submission.submittedAt}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">timer</span>
                  <span>Time: {submission.timeTaken}</span>
                </div>
                {submission.autoScore && (
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">calculate</span>
                    <span>Auto: {submission.autoScore}</span>
                  </div>
                )}
                {submission.totalScore !== undefined && (
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">military_tech</span>
                    <span className="font-semibold" style={{ color: '#0084D1' }}>
                      Score: {submission.totalScore}/{submission.maxScore} ({submission.percentage}%)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {submission.examType === 'mcq' ? (
            // MCQ exams - only View option (auto-graded)
            <Link
              to={`/dashboard/grade/${submission.id}`}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <span className="material-symbols-outlined text-lg">visibility</span>
              View
            </Link>
          ) : (
            // CQ exams - Grade or View option
            submission.status === 'graded' ? (
              <Link
                to={`/dashboard/grade/${submission.id}`}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                <span className="material-symbols-outlined text-lg">visibility</span>
                View
              </Link>
            ) : (
              <Link
                to={`/dashboard/grade/${submission.id}`}
                style={{ backgroundColor: '#0084D1' }}
                className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
              >
                <span className="material-symbols-outlined text-lg">rate_review</span>
                Grade
              </Link>
            )
          )}
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
      <div>
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200"></div>
        <div className="mt-2 h-4 w-96 animate-pulse rounded bg-slate-200"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200"></div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="h-40 animate-pulse rounded-2xl bg-slate-200"></div>

      {/* Submissions Skeleton */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-200"></div>
        ))}
      </div>
    </div>
  );
}
