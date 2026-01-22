'use client';

import { useState, useEffect } from 'react';
import { ExamCard, ExamCardSkeleton } from '../../components/dashboard';
import { availableExams } from '../../data/mockData';

export default function AvailableExams() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredExams = availableExams.filter((exam) => {
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || exam.status === filterStatus;
    const matchesDifficulty = filterDifficulty === 'all' || exam.difficulty === filterDifficulty;
    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Available Exams</h1>
          <p className="mt-1 text-sm text-slate-600">
            {filteredExams.length} exam{filteredExams.length !== 1 ? 's' : ''} available to take
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search exams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border-0 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm ring-1 ring-slate-200/80 placeholder:text-slate-400 focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border-0 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm ring-1 ring-slate-200/80 focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="scheduled">Scheduled</option>
        </select>

        {/* Difficulty Filter */}
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="rounded-lg border-0 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm ring-1 ring-slate-200/80 focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Exams Grid */}
      {filteredExams.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} role="student" />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200/80">
          <span className="material-symbols-outlined mx-auto text-6xl text-slate-300">
            search_off
          </span>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">No exams found</h3>
          <p className="mt-2 text-sm text-slate-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
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
      <div className="flex gap-3">
        <div className="h-11 flex-1 rounded-lg bg-slate-200 animate-pulse" />
        <div className="h-11 w-32 rounded-lg bg-slate-200 animate-pulse" />
        <div className="h-11 w-32 rounded-lg bg-slate-200 animate-pulse" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <ExamCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
