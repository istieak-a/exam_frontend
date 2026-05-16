'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui';
import { StatCard } from '../../components/dashboard';
import {
  submissions as mockSubmissions,
  teacherExams as mockTeacherExams,
} from '../../data/mockData';

const statusBadge = {
  pending: { variant: 'warning', label: 'Pending', icon: 'pending_actions' },
  'in-review': { variant: 'info', label: 'In review', icon: 'rate_review' },
  graded: { variant: 'success', label: 'Graded', icon: 'check_circle' },
};

export default function Submissions() {
  const [submissions] = useState(mockSubmissions);
  const [exams] = useState(mockTeacherExams);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedExam, setSelectedExam] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesStatus = filterStatus === 'all' || submission.status === filterStatus;
    const matchesExam = selectedExam === 'all' || submission.examTitle === selectedExam;
    const matchesSearch =
      submission.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.student.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesExam && matchesSearch;
  });

  const stats = {
    all: submissions.length,
    pending: submissions.filter((s) => s.status === 'pending').length,
    inReview: submissions.filter((s) => s.status === 'in-review').length,
    graded: submissions.filter((s) => s.status === 'graded').length,
  };

  const tabs = [
    { id: 'all', label: 'All', count: stats.all },
    { id: 'pending', label: 'Pending', count: stats.pending },
    { id: 'in-review', label: 'In review', count: stats.inReview },
    { id: 'graded', label: 'Graded', count: stats.graded },
  ];

  return (
    <div className="space-y-8">
      <header className="border-b border-hairline pb-6">
        <p className="text-xs uppercase tracking-[0.15em] text-muted">Submissions</p>
        <h1 className="mt-2 font-display text-[36px] leading-tight tracking-[-0.02em] text-ink md:text-[42px]">
          Submissions inbox
        </h1>
        <p className="mt-2 text-sm text-muted">Where considered grading happens.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total" value={stats.all} subtitle="Across exams" icon="fact_check" variant="primary" />
        <StatCard title="Pending" value={stats.pending} subtitle="Need a read" icon="pending_actions" variant="warning" />
        <StatCard title="In review" value={stats.inReview} subtitle="With you" icon="rate_review" variant="info" />
        <StatCard title="Graded" value={stats.graded} subtitle="Closed" icon="check_circle" variant="success" />
      </section>

      <section className="rounded-lg border border-hairline bg-canvas p-5">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-[0.15em] text-muted">
              Filter by status
            </label>
            <div className="flex flex-wrap items-center gap-1 rounded-md bg-surface-soft p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    filterStatus === tab.id
                      ? 'bg-canvas text-ink shadow-sm'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {tab.label} <span className="ml-1 text-xs text-muted">({tab.count})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium text-ink">Filter by exam</label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="h-10 w-full rounded-md border border-hairline bg-canvas px-3 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All exams</option>
                {exams
                  .filter((e) =>
                    ['published', 'active', 'completed'].includes(e.status?.toLowerCase()),
                  )
                  .map((exam) => (
                    <option key={exam.id} value={exam.title}>
                      {exam.title}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium text-ink">Search student</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-muted">
                  search
                </span>
                <input
                  type="text"
                  placeholder="By name or ID…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-md border border-hairline bg-canvas pl-9 pr-3 text-sm text-ink placeholder:text-muted-soft focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-hairline bg-surface-soft p-12 text-center">
            <span className="material-symbols-outlined text-[40px] text-muted">fact_check</span>
            <h3 className="mt-3 font-display text-[22px] leading-tight text-ink">
              No submissions match.
            </h3>
            <p className="mt-2 text-sm text-muted">
              {searchQuery || selectedExam !== 'all' || filterStatus !== 'all'
                ? 'Loosen a filter to see more.'
                : 'No submissions yet.'}
            </p>
          </div>
        ) : (
          filteredSubmissions.map((submission) => (
            <SubmissionRow key={submission.id} submission={submission} />
          ))
        )}
      </section>
    </div>
  );
}

function SubmissionRow({ submission }) {
  const status = statusBadge[submission.status] || statusBadge.pending;

  return (
    <article className="rounded-lg border border-hairline bg-canvas p-6 transition-colors hover:border-primary/30">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-1 items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-medium text-primary">
            {submission.student.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">
                {submission.student.name}
              </h3>
              <Badge variant={status.variant} size="sm">
                <span className="material-symbols-outlined text-[13px]">{status.icon}</span>
                {status.label}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted">{submission.student.id}</p>

            <div className="mt-3 flex items-center gap-2 text-sm text-body">
              <span className="material-symbols-outlined text-[16px] text-muted">assignment</span>
              <span className="font-medium">{submission.examTitle}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">
                  {submission.examType === 'mcq' ? 'radio_button_checked' : 'edit_note'}
                </span>
                {submission.examType === 'mcq' ? 'MCQ' : 'Written'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                {submission.submittedAt}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">timer</span>
                {submission.timeTaken}
              </span>
              {submission.autoScore && (
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">calculate</span>
                  Auto {submission.autoScore}
                </span>
              )}
              {submission.totalScore !== undefined && (
                <span className="flex items-center gap-1.5 font-medium text-primary">
                  <span className="material-symbols-outlined text-[14px]">military_tech</span>
                  {submission.totalScore}/{submission.maxScore} ({submission.percentage}%)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="shrink-0">
          {submission.examType === 'mcq' || submission.status === 'graded' ? (
            <Link
              to={`/dashboard/grade/${submission.id}`}
              className="inline-flex h-10 items-center gap-1.5 rounded-md border border-hairline bg-canvas px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-soft"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              View
            </Link>
          ) : (
            <Link
              to={`/dashboard/grade/${submission.id}`}
              className="inline-flex h-10 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
            >
              <span className="material-symbols-outlined text-[16px]">rate_review</span>
              Grade
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

