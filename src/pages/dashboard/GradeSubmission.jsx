'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubmissionById, gradeSubmission, getExamById } from '../../services/examService';

export default function GradeSubmission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  
  // Initialize grades state for CQ exams only
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch submission
        const data = await getSubmissionById(id);
        setSubmission(data);
        
        // Fetch the exam to get questions
        if (data.examId) {
          const examData = await getExamById(data.examId, { includeQuestions: true });
          setExam(examData);
          
          const examQuestionList = examData.questions || [];
          setQuestions(examQuestionList);
          
          // Initialize grades for CQ exams
          if (data.examType?.toLowerCase() !== 'mcq') {
            setGrades(examQuestionList.map((q, index) => ({
              questionId: q.id,
              questionNumber: index + 1,
              marks: data.questionGrades?.[q.id] || 0,
              maxMarks: q.marks,
            })));
          }
        }
      } catch (err) {
        console.error('Failed to fetch submission:', err);
        setError('Submission not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmission();
  }, [id]);

  // Determine exam type from submission
  const examType = submission?.examType?.toLowerCase() || 'cq';
  const isAutoGraded = examType === 'mcq';

  // Helper function to format timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to calculate time taken (if available)
  const getTimeTaken = () => {
    // This would need to be calculated based on exam start and submission time
    // For now, return a placeholder
    return 'N/A';
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (error || !submission) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-card">
            <span className="material-symbols-outlined text-3xl text-muted-soft">fact_check</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-ink">Submission not found</h3>
          <p className="mb-4 text-sm text-body">{error || "The submission you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate('/dashboard/submissions')}
 
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Submissions
          </button>
        </div>
      </div>
    );
  }

  // If exam is auto-graded (MCQ only), redirect to view mode
  if (isAutoGraded) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <span className="material-symbols-outlined text-3xl text-[#2f6e3d]">check_circle</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-ink">MCQ Exam - Auto-Graded</h3>
          <p className="mb-4 text-sm text-body">
            This is an MCQ exam and has been automatically graded. No manual grading required.
          </p>
          <button
            onClick={() => navigate('/dashboard/submissions')}
 
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Submissions
          </button>
        </div>
      </div>
    );
  }

  const handleGradeChange = (questionId, value) => {
    setGrades(grades.map(g => 
      g.questionId === questionId 
        ? { ...g, marks: Math.min(Math.max(0, parseFloat(value) || 0), g.maxMarks) }
        : g
    ));
  };

  const calculateTotalMarks = () => {
    if (isAutoGraded) {
      return submission.mcqScore || 0;
    }
    return grades.reduce((sum, g) => sum + g.marks, 0);
  };

  const calculateMaxMarks = () => {
    return submission?.maxScore || questions.reduce((sum, q) => sum + q.marks, 0);
  };

  const calculatePercentage = () => {
    const total = calculateTotalMarks();
    const max = calculateMaxMarks();
    return max > 0 ? ((total / max) * 100).toFixed(2) : 0;
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      // Format grades for API submission - convert array to map of questionId -> marks
      const questionGradesMap = {};
      grades.forEach(g => {
        questionGradesMap[g.questionId] = Math.round(g.marks); // Ensure integer marks
      });
      
      const gradeData = {
        questionGrades: questionGradesMap,
      };
      
      await gradeSubmission(id, gradeData);
      navigate('/dashboard/submissions');
    } catch (err) {
      console.error('Failed to save grades:', err);
      
      if (err.status === 403) {
        setSaveError('You do not have permission to grade this submission.');
      } else if (err.status === 400) {
        setSaveError(err.message || 'Invalid grade data. Please check your input.');
      } else {
        setSaveError(err.message || 'Failed to save grades. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/submissions')}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-hairline text-body transition-colors hover:bg-surface-soft"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <div>
              <h1 className="font-display text-[32px] leading-tight tracking-[-0.02em] text-ink">Grade Submission</h1>
              <p className="mt-1 text-sm text-body">
                Review and grade student's exam submission
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/dashboard/submissions')}
            className="flex items-center gap-2 rounded-lg border border-hairline px-4 py-2.5 font-medium text-body-strong transition-all hover:bg-surface-soft"
          >
            <span className="material-symbols-outlined text-xl">close</span>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
 
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-xl">
              {isSaving ? 'hourglass_empty' : 'check_circle'}
            </span>
            {isSaving ? 'Saving...' : 'Save Grades'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {saveError && (
        <div className="rounded-lg bg-error/10 border-2 border-error/25 p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-[#8a3636]">error</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Error Saving Grades</p>
            <p className="text-sm text-[#8a3636] mt-1">{saveError}</p>
          </div>
          <button
            onClick={() => setSaveError(null)}
            className="text-error hover:text-[#8a3636]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {/* Student & Exam Info */}
      <div className="rounded-lg bg-canvas p-6 shadow-sm border border-hairline">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 font-display text-[24px] leading-none text-primary">
              {submission.studentName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'S'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-ink">{submission.studentName}</h2>
              <p className="text-sm text-body">ID: {submission.studentId}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-muted-soft">assignment</span>
                <span className="font-medium text-body-strong">{submission.examTitle}</span>
              </div>
            </div>
          </div>
          
          <span
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
              submission.status === 'FULLY_GRADED'
                ? 'text-[#2f6e3d] bg-success/10 border-success/25'
                : 'text-[#7a5a0e] bg-warning/10 border-warning/30'
            }`}
          >
            {submission.status === 'FULLY_GRADED' ? 'Graded' : 'Pending Review'}
          </span>
        </div>
        
        <div className="mt-4 grid gap-4 sm:grid-cols-3 border-t border-hairline pt-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-muted-soft">schedule</span>
            <div>
              <p className="text-xs text-muted">Submitted At</p>
              <p className="text-sm font-medium text-ink">{formatDate(submission.submittedAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-muted-soft">quiz</span>
            <div>
              <p className="text-xs text-muted">Questions</p>
              <p className="text-sm font-medium text-ink">{questions.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-muted-soft">star</span>
            <div>
              <p className="text-xs text-muted">Max Score</p>
              <p className="text-sm font-medium text-ink">{submission.maxScore}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Score Summary */}
      <div className="rounded-lg bg-surface-card p-6 border border-hairline">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-[22px] leading-tight tracking-[-0.015em] text-ink">Total score</h3>
            <p className="text-sm text-muted">Current grading progress</p>
          </div>
          <div className="text-right">
            <p className="font-display text-[40px] leading-none text-ink">
              {calculateTotalMarks()}/{calculateMaxMarks()}
            </p>
            <p className="mt-1 text-sm font-medium text-primary">
              {calculatePercentage()}%
            </p>
          </div>
        </div>
      </div>

      {/* Questions Grading */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">Questions & Answers</h3>
          <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
            {questions.length} Question{questions.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {questions.length === 0 ? (
          <div className="rounded-lg bg-surface-soft p-8 text-center border border-hairline">
            <span className="material-symbols-outlined text-4xl text-muted-soft mb-2">quiz</span>
            <p className="text-body">No questions found for this exam</p>
          </div>
        ) : (
          questions.map((question, index) => {
            const gradeIndex = grades.findIndex(g => g.questionId === question.id);
            const studentAnswer = submission.answers?.[question.id] || '';
            
            return (
              <div key={question.id} className="rounded-lg bg-canvas p-6 shadow-sm border-2 border-hairline hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-primary text-sm font-medium text-on-primary"
 
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="mb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-base font-medium text-ink mb-2">{question.questionText || question.question}</p>
                          <div className="flex items-center gap-3 text-xs text-muted">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">edit_note</span>
                              {question.type === 'MCQ' ? 'Multiple Choice' : 'Creative Question'}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">military_tech</span>
                              {question.marks} mark{question.marks !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Student's Answer */}
                    <div className="mb-4 rounded-lg bg-surface-soft p-4 border border-hairline">
                      <p className="mb-2 text-xs font-semibold text-body-strong uppercase tracking-wide">Student's Answer:</p>
                      {studentAnswer ? (
                        <p className="text-sm text-ink whitespace-pre-wrap leading-relaxed">
                          {studentAnswer}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-soft italic">No answer provided</p>
                      )}
                    </div>

                  {/* Marks Input */}
                    <div className="flex items-center gap-4 bg-primary/10 p-4 rounded-lg border border-primary/20">
                      <div className="flex-1 max-w-xs">
                        <label className="mb-2 block text-sm font-semibold text-ink">
                          Marks Awarded <span className="text-error">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max={question.marks}
                            step="0.5"
                            value={gradeIndex >= 0 ? grades[gradeIndex].marks : 0}
                            onChange={(e) => handleGradeChange(question.id, e.target.value)}
                            className="w-full rounded-lg border-2 border-blue-300 px-4 py-3 text-base font-semibold text-ink focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-body">
                            / {question.marks}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <span className="material-symbols-outlined text-lg">info</span>
                        <span>Enter marks between 0 and {question.marks}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => navigate('/dashboard/submissions')}
          className="rounded-lg border border-hairline px-6 py-2.5 font-medium text-body-strong transition-all hover:bg-surface-soft"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
 
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active disabled:opacity-60"
        >
          {isSaving ? 'Saving...' : 'Save Grades'}
        </button>
      </div>
    </div>
  );
}

// Loading Skeleton
function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-hairline"></div>
          <div>
            <div className="h-8 w-96 animate-pulse rounded-lg bg-hairline"></div>
            <div className="mt-2 h-4 w-80 animate-pulse rounded bg-hairline"></div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 animate-pulse rounded-lg bg-hairline"></div>
          <div className="h-10 w-32 animate-pulse rounded-lg bg-hairline"></div>
        </div>
      </div>

      {/* Info Skeleton */}
      <div className="h-48 animate-pulse rounded-lg bg-hairline"></div>

      {/* Score Skeleton */}
      <div className="h-32 animate-pulse rounded-lg bg-hairline"></div>

      {/* Questions Skeleton */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-lg bg-hairline"></div>
        ))}
      </div>
    </div>
  );
}
