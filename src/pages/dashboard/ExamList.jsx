'use client';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui';
import { StatCard } from '../../components/dashboard';
import { getTeacherExams } from '../../services/examService';

const statusBadge = {
  draft: 'pill',
  published: 'coral-soft',
  active: 'info',
  completed: 'success',
  archived: 'pill',
};

const difficultyTone = {
  easy: 'text-[#2f6e3d]',
  medium: 'text-[#7a5a0e]',
  hard: 'text-[#8a3636]',
};

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
    const status = (exam.status || '').toLowerCase();
    const matchesStatus = filterStatus === 'all' || status === filterStatus;
    const matchesSearch =
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exam.course || exam.subject || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    all: exams.length,
    draft: exams.filter((e) => e.status?.toLowerCase() === 'draft').length,
    published: exams.filter((e) => e.status?.toLowerCase() === 'published').length,
    active: exams.filter((e) => e.status?.toLowerCase() === 'active').length,
    completed: exams.filter((e) => e.status?.toLowerCase() === 'completed').length,
    archived: exams.filter((e) => e.status?.toLowerCase() === 'archived').length,
  };

  if (isLoading) return <PageSkeleton />;

  const tabs = [
    { id: 'all', label: 'All', count: stats.all },
    { id: 'draft', label: 'Drafts', count: stats.draft },
    { id: 'published', label: 'Published', count: stats.published },
    { id: 'active', label: 'Active', count: stats.active },
    { id: 'completed', label: 'Completed', count: stats.completed },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 border-b border-hairline pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-muted">Library</p>
          <h1 className="mt-2 font-display text-[36px] leading-tight tracking-[-0.02em] text-ink md:text-[42px]">
            My exams
          </h1>
          <p className="mt-2 text-sm text-muted">Authored, in flight, and in the archive.</p>
        </div>
        <Link
          to="/dashboard/create-exam"
          className="inline-flex h-10 items-center gap-2 self-start rounded-md bg-primary px-5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New exam
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total"
          value={stats.all}
          subtitle="Authored to date"
          icon="assignment"
          variant="primary"
        />
        <StatCard
          title="Active"
          value={stats.active}
          subtitle="Currently open"
          icon="play_circle"
          variant="info"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          subtitle="Closed exams"
          icon="check_circle"
          variant="success"
        />
        <StatCard
          title="Drafts"
          value={stats.draft}
          subtitle="In progress"
          icon="draft"
          variant="warning"
        />
      </section>

      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-1 rounded-md bg-surface-soft p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                filterStatus === tab.id
                  ? 'bg-canvas text-ink shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {tab.label}{' '}
              <span className="ml-1 text-xs text-muted">({tab.count})</span>
            </button>
          ))}
        </div>

        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-muted">
            search
          </span>
          <input
            type="text"
            placeholder="Search exams…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-hairline bg-canvas pl-9 pr-3 text-sm text-ink placeholder:text-muted-soft focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 md:w-72"
          />
        </div>
      </section>

      <section className="space-y-4">
        {filteredExams.length === 0 ? (
          <div className="rounded-lg border border-dashed border-hairline bg-surface-soft p-12 text-center">
            <span className="material-symbols-outlined text-[40px] text-muted">assignment</span>
            <h3 className="mt-3 font-display text-[22px] leading-tight text-ink">
              No exams to show.
            </h3>
            <p className="mt-2 text-sm text-muted">
              {searchQuery
                ? 'Try a different search term.'
                : 'Create your first exam to get started.'}
            </p>
          </div>
        ) : (
          filteredExams.map((exam) => <TeacherExamRow key={exam.id} exam={exam} />)
        )}
      </section>
    </div>
  );
}

function TeacherExamRow({ exam }) {
  const status = (exam.status || 'draft').toLowerCase();
  const badgeVariant = statusBadge[status] || 'pill';
  const duration = exam.durationMinutes || exam.duration;
  const course = exam.course || exam.subject || 'No course';

  return (
    <article className="rounded-lg border border-hairline bg-canvas p-6 transition-colors hover:border-primary/30">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-1 items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-[20px]">assignment</span>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-[22px] leading-tight tracking-[-0.015em] text-ink">
                {exam.title}
              </h3>
              <Badge variant={badgeVariant} size="sm">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
              {exam.examType && (
                <Badge variant="pill" size="sm">
                  {exam.examType.toUpperCase()}
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-muted">{course}</p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">quiz</span>
                {exam.totalQuestions || exam.questions?.length || 0} questions
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                {duration} min
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">military_tech</span>
                {exam.totalMarks} marks
              </span>
              {exam.passingMarks && (
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Pass {exam.passingMarks}
                </span>
              )}
              {exam.difficulty && (
                <span
                  className={`flex items-center gap-1.5 ${difficultyTone[exam.difficulty] || ''}`}
                >
                  <span className="material-symbols-outlined text-[14px]">signal_cellular_alt</span>
                  {exam.difficulty.charAt(0).toUpperCase() + exam.difficulty.slice(1)}
                </span>
              )}
              {['active', 'completed'].includes(status) && (
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">people</span>
                  {exam.submissions || 0} submissions
                </span>
              )}
            </div>

            {(exam.startDateTime || exam.startDate) && (
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-soft">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                  Start{' '}
                  {exam.startDateTime
                    ? new Date(exam.startDateTime).toLocaleString()
                    : exam.startDate}
                </span>
                {(exam.endDateTime || exam.dueDate) && (
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">event</span>
                    End{' '}
                    {exam.endDateTime
                      ? new Date(exam.endDateTime).toLocaleString()
                      : exam.dueDate}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to={`/dashboard/exam/${exam.id}`}
            className="inline-flex h-10 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
          >
            <span className="material-symbols-outlined text-[16px]">
              {status === 'draft' ? 'edit' : 'visibility'}
            </span>
            {status === 'draft' ? 'Edit' : 'View'}
          </Link>
        </div>
      </div>
    </article>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between border-b border-hairline pb-6">
        <div className="space-y-2">
          <div className="h-3 w-20 animate-pulse rounded bg-hairline" />
          <div className="h-10 w-64 animate-pulse rounded bg-hairline" />
        </div>
        <div className="h-10 w-32 animate-pulse rounded-md bg-hairline" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-lg bg-hairline" />
        ))}
      </div>
      <div className="h-12 animate-pulse rounded-md bg-hairline" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-hairline" />
        ))}
      </div>
    </div>
  );
}
