'use client';

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  createExam, 
  updateExam, 
  getExamById, 
  parseExamResponse 
} from '../../services/examService';

export default function CreateExam() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [examType, setExamType] = useState('mcq'); // 'mcq' or 'cq'
  const [examData, setExamData] = useState({
    title: '',
    course: '',
    description: '',
    duration: '',
    totalMarks: '',
    passingMarks: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });
  const [questions, setQuestions] = useState([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const loadExamData = async () => {
      if (isEditMode) {
        try {
          const response = await getExamById(editId, { includeQuestions: true });
          const exam = parseExamResponse(response);
          
          if (exam) {
            setExamData({
              title: exam.title || '',
              course: exam.course || '',
              description: exam.description || '',
              duration: exam.duration?.toString() || '',
              totalMarks: exam.totalMarks?.toString() || '',
              passingMarks: exam.passingMarks?.toString() || '',
              startDate: exam.startDate || '',
              startTime: exam.startTime || '',
              endDate: exam.endDate || '',
              endTime: exam.endTime || '',
            });
            setQuestions(exam.questions || []);
            setExamType(exam.examType || 'mcq');
          }
        } catch (error) {
          console.error('Failed to load exam data:', error);
        }
      }
      setIsLoading(false);
    };
    
    loadExamData();
  }, [editId, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExamData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const addQuestion = (question) => {
    setQuestions([...questions, { ...question, id: Date.now() }]);
    setShowQuestionForm(false);
    // Clear questions error when adding a question
    if (errors.questions) {
      setErrors((prev) => ({ ...prev, questions: null }));
    }
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};
    
    console.log('🔍 Validating exam data:', examData);
    console.log('🔍 Questions array:', questions);
    
    if (!examData.title?.trim()) {
      newErrors.title = 'Title is required';
      console.log('❌ Title validation failed:', examData.title);
    }
    if (!examData.course?.trim()) {
      newErrors.course = 'Course is required';
      console.log('❌ Course validation failed:', examData.course);
    }
    if (!examData.duration || parseInt(examData.duration, 10) <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
      console.log('❌ Duration validation failed:', examData.duration);
    }
    if (!examData.totalMarks || parseInt(examData.totalMarks, 10) <= 0) {
      newErrors.totalMarks = 'Total marks must be greater than 0';
      console.log('❌ Total marks validation failed:', examData.totalMarks);
    }
    if (!examData.passingMarks || parseInt(examData.passingMarks, 10) <= 0) {
      newErrors.passingMarks = 'Passing marks must be greater than 0';
      console.log('❌ Passing marks validation failed:', examData.passingMarks);
    }
    if (parseInt(examData.passingMarks, 10) > parseInt(examData.totalMarks, 10)) {
      newErrors.passingMarks = 'Passing marks cannot exceed total marks';
      console.log('❌ Passing marks exceeds total marks:', examData.passingMarks, '>', examData.totalMarks);
    }
    if (!examData.startDate) {
      newErrors.startDate = 'Start date is required';
      console.log('❌ Start date validation failed:', examData.startDate);
    }
    if (!examData.startTime) {
      newErrors.startTime = 'Start time is required';
      console.log('❌ Start time validation failed:', examData.startTime);
    }
    if (!examData.endDate) {
      newErrors.endDate = 'End date is required';
      console.log('❌ End date validation failed:', examData.endDate);
    }
    if (!examData.endTime) {
      newErrors.endTime = 'End time is required';
      console.log('❌ End time validation failed:', examData.endTime);
    }
    
    // Validate date range
    if (examData.startDate && examData.endDate && examData.startTime && examData.endTime) {
      const startDateTime = new Date(`${examData.startDate}T${examData.startTime}`);
      const endDateTime = new Date(`${examData.endDate}T${examData.endTime}`);
      if (endDateTime <= startDateTime) {
        newErrors.endDate = 'End date/time must be after start date/time';
        console.log('❌ Date range validation failed:', startDateTime, '>=', endDateTime);
      }
    }
    
    // Validate questions
    if (questions.length === 0) {
      newErrors.questions = 'At least one question is required';
      console.log('❌ Questions validation failed: No questions added');
    }
    
    // Validate total marks equals sum of question marks
    const questionMarksSum = questions.reduce((sum, q) => sum + parseInt(q.marks || 0, 10), 0);
    if (questions.length > 0 && questionMarksSum !== parseInt(examData.totalMarks, 10)) {
      newErrors.totalMarks = `Total marks (${examData.totalMarks}) must equal sum of question marks (${questionMarksSum})`;
      console.log('❌ Marks mismatch validation failed:', examData.totalMarks, 'vs', questionMarksSum);
    }
    
    console.log('🔍 Validation errors found:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 Submit button clicked - starting exam creation process');
    setSubmitError(null);
    
    // Client-side validation
    console.log('📝 Validating form data...');
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }
    
    console.log('✅ Form validation passed, preparing to save exam');
    setIsSaving(true);
    
    try {
      const payload = {
        ...examData,
        examType,
        questions,
      };
      
      console.log('📤 Sending exam data to API:', payload);
      
      if (isEditMode) {
        console.log(`🔄 Updating exam with ID: ${editId}`);
        await updateExam(editId, payload);
        navigate(`/dashboard/exam/${editId}`);
      } else {
        console.log('🆕 Creating new exam');
        const result = await createExam(payload);
        console.log('✅ Exam created successfully:', result);
        navigate('/dashboard/exams');
      }
    } catch (error) {
      console.error('❌ Failed to save exam:', error);
      
      // Handle structured validation errors from backend
      if (error.status === 400 && error.validationErrors) {
        // Map backend field names to frontend field names if needed
        const backendErrors = error.validationErrors;
        const mappedErrors = {};
        
        Object.keys(backendErrors).forEach(key => {
          // Handle field name mapping (e.g., durationMinutes -> duration)
          const fieldMap = {
            durationMinutes: 'duration',
          };
          const frontendKey = fieldMap[key] || key;
          mappedErrors[frontendKey] = backendErrors[key];
        });
        
        setErrors(mappedErrors);
        setSubmitError('Please fix the validation errors below');
      } else if (error.status === 409) {
        // Conflict error - exam has submissions
        setSubmitError(error.message || 'Cannot update exam: Students have already submitted answers');
      } else if (error.status === 403) {
        setSubmitError('You do not have permission to perform this action');
      } else if (error.status === 404) {
        setSubmitError('Exam not found');
      } else {
        setSubmitError(error.message || 'Failed to save exam. Please try again.');
      }
    } finally {
      setIsSaving(false);
      console.log('🏁 Exam submission process completed');
    }
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {submitError && (
        <div className="rounded-lg border border-error/25 bg-error/10 p-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#8a3636]">error</span>
            <div>
              <h3 className="font-medium text-red-800">{submitError}</h3>
              {Object.keys(errors).length > 0 && (
                <ul className="mt-2 list-inside list-disc text-sm text-[#8a3636]">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              )}
            </div>
            <button
              onClick={() => setSubmitError(null)}
              className="ml-auto text-[#8a3636] hover:text-red-800"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[32px] leading-tight tracking-[-0.02em] text-ink">
            {isEditMode ? 'Edit Exam' : 'Create New Exam'}
          </h1>
          <p className="mt-1 text-sm text-body">
            {isEditMode 
              ? 'Update exam details and questions' 
              : 'Design and publish new exams for your students'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(isEditMode ? `/dashboard/exam/${editId}` : '/dashboard/exams')}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg border border-hairline px-4 py-2.5 font-medium text-body-strong transition-all hover:bg-surface-soft disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-xl">close</span>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-xl">
                  {isEditMode ? 'save' : 'check_circle'}
                </span>
                {isEditMode ? 'Update Exam' : 'Publish Exam'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Exam Type Selection */}
      <div className="rounded-lg bg-canvas p-6 shadow-sm border border-hairline">
        <h2 className="mb-4 text-lg font-semibold text-ink">Exam Type</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => setExamType('mcq')}
            className={`relative flex items-start gap-4 rounded-md border p-5 text-left transition-colors ${
              examType === 'mcq'
                ? 'border-primary bg-primary/5'
                : 'border-hairline bg-canvas hover:bg-surface-soft'
            }`}
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-md ${
                examType === 'mcq' ? 'bg-primary text-on-primary' : 'bg-surface-card text-ink'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">radio_button_checked</span>
            </div>
            <div className="flex-1">
              <h3 className="font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">MCQ exam</h3>
              <p className="mt-1 text-sm text-body">
                Multiple choice questions with auto-grading.
              </p>
            </div>
            {examType === 'mcq' && (
              <span className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-on-primary">
                <span className="material-symbols-outlined text-[14px]">check</span>
              </span>
            )}
          </button>

          <button
            onClick={() => setExamType('cq')}
            className={`relative flex items-start gap-4 rounded-md border p-5 text-left transition-colors ${
              examType === 'cq'
                ? 'border-primary bg-primary/5'
                : 'border-hairline bg-canvas hover:bg-surface-soft'
            }`}
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-md ${
                examType === 'cq' ? 'bg-primary text-on-primary' : 'bg-surface-card text-ink'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">edit_note</span>
            </div>
            <div className="flex-1">
              <h3 className="font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">Written exam</h3>
              <p className="mt-1 text-sm text-body">
                Open-response questions, graded by a human reader.
              </p>
            </div>
            {examType === 'cq' && (
              <span className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-on-primary">
                <span className="material-symbols-outlined text-[14px]">check</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Exam Details Form */}
      <div className="rounded-lg bg-canvas p-6 shadow-sm border border-hairline">
        <h2 className="mb-4 text-lg font-semibold text-ink">Exam Details</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-body-strong">
              Exam Title <span className="text-error">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={examData.title}
              onChange={handleInputChange}
              placeholder="e.g., Final Exam 2026"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none ${
                errors.title ? 'border-red-500 bg-error/10' : 'border-hairline'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-[#8a3636]">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-body-strong">
              Course <span className="text-error">*</span>
            </label>
            <input
              type="text"
              name="course"
              value={examData.course}
              onChange={handleInputChange}
              placeholder="e.g., Advanced Mathematics"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none ${
                errors.course ? 'border-red-500 bg-error/10' : 'border-hairline'
              }`}
            />
            {errors.course && (
              <p className="mt-1 text-sm text-[#8a3636]">{errors.course}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-body-strong">
              Description
            </label>
            <textarea
              name="description"
              value={examData.description}
              onChange={handleInputChange}
              placeholder="Brief description of the exam..."
              rows={3}
              className="w-full rounded-lg border border-hairline px-4 py-2.5 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-body-strong">
              Duration (minutes) <span className="text-error">*</span>
            </label>
            <input
              type="number"
              name="duration"
              value={examData.duration}
              onChange={handleInputChange}
              placeholder="60"
              min="1"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none ${
                errors.duration ? 'border-red-500 bg-error/10' : 'border-hairline'
              }`}
            />
            {errors.duration && (
              <p className="mt-1 text-sm text-[#8a3636]">{errors.duration}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-body-strong">
              Total Marks <span className="text-error">*</span>
            </label>
            <input
              type="number"
              name="totalMarks"
              value={examData.totalMarks}
              onChange={handleInputChange}
              placeholder="100"
              min="1"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none ${
                errors.totalMarks ? 'border-red-500 bg-error/10' : 'border-hairline'
              }`}
            />
            {errors.totalMarks && (
              <p className="mt-1 text-sm text-[#8a3636]">{errors.totalMarks}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-body-strong">
              Passing Marks <span className="text-error">*</span>
            </label>
            <input
              type="number"
              name="passingMarks"
              value={examData.passingMarks}
              onChange={handleInputChange}
              placeholder="40"
              min="0"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none ${
                errors.passingMarks ? 'border-red-500 bg-error/10' : 'border-hairline'
              }`}
            />
            {errors.passingMarks && (
              <p className="mt-1 text-sm text-[#8a3636]">{errors.passingMarks}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-body-strong">
              Start Date <span className="text-error">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={examData.startDate}
              onChange={handleInputChange}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none ${
                errors.startDate ? 'border-red-500 bg-error/10' : 'border-hairline'
              }`}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-[#8a3636]">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-body-strong">
              Start Time <span className="text-error">*</span>
            </label>
            <input
              type="time"
              name="startTime"
              value={examData.startTime}
              onChange={handleInputChange}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none ${
                errors.startTime ? 'border-red-500 bg-error/10' : 'border-hairline'
              }`}
            />
            {errors.startTime && (
              <p className="mt-1 text-sm text-[#8a3636]">{errors.startTime}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-body-strong">
              End Date <span className="text-error">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={examData.endDate}
              onChange={handleInputChange}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none ${
                errors.endDate ? 'border-red-500 bg-error/10' : 'border-hairline'
              }`}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-[#8a3636]">{errors.endDate}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-body-strong">
              End Time <span className="text-error">*</span>
            </label>
            <input
              type="time"
              name="endTime"
              value={examData.endTime}
              onChange={handleInputChange}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none ${
                errors.endTime ? 'border-red-500 bg-error/10' : 'border-hairline'
              }`}
            />
            {errors.endTime && (
              <p className="mt-1 text-sm text-[#8a3636]">{errors.endTime}</p>
            )}
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className={`rounded-lg bg-canvas p-6 shadow-sm border ${
        errors.questions ? 'border-red-500' : 'border-hairline'
      }`}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">Questions</h2>
            <p className="text-sm text-body">
              {questions.length} question{questions.length !== 1 ? 's' : ''} added
            </p>
            {errors.questions && (
              <p className="mt-1 text-sm text-[#8a3636]">{errors.questions}</p>
            )}
          </div>
          <button
            onClick={() => setShowQuestionForm(true)}
 
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Question
          </button>
        </div>

        {/* Questions List */}
        {questions.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-hairline bg-surface-soft py-12 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-hairline text-muted-soft">
              <span className="material-symbols-outlined text-3xl">quiz</span>
            </div>
            <p className="text-sm font-medium text-body">No questions added yet</p>
            <p className="mt-1 text-xs text-muted">Click "Add Question" to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((question, index) => (
              <QuestionItem
                key={question.id}
                question={question}
                index={index}
                examType={examType}
                onRemove={() => removeQuestion(question.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Question Form Modal */}
      {showQuestionForm && (
        <QuestionFormModal
          examType={examType}
          onClose={() => setShowQuestionForm(false)}
          onAdd={addQuestion}
        />
      )}
    </div>
  );
}

// Question Item Component
function QuestionItem({ question, index, examType, onRemove }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-hairline bg-surface-soft transition-all hover:border-blue-300">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 flex-1">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-on-primary"
 
          >
            {index + 1}
          </div>
          <div className="flex-1">
            <p className="font-medium text-ink">{question.text}</p>
            <div className="mt-1 flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">
                  {examType === 'mcq' ? 'radio_button_checked' : 'edit_note'}
                </span>
                {examType === 'mcq' ? 'MCQ' : 'Creative'}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">military_tech</span>
                {question.marks} marks
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-lg p-2 text-body transition-colors hover:bg-hairline"
          >
            <span className="material-symbols-outlined text-xl">
              {expanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          <button
            onClick={onRemove}
            className="rounded-lg p-2 text-[#8a3636] transition-colors hover:bg-error/10"
          >
            <span className="material-symbols-outlined text-xl">delete</span>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-hairline bg-canvas p-4">
          {examType === 'mcq' ? (
            <div className="space-y-2">
              {question.options.map((option, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-lg border p-3"
                  style={
                    idx === question.correctAnswer
                      ? {}
                      : { borderColor: '#e2e8f0' }
                  }
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-hairline text-xs font-medium">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm text-body-strong">{option}</span>
                  {idx === question.correctAnswer && (
                    <span className="ml-auto text-xs font-medium" >
                      Correct
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-hairline bg-surface-soft p-4">
              <p className="text-sm text-body">
                Students will provide written answers that require manual grading.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Question Form Modal
function QuestionFormModal({ examType, onClose, onAdd }) {
  const [questionData, setQuestionData] = useState({
    text: '',
    marks: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
  });

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    setQuestionData({ ...questionData, options: newOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (examType === 'mcq') {
      onAdd(questionData);
    } else {
      onAdd({ text: questionData.text, marks: questionData.marks });
    }
    setQuestionData({ text: '', marks: '', options: ['', '', '', ''], correctAnswer: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-canvas shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline p-6">
          <div>
            <h3 className="font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">
              Add {examType === 'mcq' ? 'MCQ' : 'Creative'} Question
            </h3>
            <p className="text-sm text-body">Fill in the question details below</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-soft transition-colors hover:bg-surface-card hover:text-body"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-body-strong">
                Question Text <span className="text-error">*</span>
              </label>
              <textarea
                value={questionData.text}
                onChange={(e) => setQuestionData({ ...questionData, text: e.target.value })}
                placeholder="Enter your question here..."
                rows={3}
                required
                className="w-full rounded-lg border border-hairline px-4 py-2.5 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-body-strong">
                Marks <span className="text-error">*</span>
              </label>
              <input
                type="number"
                value={questionData.marks}
                onChange={(e) => setQuestionData({ ...questionData, marks: e.target.value })}
                placeholder="5"
                required
                className="w-full rounded-lg border border-hairline px-4 py-2.5 text-sm focus:outline-none"
              />
            </div>

            {examType === 'mcq' && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-body-strong">
                    Options <span className="text-error">*</span>
                  </label>
                  <div className="space-y-2">
                    {questionData.options.map((option, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-card text-xs font-medium text-body">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(idx, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                          required
                          className="flex-1 rounded-lg border border-hairline px-4 py-2.5 text-sm focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-body-strong">
                    Correct Answer <span className="text-error">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {questionData.options.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setQuestionData({ ...questionData, correctAnswer: idx })}
                        className={`rounded-md border py-2 text-sm font-medium transition-colors ${
                          questionData.correctAnswer === idx
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-hairline bg-canvas text-body hover:bg-surface-soft'
                        }`}
                      >
                        Option {String.fromCharCode(65 + idx)}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-hairline px-4 py-2.5 text-sm font-medium text-body-strong transition-colors hover:bg-surface-soft"
            >
              Cancel
            </button>
            <button
              type="submit"
 
              className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
            >
              Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Loading Skeleton
function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 animate-pulse rounded-lg bg-hairline"></div>
          <div className="mt-2 h-4 w-96 animate-pulse rounded bg-hairline"></div>
        </div>
        <div className="h-10 w-32 animate-pulse rounded-lg bg-hairline"></div>
      </div>

      {/* Type Selection Skeleton */}
      <div className="rounded-lg bg-canvas p-6 shadow-sm">
        <div className="mb-4 h-6 w-32 animate-pulse rounded bg-hairline"></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-32 animate-pulse rounded-xl bg-hairline"></div>
          <div className="h-32 animate-pulse rounded-xl bg-hairline"></div>
        </div>
      </div>

      {/* Form Skeleton */}
      <div className="rounded-lg bg-canvas p-6 shadow-sm">
        <div className="mb-4 h-6 w-32 animate-pulse rounded bg-hairline"></div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-hairline"></div>
          ))}
        </div>
      </div>

      {/* Questions Skeleton */}
      <div className="rounded-lg bg-canvas p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-6 w-32 animate-pulse rounded bg-hairline"></div>
          <div className="h-10 w-32 animate-pulse rounded-lg bg-hairline"></div>
        </div>
        <div className="h-48 animate-pulse rounded-lg bg-hairline"></div>
      </div>
    </div>
  );
}
