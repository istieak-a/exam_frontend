'use client';

import { useState, useEffect } from 'react';
import { ExamCard, ExamCardSkeleton } from '../../components/dashboard';
import { getMySubmissions } from '../../services/examService';

export default function MyExams() {
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('completed'); // 'completed' or 'ongoing'

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        const data = await getMySubmissions();
        
        // Map submissions to exam card format
        const mappedSubmissions = (data || []).map(submission => ({
          id: submission.examId, // Use examId for navigation
          submissionId: submission.id, // Keep submission ID
          title: submission.examTitle,
          examType: submission.examType,
          type: submission.examType,
          totalMarks: submission.maxScore,
          totalQuestions: Object.keys(submission.answers || {}).length,
          duration: 0, // Not available in submission, could fetch from exam
          course: submission.examTitle, // Use title as fallback
          status: submission.status === 'FULLY_GRADED' ? 'graded' : 'pending',
          score: submission.totalScore,
          totalScore: submission.totalScore,
          maxScore: submission.maxScore,
          submittedAt: submission.submittedAt,
        }));
        
        setSubmissions(mappedSubmissions);
      } catch (err) {
        console.error('Failed to fetch submissions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  // Separate completed and ongoing submissions
  const completedExams = submissions.filter(s => 
    s.status === 'graded' || s.status === 'completed' || s.status === 'pending'
  );
  const ongoingExams = submissions.filter(s => 
    s.status === 'in-progress' || s.status === 'started'
  );

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Exams</h1>
        <p className="mt-1 text-sm text-slate-600">
          View your exam history and performance
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 rounded-lg bg-slate-100 p-1">
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
            activeTab === 'completed'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">task_alt</span>
            Completed ({completedExams.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab('ongoing')}
          className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
            activeTab === 'ongoing'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">pending</span>
            Ongoing ({ongoingExams.length})
          </span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'completed' ? (
        <div>
          {completedExams.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {completedExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} role="student" />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="task_alt"
              title="No completed exams"
              description="You haven't completed any exams yet"
            />
          )}
        </div>
      ) : (
        <div>
          {ongoingExams.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {ongoingExams.map((exam) => (
                <div key={exam.id} className="relative">
                  <ExamCard exam={exam} role="student" />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="pending"
              title="No ongoing exams"
              description="You don't have any exams in progress"
            />
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, title, description }) {
  return (
    <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200/80">
      <span className="material-symbols-outlined mx-auto text-6xl text-slate-300">
        {icon}
      </span>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 rounded bg-slate-200 animate-pulse" />
        <div className="mt-2 h-4 w-64 rounded bg-slate-200 animate-pulse" />
      </div>
      <div className="h-12 w-full rounded-lg bg-slate-200 animate-pulse" />
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <ExamCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
