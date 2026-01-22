'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  StatCard,
  StatCardSkeleton,
  QuickActionCard,
  QuickActionCardSkeleton,
  ExamCard,
  ExamCardSkeleton,
} from '../../components/dashboard';
import { studentStats, availableExams, upcomingExams } from '../../data/mockData';

// Upcoming Exam Item Component
function UpcomingExamItem({ exam }) {
  return (
    <div className="group flex items-center justify-between rounded-lg p-4 transition-colors hover:bg-slate-50">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <span className="material-symbols-outlined text-xl">quiz</span>
        </div>
        <div>
          <h4 className="font-semibold text-slate-900">{exam.title}</h4>
          <p className="text-sm text-slate-600">{exam.course}</p>
          <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">calendar_today</span>
              {exam.date}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span>
              {exam.time}
            </span>
          </div>
        </div>
      </div>
      <Link
        to={`/dashboard/take-exam/${exam.id}`}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-primary/90"
      >
        Start
      </Link>
    </div>
  );
}

export default function StudentDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Welcome back, Student! 👋</h1>
        <p className="mt-2 text-white/90">
          You have {studentStats.availableExams} exams available to take
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Available Exams"
          value={studentStats.availableExams}
          subtitle="Ready to take"
          icon="quiz"
          variant="primary"
        />
        <StatCard
          title="Completed Exams"
          value={studentStats.completedExams}
          subtitle="All time"
          icon="task_alt"
          variant="success"
        />
        <StatCard
          title="Average Score"
          value={`${studentStats.averageScore}%`}
          subtitle="Your performance"
          icon="trending_up"
          variant="info"
          trend={{ direction: 'up', value: '+3.2%' }}
        />
        <StatCard
          title="Pending Results"
          value={studentStats.pendingResults}
          subtitle="Being graded"
          icon="pending"
          variant="warning"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/dashboard/available-exams">
            <QuickActionCard
              title="Take an Exam"
              description="Start your next exam"
              icon="play_circle"
              variant="primary"
            />
          </Link>
          <Link to="/dashboard/my-exams">
            <QuickActionCard
              title="My Exams"
              description="View exam history"
              icon="assignment_turned_in"
              variant="info"
            />
          </Link>
          <Link to="/dashboard/chat">
            <QuickActionCard
              title="Ask Questions"
              description="Chat with teachers"
              icon="chat"
              variant="warning"
            />
          </Link>
          <Link to="/dashboard/profile">
            <QuickActionCard
              title="My Profile"
              description="Update your information"
              icon="account_circle"
              variant="success"
            />
          </Link>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Available Exams - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Available Exams</h2>
            <Link
              to="/dashboard/available-exams"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {availableExams.slice(0, 3).map((exam) => (
              <ExamCard key={exam.id} exam={exam} role="student" />
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Exams */}
          <div>
            <h2 className="mb-4 text-lg font-bold text-slate-900">Upcoming Exams</h2>
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
              <div className="space-y-2">
                {upcomingExams.slice(0, 3).map((exam) => (
                  <UpcomingExamItem key={exam.id} exam={exam} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard Skeleton
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Welcome Header Skeleton */}
      <div className="h-28 rounded-2xl bg-slate-200 animate-pulse" />

      {/* Stats Grid Skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div>
        <div className="mb-4 h-6 w-32 rounded bg-slate-200 animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <QuickActionCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Two Column Layout Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 w-32 rounded bg-slate-200 animate-pulse" />
          {[...Array(3)].map((_, i) => (
            <ExamCardSkeleton key={i} />
          ))}
        </div>
        <div>
          <div className="mb-4 h-6 w-32 rounded bg-slate-200 animate-pulse" />
          <div className="h-96 rounded-2xl bg-slate-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
