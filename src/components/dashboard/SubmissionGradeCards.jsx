import { Link } from 'react-router-dom';
import { Badge } from '../ui';

const submissionStatusConfig = {
  pending: { variant: 'warning', icon: 'pending', label: 'Pending' },
  graded: { variant: 'success', icon: 'check_circle', label: 'Graded' },
  'in-review': { variant: 'info', icon: 'rate_review', label: 'In review' },
};

const scoreToneClass = (percentage) => {
  if (percentage >= 80) return 'text-[#2f6e3d]';
  if (percentage >= 60) return 'text-[#326d63]';
  if (percentage >= 40) return 'text-[#7a5a0e]';
  return 'text-[#8a3636]';
};

export function SubmissionCard({ submission }) {
  const status = submissionStatusConfig[submission.status] || submissionStatusConfig.pending;

  return (
    <div className="group rounded-lg border border-hairline bg-canvas p-6 transition-colors duration-150 hover:border-primary/30">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-medium text-primary">
            {submission.student.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <h4 className="font-display text-[18px] leading-tight text-ink">
              {submission.student.name}
            </h4>
            <p className="text-xs text-muted">{submission.student.id}</p>
          </div>
        </div>
        <Badge variant={status.variant} size="sm">
          <span className="material-symbols-outlined text-[13px]">{status.icon}</span>
          {status.label}
        </Badge>
      </div>

      <div className="mt-5 rounded-md bg-surface-soft p-3.5">
        <p className="text-sm font-medium text-ink">{submission.examTitle}</p>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            Submitted {submission.submittedAt}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">timer</span>
            {submission.timeTaken}
          </span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-hairline-soft pt-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-soft">Auto score</p>
          <p className="mt-1 font-display text-[22px] leading-none text-ink">
            {submission.autoScore}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-soft">Manual</p>
          <p
            className={`mt-1 font-display text-[22px] leading-none ${
              submission.manualScore !== undefined ? 'text-ink' : 'text-warning'
            }`}
          >
            {submission.manualScore !== undefined ? submission.manualScore : '—'}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-soft">Total</p>
          {submission.totalScore !== undefined ? (
            <p
              className={`mt-1 font-display text-[22px] leading-none ${scoreToneClass(submission.percentage)}`}
            >
              {submission.totalScore}/{submission.maxScore}
            </p>
          ) : (
            <p className="mt-1 font-display text-[22px] leading-none text-muted-soft">—</p>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <Link
          to={`/dashboard/grade/${submission.id}`}
          className="flex h-10 flex-1 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
        >
          {submission.status === 'pending' ? 'Grade now' : 'Review'}
        </Link>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-md border border-hairline bg-canvas text-ink transition-colors hover:bg-surface-soft"
          aria-label="More"
        >
          <span className="material-symbols-outlined text-[18px]">more_vert</span>
        </button>
      </div>
    </div>
  );
}

export function SubmissionCardSkeleton() {
  return (
    <div className="rounded-lg border border-hairline bg-canvas p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 animate-pulse rounded-full bg-hairline" />
          <div className="space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-hairline" />
            <div className="h-3 w-24 animate-pulse rounded bg-hairline" />
          </div>
        </div>
        <div className="h-6 w-20 animate-pulse rounded-full bg-hairline" />
      </div>
      <div className="mt-5 h-16 animate-pulse rounded-md bg-hairline" />
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded bg-hairline" />
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        <div className="h-10 flex-1 animate-pulse rounded-md bg-hairline" />
        <div className="h-10 w-10 animate-pulse rounded-md bg-hairline" />
      </div>
    </div>
  );
}

const letterGrade = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 85) return 'A';
  if (percentage >= 80) return 'A−';
  if (percentage >= 75) return 'B+';
  if (percentage >= 70) return 'B';
  if (percentage >= 65) return 'B−';
  if (percentage >= 60) return 'C+';
  if (percentage >= 55) return 'C';
  if (percentage >= 50) return 'C−';
  if (percentage >= 40) return 'D';
  return 'F';
};

export function GradeCard({ grade }) {
  const percentage = Math.round((grade.score / grade.totalMarks) * 100);
  const letter = letterGrade(percentage);
  const tone = scoreToneClass(percentage);

  return (
    <div className="group rounded-lg border border-hairline bg-canvas p-6 transition-colors duration-150 hover:border-primary/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-[22px] leading-tight tracking-[-0.015em] text-ink">
            {grade.examTitle}
          </h3>
          <p className="mt-1 text-sm text-muted">{grade.subject}</p>
        </div>
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-md border border-hairline bg-surface-soft ${tone}`}
        >
          <span className="font-display text-[24px] leading-none">{letter}</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-md bg-surface-soft p-3.5">
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-soft">Score</p>
          <p className="mt-1 font-display text-[22px] leading-none text-ink">
            {grade.score}/{grade.totalMarks}
          </p>
        </div>
        <div className="rounded-md bg-surface-soft p-3.5">
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-soft">Percentage</p>
          <p className={`mt-1 font-display text-[22px] leading-none ${tone}`}>{percentage}%</p>
        </div>
        <div className="rounded-md bg-surface-soft p-3.5">
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-soft">Rank</p>
          <p className="mt-1 font-display text-[22px] leading-none text-ink">
            {grade.rank || '—'}
          </p>
        </div>
      </div>

      {grade.feedback && (
        <div className="mt-5 rounded-md border border-hairline-soft bg-surface-soft p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-ink">
            <span className="material-symbols-outlined text-[18px] text-muted">comment</span>
            Teacher feedback
          </div>
          <p className="mt-2 text-sm leading-relaxed text-body">{grade.feedback}</p>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs text-muted">Graded on {grade.gradedAt}</span>
        <Link
          to={`/dashboard/exam-result/${grade.examId}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View details
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}

export function GradeCardSkeleton() {
  return (
    <div className="rounded-lg border border-hairline bg-canvas p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="h-6 w-48 animate-pulse rounded bg-hairline" />
          <div className="h-4 w-32 animate-pulse rounded bg-hairline" />
        </div>
        <div className="h-14 w-14 animate-pulse rounded-md bg-hairline" />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-md bg-hairline" />
        ))}
      </div>
      <div className="mt-5 h-20 animate-pulse rounded-md bg-hairline" />
      <div className="mt-5 flex items-center justify-between">
        <div className="h-4 w-32 animate-pulse rounded bg-hairline" />
        <div className="h-4 w-24 animate-pulse rounded bg-hairline" />
      </div>
    </div>
  );
}
