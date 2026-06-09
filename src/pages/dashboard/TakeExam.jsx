'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examApi } from '../../services/api';

const MAX_VIOLATIONS = 3;
const MAX_CAMERA_VIOLATIONS = 2;

const defaultInstructions = [
  'Read all questions carefully before answering',
  'Each question carries the marks shown',
  'Once submitted, you cannot change your answers',
  'Results will be available based on your teacher\'s review process',
  'You can navigate between questions using the question palette',
];

const integrityRules = [
  'Do not switch browser tabs or open new tabs during the exam',
  'Do not minimize the browser or switch to other applications',
  'Stay in fullscreen mode for the entire exam duration',
  'Right-click and developer tool shortcuts are disabled',
  'You will receive 2 warnings — a 3rd violation auto-submits your exam',
  'Camera must remain active — your face must be visible throughout the exam',
  '1 camera warning — a 2nd camera violation auto-submits your exam',
  'All violations are recorded and visible to your teacher',
];

function ViolationTypeLabel({ type }) {
  const map = {
    tab: { icon: 'tab_unselected', label: 'Tab / Window Switch' },
    fullscreen: { icon: 'fullscreen_exit', label: 'Fullscreen Exited' },
    focus: { icon: 'visibility_off', label: 'Focus Lost' },
  };
  const { icon, label } = map[type] || map.tab;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="material-symbols-outlined text-sm">{icon}</span>
      {label}
    </span>
  );
}

export default function TakeExam() {
  const { id: examId } = useParams();
  const navigate = useNavigate();

  // ── Exam data ──────────────────────────────────────────────────────────────
  const [exam, setExam] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(60 * 60);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── Anti-cheat state ───────────────────────────────────────────────────────
  const [totalViolations, setTotalViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violationModal, setViolationModal] = useState(null);
  // { type: 'tab'|'fullscreen'|'focus', count: N, isTerminated: bool }

  // ── Camera / Proctoring state ──────────────────────────────────────────────
  const [cameraPermission, setCameraPermission] = useState('pending');
  // 'pending' | 'granted' | 'denied'
  const [faceApiReady, setFaceApiReady] = useState(false);
  const [cameraViolations, setCameraViolations] = useState(0);
  const [cameraViolationModal, setCameraViolationModal] = useState(null);
  // { reason: 'no_face'|'multiple_faces', count: N, isTerminated: bool }

  // ── Anti-cheat refs (stable across renders — safe in event handlers) ───────
  const examActiveRef = useRef(false);
  const violationCountRef = useRef(0);
  const tabSwitchCountRef = useRef(0);
  const focusLossCountRef = useRef(0);
  const isTerminatedRef = useRef(false);
  const submittingRef = useRef(false);
  const answersRef = useRef({});

  // ── Camera refs ────────────────────────────────────────────────────────────
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const detectionIntervalRef = useRef(null);
  const cameraViolationCountRef = useRef(0);
  const cameraTerminatedRef = useRef(false);

  // Keep answersRef in sync so event handler callbacks always see latest answers
  useEffect(() => { answersRef.current = answers; }, [answers]);

  // Assign camera stream to video element once it mounts (exam screen renders it)
  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraPermission, showInstructions]);

  // ── Camera permission + face-api model load ────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        const faceapi = await import('face-api.js');
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        if (!cancelled) { setFaceApiReady(true); setCameraPermission('granted'); }
      } catch {
        if (!cancelled) setCameraPermission('denied');
      }
    }
    initCamera();
    return () => { cancelled = true; };
  }, []);

  // ── Load exam ──────────────────────────────────────────────────────────────
  useEffect(() => {
    examApi.getExam(examId)
      .then((e) => {
        setExam(e);
        setTimeRemaining((e.durationMinutes || 60) * 60);
      })
      .catch((err) => setLoadError(err.message || 'Failed to load exam.'));
  }, [examId]);

  // ── Core submit (used by timer, violations, and manual submit) ─────────────
  const doSubmitWithIntegrity = useCallback(async (terminated = false) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    examActiveRef.current = false;
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
    try {
      const payload = {};
      Object.entries(answersRef.current).forEach(([qId, ans]) => {
        payload[String(qId)] = String(ans);
      });
      const submission = await examApi.submitExam(examId, payload, {
        tabSwitches: tabSwitchCountRef.current,
        focusLosses: focusLossCountRef.current,
        terminated,
        cameraViolations: cameraViolationCountRef.current,
        cameraTerminated: cameraTerminatedRef.current,
      });

      // Upload proctoring recording (fire-and-forget — never block navigation)
      try {
        // Always stop the recorder first so it flushes the final buffered chunk
        // via ondataavailable BEFORE we create the blob. Gating on chunk count
        // before stop() is the bug: exams submitted in <5s have 0 chunks yet.
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          await new Promise(resolve => {
            mediaRecorderRef.current.addEventListener('stop', resolve, { once: true });
            mediaRecorderRef.current.stop();
          });
        }
        if (recordedChunksRef.current.length > 0) {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          examApi.uploadProctoringVideo(submission.id, blob).catch(() => {});
        }
      } catch { /* never block navigation on upload failure */ }
      streamRef.current?.getTracks().forEach(t => t.stop());

      navigate(`/dashboard/exam-result/${submission.id}`);
    } catch (err) {
      submittingRef.current = false;
      setSubmitting(false);
      alert(err.message || 'Failed to submit exam. Please try again.');
    }
  }, [examId, navigate]);

  // Ref so timer + violation handlers always call the latest version
  const doSubmitRef = useRef(doSubmitWithIntegrity);
  useEffect(() => { doSubmitRef.current = doSubmitWithIntegrity; }, [doSubmitWithIntegrity]);

  // ── Countdown timer ────────────────────────────────────────────────────────
  useEffect(() => {
    if (showInstructions || !exam) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          doSubmitRef.current(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showInstructions, exam]);

  // ── Camera violation handlers ──────────────────────────────────────────────
  const stopFaceDetection = useCallback(() => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  }, []);

  const handleCameraViolation = useCallback((reason) => {
    if (!examActiveRef.current || cameraTerminatedRef.current || isTerminatedRef.current) return;
    cameraViolationCountRef.current += 1;
    const count = cameraViolationCountRef.current;
    setCameraViolations(count);
    if (count >= MAX_CAMERA_VIOLATIONS) {
      cameraTerminatedRef.current = true;
      isTerminatedRef.current = true;
      setCameraViolationModal({ reason, count, isTerminated: true });
      stopFaceDetection();
      setTimeout(() => doSubmitRef.current(true), 4000);
    } else {
      setCameraViolationModal({ reason, count, isTerminated: false });
    }
  }, [stopFaceDetection]);

  const startFaceDetection = useCallback(async () => {
    if (!faceApiReady || !videoRef.current) return;
    const faceapi = await import('face-api.js');
    detectionIntervalRef.current = setInterval(async () => {
      if (!examActiveRef.current || cameraTerminatedRef.current) return;
      if (!videoRef.current || videoRef.current.readyState < 2) return;
      try {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.5 })
        );
        if (detections.length === 0) handleCameraViolation('no_face');
        else if (detections.length > 1) handleCameraViolation('multiple_faces');
      } catch { /* silently ignore inference errors */ }
    }, 3000);
  }, [faceApiReady, handleCameraViolation]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Violation handler ──────────────────────────────────────────────────────
  const handleViolation = useCallback((type) => {
    if (!examActiveRef.current || isTerminatedRef.current) return;

    violationCountRef.current += 1;
    const count = violationCountRef.current;

    if (type === 'tab') {
      tabSwitchCountRef.current += 1;
    } else {
      focusLossCountRef.current += 1;
    }

    setTotalViolations(count);

    if (count >= MAX_VIOLATIONS) {
      isTerminatedRef.current = true;
      setViolationModal({ type, count, isTerminated: true });
      setTimeout(() => doSubmitRef.current(true), 4000);
    } else {
      setViolationModal({ type, count, isTerminated: false });
    }
  }, []);

  // ── Anti-cheat event listeners (active only during exam) ──────────────────
  useEffect(() => {
    if (showInstructions || !exam) return;

    examActiveRef.current = true;

    // Request fullscreen; if denied, just continue without it
    document.documentElement.requestFullscreen?.()
      .then(() => setIsFullscreen(true))
      .catch(() => setIsFullscreen(false));

    // Start MediaRecorder for proctoring video
    if (streamRef.current && window.MediaRecorder) {
      recordedChunksRef.current = [];
      const options = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? { mimeType: 'video/webm;codecs=vp9' }
        : { mimeType: 'video/webm' };
      const recorder = new MediaRecorder(streamRef.current, options);
      recorder.ondataavailable = (e) => {
        if (e.data?.size > 0) recordedChunksRef.current.push(e.data);
      };
      recorder.start(5000);
      mediaRecorderRef.current = recorder;
    }

    // Start face detection polling
    startFaceDetection();

    const onVisibilityChange = () => {
      if (document.hidden) handleViolation('tab');
    };

    const onFullscreenChange = () => {
      const inFs = !!document.fullscreenElement;
      setIsFullscreen(inFs);
      // Only flag exit — not the initial denied state
      if (!inFs && examActiveRef.current && !isTerminatedRef.current) {
        handleViolation('fullscreen');
      }
    };

    const onContextMenu = (e) => e.preventDefault();

    const onKeyDown = (e) => {
      if (e.key === 'F12') { e.preventDefault(); return; }
      // Devtools: Ctrl/Cmd+Shift+I/J/C
      if ((e.ctrlKey || e.metaKey) && e.shiftKey &&
          ['i', 'j', 'c'].includes(e.key.toLowerCase())) {
        e.preventDefault(); return;
      }
      // View source
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      examActiveRef.current = false;
      stopFaceDetection();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('keydown', onKeyDown);
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    };
  }, [showInstructions, exam, handleViolation, startFaceDetection, stopFaceDetection]);

  // ── Question helpers ───────────────────────────────────────────────────────
  const formattedQuestions = (exam?.questions || []).map((q) => ({
    id: q.id,
    question: q.questionText,
    marks: q.marks,
    type: (q.type || exam?.examType || 'MCQ').toLowerCase() === 'mcq' ? 'mcq' : 'cq',
    options: (q.type || '').toUpperCase() === 'MCQ'
      ? (q.options || []).map((opt) => ({ id: opt, text: opt }))
      : undefined,
    minWords: 50,
  }));

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentQuestion = formattedQuestions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;

  const handleAnswerChange = (questionId, answer) =>
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));

  const handleNext = () => {
    if (currentQuestionIndex < formattedQuestions.length - 1)
      setCurrentQuestionIndex((i) => i + 1);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((i) => i - 1);
  };

  const handleManualSubmit = useCallback(() => {
    setShowSubmitConfirm(false);
    doSubmitRef.current(false);
  }, []);

  const dismissViolationModal = () => {
    if (violationModal && !violationModal.isTerminated) setViolationModal(null);
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (!exam && !loadError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-hairline border-t-primary" />
      </div>
    );
  }

  if (loadError || !exam) {
    return (
      <div className="rounded-lg bg-canvas p-8 border border-hairline text-center">
        <span className="material-symbols-outlined mx-auto text-6xl text-red-300">error</span>
        <h3 className="mt-4 font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">
          Error Loading Exam
        </h3>
        <p className="mt-2 text-sm text-body">{loadError || 'Exam not found'}</p>
        <button
          onClick={() => navigate('/dashboard/available-exams')}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
        >
          Back to Available Exams
        </button>
      </div>
    );
  }

  // ── Instructions screen ────────────────────────────────────────────────────
  if (showInstructions) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-lg bg-canvas p-8 border border-hairline">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <span className="material-symbols-outlined text-3xl text-primary">quiz</span>
            </div>
            <h1 className="mt-4 font-display text-[32px] leading-tight tracking-[-0.02em] text-ink">
              {exam.title}
            </h1>
            <p className="mt-2 text-body">{exam.course}</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: 'schedule', label: 'Duration', value: `${exam.durationMinutes} min` },
              { icon: 'quiz', label: 'Questions', value: formattedQuestions.length },
              { icon: 'star', label: 'Total Marks', value: exam.totalMarks },
            ].map(({ icon, label, value }) => (
              <div key={label} className="rounded-lg bg-surface-soft p-4 text-center">
                <span className="material-symbols-outlined text-2xl text-body">{icon}</span>
                <p className="mt-2 text-sm text-body">{label}</p>
                <p className="font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">{value}</p>
              </div>
            ))}
          </div>

          {/* Exam instructions */}
          <div className="mt-8">
            <h3 className="font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">
              Instructions
            </h3>
            <ul className="mt-4 space-y-3">
              {defaultInstructions.map((instruction, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="material-symbols-outlined mt-0.5 text-primary">check_circle</span>
                  <span className="text-body-strong">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Integrity / Anti-Cheat rules */}
          <div className="mt-6 rounded-lg border border-error/30 bg-error/5 p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-error">security</span>
              <h4 className="font-semibold text-ink">Exam Integrity Rules</h4>
              <span className="ml-auto rounded-full bg-error/15 px-2.5 py-0.5 text-xs font-medium text-error">
                Enforced
              </span>
            </div>
            <ul className="space-y-2">
              {integrityRules.map((rule, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="material-symbols-outlined mt-0.5 text-sm text-error">shield</span>
                  <span className="text-sm text-body-strong">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-lg bg-warning/10 p-4 border border-warning/30">
            <span className="material-symbols-outlined text-[#7a5a0e]">warning</span>
            <span className="text-sm font-medium text-[#7a5a0e]">
              Once you start, the timer begins, fullscreen is activated, and your activity is monitored
            </span>
          </div>

          {/* Camera permission status */}
          {cameraPermission === 'denied' && (
            <div className="mt-4 rounded-lg border border-error/40 bg-error/5 p-4 flex items-start gap-3">
              <span className="material-symbols-outlined text-error mt-0.5">videocam_off</span>
              <div>
                <p className="font-semibold text-ink text-sm">Camera Access Required</p>
                <p className="text-sm text-body mt-1">
                  This exam requires your camera for proctoring. Please allow camera access in your browser settings and refresh the page.
                </p>
              </div>
            </div>
          )}

          {cameraPermission === 'pending' && (
            <div className="mt-4 flex items-center gap-2 text-sm text-body rounded-lg border border-hairline bg-surface-soft p-4">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-hairline border-t-primary flex-shrink-0" />
              Requesting camera access and loading face detection…
            </div>
          )}

          {cameraPermission === 'granted' && (
            <div className="mt-4 flex items-center gap-2 text-sm text-[#2f6e3d] rounded-lg border border-success/30 bg-success/5 p-4">
              <span className="material-symbols-outlined">videocam</span>
              Camera ready — face detection loaded
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => navigate('/dashboard/available-exams')}
              className="flex-1 rounded-lg bg-surface-card px-6 py-3 text-sm font-medium text-body-strong transition-colors hover:bg-hairline"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowInstructions(false)}
              disabled={cameraPermission !== 'granted'}
              className={`flex-1 rounded-lg px-6 py-3 text-sm font-medium text-on-primary transition-colors ${
                cameraPermission === 'granted'
                  ? 'bg-primary hover:bg-primary-active'
                  : 'bg-primary/40 cursor-not-allowed'
              }`}
            >
              {cameraPermission === 'granted' ? 'I Understand — Start Exam' : 'Camera Required to Start'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="rounded-lg bg-canvas p-8 border border-hairline text-center">
        <span className="material-symbols-outlined mx-auto text-6xl text-muted-soft">quiz</span>
        <h3 className="mt-4 font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">
          No Questions Available
        </h3>
        <p className="mt-2 text-sm text-body">This exam doesn't have any questions yet.</p>
        <button
          onClick={() => navigate('/dashboard/available-exams')}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
        >
          Back to Available Exams
        </button>
      </div>
    );
  }

  // ── Exam screen ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Violation Modal ─────────────────────────────────────────────────── */}
      {violationModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-xl border-2 bg-canvas p-6 shadow-2xl ${
            violationModal.isTerminated
              ? 'border-error'
              : violationModal.count >= 2
                ? 'border-error/60'
                : 'border-warning/60'
          }`}>
            <div className="text-center">
              {/* Icon */}
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                violationModal.isTerminated ? 'bg-error/15' : 'bg-warning/15'
              }`}>
                <span className={`material-symbols-outlined text-4xl ${
                  violationModal.isTerminated ? 'text-error' : 'text-[#7a5a0e]'
                }`}>
                  {violationModal.isTerminated ? 'gavel' : 'warning'}
                </span>
              </div>

              {/* Title */}
              <h3 className="mt-4 font-display text-[22px] leading-tight tracking-[-0.015em] text-ink">
                {violationModal.isTerminated
                  ? 'Exam Terminated'
                  : violationModal.count >= 2
                    ? 'Final Warning'
                    : 'Integrity Warning'}
              </h3>

              {/* Violation type badge */}
              <div className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                violationModal.isTerminated
                  ? 'bg-error/10 text-error'
                  : 'bg-warning/15 text-[#7a5a0e]'
              }`}>
                <ViolationTypeLabel type={violationModal.type} />
              </div>

              {/* Message */}
              <p className="mt-4 text-sm leading-relaxed text-body">
                {violationModal.isTerminated
                  ? 'You have violated exam integrity rules 3 times. Your exam is being automatically submitted. All violations have been recorded and will be visible to your teacher.'
                  : violationModal.count >= 2
                    ? 'This is your final warning. One more violation will immediately and automatically submit your exam. Return to the exam and do not switch tabs or exit fullscreen.'
                    : 'You navigated away from the exam window. This incident has been recorded and will be visible to your teacher. You have 1 warning remaining before automatic submission.'}
              </p>

              {/* Violation counter */}
              <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-surface-soft p-3">
                <span className="material-symbols-outlined text-sm text-error">report</span>
                <span className="text-xs font-semibold text-body-strong">
                  Violation {violationModal.count} of {MAX_VIOLATIONS} recorded
                </span>
              </div>

              {/* Violation progress bar */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-hairline">
                <div
                  className={`h-full rounded-full transition-all ${
                    violationModal.count >= MAX_VIOLATIONS ? 'bg-error' : 'bg-warning'
                  }`}
                  style={{ width: `${(violationModal.count / MAX_VIOLATIONS) * 100}%` }}
                />
              </div>

              {/* Footer: spinner or dismiss button */}
              {violationModal.isTerminated ? (
                <div className="mt-5 flex items-center justify-center gap-2 text-sm text-muted">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-hairline border-t-error" />
                  Submitting your exam automatically…
                </div>
              ) : (
                <button
                  onClick={dismissViolationModal}
                  className={`mt-5 w-full rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-colors ${
                    violationModal.count >= 2
                      ? 'bg-error hover:bg-error/90'
                      : 'bg-warning hover:bg-warning/90'
                  }`}
                >
                  I Understand — Return to Exam
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Camera Violation Modal ──────────────────────────────────────────── */}
      {cameraViolationModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-xl border-2 bg-canvas p-6 shadow-2xl ${
            cameraViolationModal.isTerminated ? 'border-error' : 'border-warning/60'
          }`}>
            <div className="text-center">
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                cameraViolationModal.isTerminated ? 'bg-error/15' : 'bg-warning/15'
              }`}>
                <span className={`material-symbols-outlined text-4xl ${
                  cameraViolationModal.isTerminated ? 'text-error' : 'text-[#7a5a0e]'
                }`}>
                  {cameraViolationModal.isTerminated ? 'gavel' : 'videocam_off'}
                </span>
              </div>

              <h3 className="mt-4 font-display text-[22px] leading-tight tracking-[-0.015em] text-ink">
                {cameraViolationModal.isTerminated ? 'Exam Terminated' : 'Camera Warning'}
              </h3>

              <div className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                cameraViolationModal.isTerminated ? 'bg-error/10 text-error' : 'bg-warning/15 text-[#7a5a0e]'
              }`}>
                <span className="material-symbols-outlined text-sm">
                  {cameraViolationModal.reason === 'no_face' ? 'person_off' : 'group'}
                </span>
                {cameraViolationModal.reason === 'no_face' ? 'No face detected' : 'Multiple faces detected'}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-body">
                {cameraViolationModal.isTerminated
                  ? "Your exam has been automatically submitted due to repeated camera violations. This has been flagged for your teacher's review."
                  : cameraViolationModal.reason === 'no_face'
                    ? 'Your face was not visible to the camera. Please ensure you are looking directly at the screen. This is your first and only warning before automatic submission.'
                    : 'More than one face was detected. Only the registered student may be present during the exam. This is your first and only warning.'}
              </p>

              <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-surface-soft p-3">
                <span className="material-symbols-outlined text-sm text-error">videocam</span>
                <span className="text-xs font-semibold text-body-strong">
                  Camera violation {cameraViolationModal.count} of {MAX_CAMERA_VIOLATIONS} recorded
                </span>
              </div>

              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-hairline">
                <div
                  className={`h-full rounded-full transition-all ${
                    cameraViolationModal.isTerminated ? 'bg-error' : 'bg-warning'
                  }`}
                  style={{ width: `${(cameraViolationModal.count / MAX_CAMERA_VIOLATIONS) * 100}%` }}
                />
              </div>

              {cameraViolationModal.isTerminated ? (
                <div className="mt-5 flex items-center justify-center gap-2 text-sm text-muted">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-hairline border-t-error" />
                  Submitting your exam automatically…
                </div>
              ) : (
                <button
                  onClick={() => setCameraViolationModal(null)}
                  className="mt-5 w-full rounded-lg bg-warning px-6 py-2.5 text-sm font-semibold text-white hover:bg-warning/90 transition-colors"
                >
                  I Understand — Return to Exam
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Submit Confirmation Modal ────────────────────────────────────────── */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-w-md rounded-lg bg-canvas p-6 shadow-xl">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-warning/15">
                <span className="material-symbols-outlined text-2xl text-[#7a5a0e]">warning</span>
              </div>
              <h3 className="mt-4 font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">
                Submit Exam?
              </h3>
              <p className="mt-2 text-sm text-body">
                You have answered {answeredCount} out of {formattedQuestions.length} questions.
                Once submitted, you cannot change your answers.
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 rounded-lg bg-surface-card px-4 py-2.5 text-sm font-medium text-body-strong transition-colors hover:bg-hairline"
              >
                Cancel
              </button>
              <button
                onClick={handleManualSubmit}
                disabled={submitting}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active disabled:opacity-60"
              >
                {submitting ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sticky Header ───────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 rounded-lg border border-hairline bg-canvas/95 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">
              {exam.title}
            </h1>
            <p className="text-sm text-body">
              Question {currentQuestionIndex + 1} of {formattedQuestions.length}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Violation badge */}
            {totalViolations > 0 && (
              <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                totalViolations >= 2 ? 'bg-error/10 text-error' : 'bg-warning/10 text-[#7a5a0e]'
              }`}>
                <span className="material-symbols-outlined text-sm">warning</span>
                {totalViolations}/{MAX_VIOLATIONS} violations
              </div>
            )}

            {/* Fullscreen restore button */}
            {!isFullscreen && (
              <button
                onClick={() => document.documentElement.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {})}
                className="flex items-center gap-1.5 rounded-lg bg-warning/10 px-3 py-1.5 text-xs font-medium text-[#7a5a0e] transition-colors hover:bg-warning/20"
                title="Re-enter fullscreen to avoid a violation"
              >
                <span className="material-symbols-outlined text-sm">fullscreen</span>
                Enter Fullscreen
              </button>
            )}

            {/* Timer */}
            <div className="rounded-lg bg-surface-soft px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-body">schedule</span>
                <span className={`text-lg font-bold ${timeRemaining < 300 ? 'text-[#8a3636]' : 'text-ink'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowSubmitConfirm(true)}
              disabled={submitting}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active disabled:opacity-60"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </div>

      {/* ── Main layout ─────────────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-4">

        {/* Question Area */}
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-hairline bg-canvas p-6">
            {/* Question meta */}
            <div className="mb-6 flex items-start justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Question {currentQuestionIndex + 1}
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-body">
                  <span className="material-symbols-outlined text-base">star</span>
                  {currentQuestion.marks} marks
                </span>
                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                  currentQuestion.type === 'mcq'
                    ? 'bg-accent-teal/10 text-accent-teal'
                    : 'bg-success/10 text-[#2f6e3d]'
                }`}>
                  {currentQuestion.type === 'mcq' ? 'Multiple Choice' : 'Short Answer'}
                </span>
              </div>
            </div>

            {/* Question text */}
            <div className="mb-6">
              <p className="text-lg text-ink">{currentQuestion.question}</p>
            </div>

            {/* Answer area */}
            {currentQuestion.type === 'mcq' ? (
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                      answers[currentQuestion.id] === option.id
                        ? 'border-primary bg-primary/5'
                        : 'border-hairline hover:bg-surface-soft'
                    }`}
                  >
                    <input
                      type="radio"
                      name={String(currentQuestion.id)}
                      value={option.id}
                      checked={answers[currentQuestion.id] === option.id}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="h-5 w-5 text-primary"
                    />
                    <span className="flex-1 text-ink">{option.text}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div>
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Type your answer here..."
                  rows={8}
                  className="w-full rounded-md border border-hairline bg-canvas px-3.5 py-3 text-ink placeholder:text-muted-soft focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="mt-2 flex items-center justify-between text-sm text-body">
                  <span>
                    {currentQuestion.minWords && <>Minimum {currentQuestion.minWords} words recommended</>}
                  </span>
                  <span>
                    {(answers[currentQuestion.id] || '').split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-surface-card px-4 py-2.5 text-sm font-medium text-body-strong transition-colors hover:bg-hairline disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="material-symbols-outlined">chevron_left</span>
                Previous
              </button>

              {currentQuestionIndex === formattedQuestions.length - 1 ? (
                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active disabled:opacity-60"
                >
                  Submit Exam
                  <span className="material-symbols-outlined">check</span>
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
                >
                  Save & Next
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">

            {/* Question Palette */}
            <div className="rounded-lg border border-hairline bg-canvas p-4">
              <h3 className="mb-4 font-semibold text-ink">Question Palette</h3>

              <div className="mb-4 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-success" />
                  <span className="text-body">Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-hairline" />
                  <span className="text-body">
                    Not Answered ({formattedQuestions.length - answeredCount})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {formattedQuestions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                      currentQuestionIndex === index
                        ? 'bg-primary text-on-primary ring-2 ring-primary ring-offset-2'
                        : answers[q.id]
                          ? 'bg-success text-on-primary hover:bg-success/90'
                          : 'bg-surface-card text-body-strong hover:bg-hairline'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-lg border border-warning/30 bg-warning/10 p-3">
                <p className="text-xs text-[#7a5a0e]">
                  Make sure to answer all questions before submitting
                </p>
              </div>
            </div>

            {/* Integrity Monitor */}
            <div className={`rounded-lg border p-4 ${
              totalViolations === 0
                ? 'border-success/25 bg-success/5'
                : totalViolations >= MAX_VIOLATIONS - 1
                  ? 'border-error/30 bg-error/5'
                  : 'border-warning/30 bg-warning/5'
            }`}>
              <div className="mb-3 flex items-center gap-2">
                <span className={`material-symbols-outlined text-lg ${
                  totalViolations === 0
                    ? 'text-[#2f6e3d]'
                    : totalViolations >= MAX_VIOLATIONS - 1
                      ? 'text-error'
                      : 'text-[#7a5a0e]'
                }`}>
                  {totalViolations === 0 ? 'verified_user' : 'security'}
                </span>
                <span className="text-xs font-semibold text-ink">Integrity Monitor</span>
              </div>

              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-body">Violations</span>
                <span className={`font-bold ${
                  totalViolations === 0
                    ? 'text-[#2f6e3d]'
                    : totalViolations >= MAX_VIOLATIONS - 1
                      ? 'text-error'
                      : 'text-[#7a5a0e]'
                }`}>
                  {totalViolations} / {MAX_VIOLATIONS}
                </span>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-hairline">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    totalViolations === 0
                      ? 'bg-success'
                      : totalViolations >= MAX_VIOLATIONS - 1
                        ? 'bg-error'
                        : 'bg-warning'
                  }`}
                  style={{ width: `${(totalViolations / MAX_VIOLATIONS) * 100}%` }}
                />
              </div>

              <p className="mt-2 text-[10px] text-muted">
                {totalViolations === 0
                  ? 'No violations detected'
                  : `${MAX_VIOLATIONS - totalViolations} warning${MAX_VIOLATIONS - totalViolations !== 1 ? 's' : ''} remaining before auto-submit`}
              </p>
            </div>

            {/* Camera Monitor */}
            <div className={`rounded-lg border p-4 ${
              cameraPermission !== 'granted'
                ? 'border-error/30 bg-error/5'
                : cameraViolations === 0
                  ? 'border-success/25 bg-success/5'
                  : 'border-warning/30 bg-warning/5'
            }`}>
              <div className="mb-2 flex items-center gap-2">
                <span className={`material-symbols-outlined text-lg ${
                  cameraPermission !== 'granted' ? 'text-error'
                  : cameraViolations === 0 ? 'text-[#2f6e3d]' : 'text-[#7a5a0e]'
                }`}>
                  {cameraPermission !== 'granted' ? 'videocam_off' : 'videocam'}
                </span>
                <span className="text-xs font-semibold text-ink">Camera Monitor</span>
                {cameraViolations > 0 && (
                  <span className="ml-auto text-xs font-bold text-[#7a5a0e]">
                    {cameraViolations}/{MAX_CAMERA_VIOLATIONS}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-muted">
                {cameraPermission !== 'granted' ? 'Camera not available'
                  : cameraViolations === 0 ? 'Camera active — no issues'
                  : `${MAX_CAMERA_VIOLATIONS - cameraViolations} warning${MAX_CAMERA_VIOLATIONS - cameraViolations !== 1 ? 's' : ''} before auto-submit`}
              </p>
              {cameraPermission === 'granted' && (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="mt-3 w-full rounded-lg border border-hairline object-cover"
                  style={{ height: '80px' }}
                />
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
