import { Link } from 'react-router-dom';

// Submission Card Component
export function SubmissionCard({ submission }) {
  const statusConfig = {
    pending: { color: 'bg-amber-100 text-amber-700', icon: 'pending' },
    graded: { color: 'bg-emerald-100 text-emerald-700', icon: 'check_circle' },
    'in-review': { color: 'bg-sky-100 text-sky-700', icon: 'rate_review' },
  };

  const status = statusConfig[submission.status] || statusConfig.pending;

  const getGradeColor = (percentage) => {
    if (percentage >= 80) return 'text-emerald-600';
    if (percentage >= 60) return 'text-sky-600';
    if (percentage >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {submission.student.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">{submission.student.name}</h4>
            <p className="text-sm text-slate-500">{submission.student.id}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium ${status.color}`}>
          <span className="material-symbols-outlined text-sm">{status.icon}</span>
          {submission.status.replace('-', ' ').charAt(0).toUpperCase() + submission.status.replace('-', ' ').slice(1)}
        </span>
      </div>

      {/* Exam Info */}
      <div className="mt-4 rounded-lg bg-slate-50 p-3">
        <p className="text-sm font-medium text-slate-900">{submission.examTitle}</p>
        <div className="mt-2 flex items-center gap-4 text-xs text-slate-600">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">schedule</span>
            Submitted: {submission.submittedAt}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">timer</span>
            {submission.timeTaken}
          </span>
        </div>
      </div>

      {/* Scores */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-xs text-slate-500">Auto Score</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{submission.autoScore}</p>
        </div>
        {submission.manualScore !== undefined ? (
          <div className="text-center">
            <p className="text-xs text-slate-500">Manual Score</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{submission.manualScore}</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xs text-slate-500">Manual</p>
            <p className="mt-1 text-sm font-medium text-amber-600">Pending</p>
          </div>
        )}
        {submission.totalScore !== undefined ? (
          <div className="text-center">
            <p className="text-xs text-slate-500">Total</p>
            <p className={`mt-1 text-lg font-bold ${getGradeColor(submission.percentage)}`}>
              {submission.totalScore}/{submission.maxScore}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xs text-slate-500">Total</p>
            <p className="mt-1 text-sm font-medium text-slate-400">-</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <Link
          to={`/dashboard/grade/${submission.id}`}
          className="flex-1 rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          {submission.status === 'pending' ? 'Grade Now' : 'Review'}
        </Link>
        <button className="rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200">
          <span className="material-symbols-outlined text-lg">more_vert</span>
        </button>
      </div>
    </div>
  );
}

// Submission Card Skeleton
export function SubmissionCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
            <div className="h-3 w-24 rounded bg-slate-200 animate-pulse" />
          </div>
        </div>
        <div className="h-7 w-20 rounded-lg bg-slate-200 animate-pulse" />
      </div>
      <div className="mt-4 h-16 rounded-lg bg-slate-200 animate-pulse" />
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 rounded bg-slate-200 animate-pulse" />
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-9 flex-1 rounded-lg bg-slate-200 animate-pulse" />
        <div className="h-9 w-9 rounded-lg bg-slate-200 animate-pulse" />
      </div>
    </div>
  );
}

// Grade Card Component (for student view)
export function GradeCard({ grade }) {
  const getGradeColor = (percentage) => {
    if (percentage >= 80) return 'text-emerald-600 bg-emerald-50 ring-emerald-200';
    if (percentage >= 60) return 'text-sky-600 bg-sky-50 ring-sky-200';
    if (percentage >= 40) return 'text-amber-600 bg-amber-50 ring-amber-200';
    return 'text-red-600 bg-red-50 ring-red-200';
  };

  const getLetterGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 85) return 'A';
    if (percentage >= 80) return 'A-';
    if (percentage >= 75) return 'B+';
    if (percentage >= 70) return 'B';
    if (percentage >= 65) return 'B-';
    if (percentage >= 60) return 'C+';
    if (percentage >= 55) return 'C';
    if (percentage >= 50) return 'C-';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  const percentage = Math.round((grade.score / grade.totalMarks) * 100);
  const letterGrade = getLetterGrade(percentage);

  return (
    <div className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{grade.examTitle}</h3>
          <p className="mt-1 text-sm text-slate-600">{grade.subject}</p>
        </div>
        <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${getGradeColor(percentage)} ring-1`}>
          <span className="text-2xl font-bold">{letterGrade}</span>
        </div>
      </div>

      {/* Score Details */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Score</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{grade.score}/{grade.totalMarks}</p>
        </div>
        <div className="text-center rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Percentage</p>
          <p className={`mt-1 text-xl font-bold ${percentage >= 40 ? 'text-emerald-600' : 'text-red-600'}`}>
            {percentage}%
          </p>
        </div>
        <div className="text-center rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Rank</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{grade.rank || '-'}</p>
        </div>
      </div>

      {/* Feedback */}
      {grade.feedback && (
        <div className="mt-4 rounded-lg bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <span className="material-symbols-outlined text-lg">comment</span>
            Teacher's Feedback
          </div>
          <p className="mt-2 text-sm text-slate-600">{grade.feedback}</p>
        </div>
      )}

      {/* Date & Actions */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Graded on {grade.gradedAt}
        </span>
        <Link
          to={`/dashboard/exam-result/${grade.examId}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
        >
          View Details
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}

// Grade Card Skeleton
export function GradeCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="h-6 w-48 rounded bg-slate-200 animate-pulse" />
          <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
        </div>
        <div className="h-16 w-16 rounded-xl bg-slate-200 animate-pulse" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 rounded-lg bg-slate-200 animate-pulse" />
        ))}
      </div>
      <div className="mt-4 h-20 rounded-lg bg-slate-200 animate-pulse" />
      <div className="mt-4 flex items-center justify-between">
        <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
        <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
      </div>
    </div>
  );
}
