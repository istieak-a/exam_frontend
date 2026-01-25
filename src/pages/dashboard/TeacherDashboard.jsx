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
import { getTeacherExams, getAllSubmissions } from '../../services/examService';

// Activity Item Component
function ActivityItem({ activity }) {
  return (
    <div className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-slate-50">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 ${activity.color}`}>
        <span className="material-symbols-outlined text-lg">{activity.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900">{activity.title}</p>
        <p className="text-xs text-slate-500">{activity.time}</p>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [stats, setStats] = useState({
    totalExams: 0,
    activeExams: 0,
    pendingSubmissions: 0,
    averageScore: 0,
  });
  const [activity] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch exams and submissions in parallel
        const [examsData, submissionsData] = await Promise.all([
          getTeacherExams(),
          getAllSubmissions(),
        ]);
        
        const examsList = Array.isArray(examsData) ? examsData : examsData.content || [];
        setExams(examsList);
        
        // Calculate stats from exams
        const activeCount = examsList.filter(e => 
          (e.status || '').toLowerCase() === 'active'
        ).length;
        
        setStats(prev => ({
          ...prev,
          totalExams: examsList.length,
          activeExams: activeCount,
        }));
        
        const submissionsList = Array.isArray(submissionsData) ? submissionsData : submissionsData.content || [];
        const pendingCount = submissionsList.filter(s => 
          s.status === 'pending' || s.status === 'in-review'
        ).length;
        const gradedSubmissions = submissionsList.filter(s => s.totalScore !== undefined);
        const avgScore = gradedSubmissions.length > 0
          ? gradedSubmissions.reduce((sum, s) => sum + (s.percentage || 0), 0) / gradedSubmissions.length
          : 0;
        
        setStats(prev => ({
          ...prev,
          pendingSubmissions: pendingCount,
          averageScore: avgScore.toFixed(1),
        }));
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Welcome back, Professor! 👋</h1>
        <p className="mt-2 text-primary-foreground/90">
          You have {stats.pendingSubmissions} submissions pending review
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Exams"
          value={stats.totalExams}
          subtitle="All time"
          icon="assignment"
          variant="primary"
        />
        <StatCard
          title="Active Exams"
          value={stats.activeExams}
          subtitle="Currently ongoing"
          icon="play_circle"
          variant="success"
        />
        <StatCard
          title="Pending Submissions"
          value={stats.pendingSubmissions}
          subtitle="Awaiting review"
          icon="pending_actions"
          variant="warning"
        />
        <StatCard
          title="Average Score"
          value={`${stats.averageScore}%`}
          subtitle="Class performance"
          icon="trending_up"
          variant="info"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/dashboard/create-exam">
            <QuickActionCard
              title="Create New Exam"
              description="Start building a new exam"
              icon="add_circle"
              variant="primary"
            />
          </Link>
          <Link to="/dashboard/submissions">
            <QuickActionCard
              title="View Submissions"
              description="Review submissions"
              icon="fact_check"
              variant="success"
            />
          </Link>
          <Link to="/dashboard/chat">
            <QuickActionCard
              title="Messages"
              description="Chat with students"
              icon="chat"
              variant="warning"
            />
          </Link>
          <Link to="/dashboard/profile">
            <QuickActionCard
              title="My Profile"
              description="Update your information"
              icon="account_circle"
              variant="info"
            />
          </Link>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Exams - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Exams</h2>
            <Link
              to="/dashboard/exams"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {exams.slice(0, 3).map((exam) => (
              <ExamCard key={exam.id} exam={exam} role="teacher" />
            ))}
          </div>
        </div>

        {/* Recent Activity - Takes 1 column */}
        <div>
          <h2 className="mb-4 text-lg font-bold text-slate-900">Recent Activity</h2>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
            <div className="space-y-2">
              {activity.map((item, index) => (
                <ActivityItem key={index} activity={item} />
              ))}
            </div>
            <Link
              to="/dashboard/activity"
              className="mt-4 flex items-center justify-center gap-1 rounded-lg bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              View all activity
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
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
