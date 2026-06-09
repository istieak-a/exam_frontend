'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui';
import { StatCard } from '../../components/dashboard';
import { examApi } from '../../services/api';

const statusBadge = {
  SUBMITTED: { variant: 'warning', label: 'Pending', icon: 'pending_actions' },
  GRADED_MCQ: { variant: 'info', label: 'Auto-graded', icon: 'calculate' },
  FULLY_GRADED: { variant: 'success', label: 'Graded', icon: 'check_circle' },
};

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedExam, setSelectedExam] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    examApi.getSubmissions(0, 100).then((d) => setSubmissions(d.content || [])).catch(() => {});
  }, []);

  const filteredSubmissions = submissions.filter((s) => {
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchesExam = selectedExam === 'all' || s.examTitle === selectedExam;
    const matchesSearch =
      (s.studentName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesExam && matchesSearch;
  });

  const stats = {
    all: submissions.length,
    pending: submissions.filter((s) => s.status === 'SUBMITTED').length,
    inReview: submissions.filter((s) => s.status === 'GRADED_MCQ').length,
    graded: submissions.filter((s) => s.status === 'FULLY_GRADED').length,
  };

  const tabs = [
    { id: 'all', label: 'All', count: stats.all },
    { id: 'SUBMITTED', label: 'Pending', count: stats.pending },
    { id: 'GRADED_MCQ', label: 'Auto-graded', count: stats.inReview },
    { id: 'FULLY_GRADED', label: 'Graded', count: stats.graded },
  ];

  const uniqueExamTitles = [...new Set(submissions.map((s) => s.examTitle).filter(Boolean))];

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
        <StatCard title="Auto-graded" value={stats.inReview} subtitle="MCQ done" icon="calculate" variant="info" />
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
                {uniqueExamTitles.map((title) => (
                  <option key={title} value={title}>{title}</option>
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
                  placeholder="By student name…"
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
  const statusInfo = statusBadge[submission.status] || statusBadge.SUBMITTED;
  const initials = (submission.studentName || 'S')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
  const pct = submission.maxScore > 0
    ? ((submission.totalScore / submission.maxScore) * 100).toFixed(0)
    : null;
  const needsGrading = submission.status === 'SUBMITTED' && submission.examType === 'CQ';

  return (
    <article className="rounded-lg border border-hairline bg-canvas p-6 transition-colors hover:border-primary/30">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-1 items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-medium text-primary">
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">
                {submission.studentName}
              </h3>
              <Badge variant={statusInfo.variant} size="sm">
                <span className="material-symbols-outlined text-[13px]">{statusInfo.icon}</span>
                {statusInfo.label}
              </Badge>
              {(submission.cameraTerminated || submission.proctoringFlagged) && (
                <Badge variant="error" size="sm">
                  <span className="material-symbols-outlined text-[13px]">videocam_off</span>
                  Proctoring Flag
                </Badge>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm text-body">
              <span className="material-symbols-outlined text-[16px] text-muted">assignment</span>
              <span className="font-medium">{submission.examTitle}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">
                  {submission.examType === 'MCQ' ? 'radio_button_checked' : 'edit_note'}
                </span>
                {submission.examType === 'MCQ' ? 'MCQ' : 'Written'}
              </span>
              {submission.submittedAt && (
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  {new Date(submission.submittedAt).toLocaleString()}
                </span>
              )}
              {submission.totalScore != null && (
                <span className="flex items-center gap-1.5 font-medium text-primary">
                  <span className="material-symbols-outlined text-[14px]">military_tech</span>
                  {submission.totalScore}/{submission.maxScore}
                  {pct && ` (${pct}%)`}
                </span>
              )}
              {submission.cameraViolationCount > 0 && (
                <span className="flex items-center gap-1.5 text-error font-medium">
                  <span className="material-symbols-outlined text-[14px]">videocam_off</span>
                  {submission.cameraViolationCount} camera violation{submission.cameraViolationCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="shrink-0">
          {needsGrading ? (
            <Link
              to={`/dashboard/grade/${submission.id}`}
              className="inline-flex h-10 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
            >
              <span className="material-symbols-outlined text-[16px]">rate_review</span>
              Grade
            </Link>
          ) : (
            <Link
              to={`/dashboard/grade/${submission.id}`}
              className="inline-flex h-10 items-center gap-1.5 rounded-md border border-hairline bg-canvas px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-soft"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              View
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
