'use client';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ExamCard,
  ExamCardSkeleton,
  QuickActionCard,
  QuickActionCardSkeleton,
  StatCard,
  StatCardSkeleton,
} from '../../components/dashboard';
import { useAuth } from '../../context/AuthContext';
import { getAvailableExams, getMySubmissions } from '../../services/examService';

function UpcomingExamItem({ exam }) {
  const formatDate = (exam) => {
    if (exam.startDateTime) {
      return new Date(exam.startDateTime).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
    return exam.date || 'TBD';
  };

  const formatTime = (exam) => {
    if (exam.startDateTime) {
      return new Date(exam.startDateTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return exam.time || 'TBD';
  };

  return (
    <div className="group flex items-center justify-between gap-3 rounded-md px-3 py-3 transition-colors hover:bg-surface-soft">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <span className="material-symbols-outlined text-[20px]">quiz</span>
        </div>
        <div className="min-w-0">
          <h4 className="truncate text-sm font-medium text-ink">{exam.title}</h4>
          <p className="truncate text-xs text-muted">{exam.course || exam.subject}</p>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-soft">
            <span className="flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">calendar_today</span>
              {formatDate(exam)}
            </span>
            <span className="flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">schedule</span>
              {formatTime(exam)}
            </span>
          </div>
        </div>
      </div>
      <Link
        to={`/dashboard/take-exam/${exam.id}`}
        className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-xs font-medium text-on-primary transition-colors hover:bg-primary-active"
      >
        Start
      </Link>
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [availableExams, setAvailableExams] = useState([]);
  const [stats, setStats] = useState({
    availableExams: 0,
    completedExams: 0,
    averageScore: 0,
    pendingResults: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [examsData, submissionsData] = await Promise.all([
          getAvailableExams(),
          getMySubmissions(),
        ]);

        const examsArray = Array.isArray(examsData) ? examsData : examsData?.content || [];
        setAvailableExams(examsArray);

        const submissionsArray = Array.isArray(submissionsData) ? submissionsData : [];

        const completedCount = submissionsArray.filter(
          (s) => s.status === 'graded' || s.status === 'completed',
        ).length;
        const pendingCount = submissionsArray.filter(
          (s) => s.status === 'pending' || s.status === 'in-review',
        ).length;
        const gradedSubmissions = submissionsArray.filter((s) => s.totalScore !== undefined);
        const avgScore =
          gradedSubmissions.length > 0
            ? gradedSubmissions.reduce((sum, s) => sum + (s.percentage || 0), 0) /
              gradedSubmissions.length
            : 0;

        setStats({
          availableExams: examsArray.length,
          completedExams: completedCount,
          averageScore: avgScore.toFixed(1),
          pendingResults: pendingCount,
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const examsArray = Array.isArray(availableExams) ? availableExams : [];
  const upcomingExams = examsArray
    .filter((exam) => {
      const status = (exam.status || '').toLowerCase();
      return status === 'published' || (status === 'active' && exam.startDateTime > Date.now());
    })
    .slice(0, 3);

  if (isLoading) return <DashboardSkeleton />;

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-10">
      <header className="border-b border-hairline pb-8">
        <p className="text-xs uppercase tracking-[0.15em] text-muted">Student workspace</p>
        <h1 className="mt-3 font-display text-[40px] leading-tight tracking-[-0.02em] text-ink md:text-[48px]">
          Good day, {firstName}.
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-body">
          {stats.availableExams > 0
            ? `${stats.availableExams} ${stats.availableExams === 1 ? 'exam is' : 'exams are'} waiting for you. Take them when you're ready — the page won't rush.`
            : 'No exams waiting today. Come back when your professor publishes one.'}
        </p>
      </header>

      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Available"
            value={stats.availableExams}
            subtitle="Ready to take"
            icon="quiz"
            variant="primary"
          />
          <StatCard
            title="Completed"
            value={stats.completedExams}
            subtitle="All-time"
            icon="task_alt"
            variant="success"
          />
          <StatCard
            title="Average"
            value={`${stats.averageScore}%`}
            subtitle="Across graded"
            icon="trending_up"
            variant="info"
          />
          <StatCard
            title="In review"
            value={stats.pendingResults}
            subtitle="Awaiting grading"
            icon="pending"
            variant="warning"
          />
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="font-display text-[24px] leading-tight tracking-[-0.015em] text-ink">
            Quick actions
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/dashboard/available-exams" className="contents">
            <QuickActionCard
              title="Take an exam"
              description="Start your next one"
              icon="play_circle"
              tone="cream"
              variant="primary"
            />
          </Link>
          <Link to="/dashboard/my-exams" className="contents">
            <QuickActionCard
              title="My exams"
              description="Past attempts & grades"
              icon="assignment_turned_in"
              tone="cream"
              variant="info"
            />
          </Link>
          <Link to="/dashboard/chat" className="contents">
            <QuickActionCard
              title="Ask a teacher"
              description="Open a thread"
              icon="chat"
              tone="dark"
            />
          </Link>
          <Link to="/dashboard/profile" className="contents">
            <QuickActionCard
              title="Profile"
              description="Account & preferences"
              icon="account_circle"
              tone="cream"
              variant="success"
            />
          </Link>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="font-display text-[24px] leading-tight tracking-[-0.015em] text-ink">
              Available exams
            </h2>
            <Link to="/dashboard/available-exams" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {availableExams.length > 0 ? (
              availableExams.slice(0, 3).map((exam) => (
                <ExamCard key={exam.id} exam={exam} role="student" />
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-hairline bg-surface-soft p-10 text-center text-sm text-muted">
                Nothing's been published for you yet.
              </div>
            )}
          </div>
        </div>

        <aside>
          <h2 className="mb-5 font-display text-[24px] leading-tight tracking-[-0.015em] text-ink">
            Upcoming
          </h2>
          <div className="rounded-lg border border-hairline bg-canvas p-2">
            {upcomingExams.length > 0 ? (
              <div className="space-y-1">
                {upcomingExams.map((exam) => (
                  <UpcomingExamItem key={exam.id} exam={exam} />
                ))}
              </div>
            ) : (
              <p className="px-4 py-8 text-center text-sm text-muted">No upcoming exams scheduled.</p>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-10">
      <div className="space-y-3 border-b border-hairline pb-8">
        <div className="h-3 w-24 animate-pulse rounded bg-hairline" />
        <div className="h-12 w-72 animate-pulse rounded bg-hairline" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-hairline" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <QuickActionCardSkeleton key={i} />
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="h-6 w-40 animate-pulse rounded bg-hairline" />
          {[...Array(3)].map((_, i) => (
            <ExamCardSkeleton key={i} />
          ))}
        </div>
        <div>
          <div className="mb-4 h-6 w-32 animate-pulse rounded bg-hairline" />
          <div className="h-72 animate-pulse rounded-lg bg-hairline" />
        </div>
      </div>
    </div>
  );
}
