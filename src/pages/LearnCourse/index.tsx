import { type FC, useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { coursesAPI, type Course, type CourseMaterial, type Test, type TestQuestion } from 'api/courses';
import { COURSE_ENDPOINTS, BASE_URL } from 'constants/endpoints';
import { routeHelpers } from 'constants/routes';

type StepType = 'material' | 'test';

interface LearningStep {
  id: string;
  type: StepType;
  title: string;
  data: CourseMaterial | Test;
}

type TestState = 'info' | 'taking' | 'result' | 'certificate';

interface TestResult {
  passed: boolean;
  score_percentage: number;
  earned_points: number;
  total_points: number;
  passing_score: number;
  details: {
    question_id: number;
    question: string;
    user_answer: string | null;
    correct_answer: string;
    is_correct: boolean;
    points: number;
    explanation?: string;
  }[];
  certificate?: {
    certificate_number: string;
    final_score: number;
    issued_at: string;
  };
}

const LearnCourse: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [steps, setSteps] = useState<LearningStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const [certQrUrl, setCertQrUrl] = useState<string>('');

  // Test-taking state
  const [testState, setTestState] = useState<TestState>('info');
  const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loadingTest, setLoadingTest] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);

  // Timer
  useEffect(() => {
    if (!timerActive || timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmitTest();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => (t ?? 1) - 1), 1000);
    return () => clearTimeout(timer);
  }, [timerActive, timeLeft]);

  useEffect(() => {
    const fetchEverything = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const courseId = parseInt(id);

        const [courseData, materialsData, testsData] = await Promise.all([
          coursesAPI.getCourse(courseId),
          coursesAPI.getCourseMaterials(courseId),
          coursesAPI.getCourseTests(courseId).catch(() => []),
        ]);

        const sortedMaterials = [...materialsData].sort((a, b) => a.sort_order - b.sort_order);
        const newSteps: LearningStep[] = [
          ...sortedMaterials.map(m => ({ id: `m-${m.id}`, type: 'material' as StepType, title: m.title, data: m })),
          ...testsData.filter(t => t.is_active).map(t => ({ id: `t-${t.id}`, type: 'test' as StepType, title: t.title, data: t })),
        ];

        setCourse(courseData);
        setSteps(newSteps);

        const token = localStorage.getItem('auth_token');
        if (token) {
          const resp = await fetch(COURSE_ENDPOINTS.USER_ENROLLED_COURSES, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
          });
          if (resp.ok) {
            const data = await resp.json();
            const enrollment = data.enrollments.find((e: any) => e.course_id === courseId);
            if (!enrollment) throw new Error('Вы не записаны на этот курс');
            setCurrentStepIndex(enrollment.current_step_index || 0);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки курса');
      } finally {
        setLoading(false);
      }
    };
    fetchEverything();
  }, [id]);

  // Reset test state when changing steps
  useEffect(() => {
    setTestState('info');
    setTestQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTestResult(null);
    setTimerActive(false);
    setTimeLeft(null);
  }, [currentStepIndex]);

  const handleStepChange = async (newIndex: number) => {
    if (newIndex < 0 || newIndex >= steps.length) return;
    setCurrentStepIndex(newIndex);
    if (course && !updating) {
      setUpdating(true);
      try {
        const progressPercentage = Math.round(((newIndex + 1) / steps.length) * 100);
        await coursesAPI.updateCourseProgress(course.id, newIndex, progressPercentage);
      } catch (e) { console.error('Failed to update progress', e); }
      finally { setUpdating(false); }
    }
  };

  const handleStartTest = async () => {
    const step = steps[currentStepIndex];
    if (!step || step.type !== 'test') return;
    const test = step.data as Test;

    setLoadingTest(true);
    try {
      const token = localStorage.getItem('auth_token');
      const resp = await fetch(`${BASE_URL}/api/tests/${test.id}/questions`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      });
      if (!resp.ok) throw new Error('Не удалось загрузить вопросы');
      const data = await resp.json();
      setTestQuestions(data.questions || []);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setTestState('taking');
      // Start timer
      if (test.time_limit_minutes > 0) {
        setTimeLeft(test.time_limit_minutes * 60);
        setTimerActive(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTest(false);
    }
  };

  const handleSubmitTest = useCallback(async () => {
    const step = steps[currentStepIndex];
    if (!step || step.type !== 'test') return;
    const test = step.data as Test;

    setTimerActive(false);
    setLoadingTest(true);
    try {
      const token = localStorage.getItem('auth_token');
      const resp = await fetch(`${BASE_URL}/api/tests/${test.id}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });
      if (!resp.ok) throw new Error('Ошибка при отправке теста');
      const data: TestResult = await resp.json();
      setTestResult(data);
      if (data.passed && data.certificate) {
        const certUrl = `${window.location.origin}${routeHelpers.certificate(data.certificate.certificate_number)}`;
        QRCode.toDataURL(certUrl, { width: 140, margin: 1 })
          .then(url => setCertQrUrl(url))
          .catch(() => {});
        setTestState('certificate');
      } else {
        setTestState('result');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTest(false);
    }
  }, [steps, currentStepIndex, answers]);

  const getStepIcon = (step: LearningStep) => {
    if (step.type === 'test') return '📝';
    const material = step.data as CourseMaterial;
    switch (material.type) {
      case 'video': return '🎥';
      case 'pdf': return '📄';
      case 'doc': return '📑';
      case 'link': return '🔗';
      default: return '📖';
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Упс!</h2>
          <p className="text-gray-600 mb-6">{error || 'Курс не найден'}</p>
          <button onClick={() => navigate('/profile')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
            Вернуться в профиль
          </button>
        </div>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];

  // ────────── Test UI helpers ──────────
  const renderTestContent = () => {
    const test = currentStep.data as Test;

    if (testState === 'info') {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 md:p-16 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-5xl mb-8 shadow-lg">
            📝
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">{test.title}</h3>
          {test.description && (
            <p className="text-gray-500 max-w-xl text-lg mb-10 leading-relaxed">{test.description}</p>
          )}

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex flex-col items-center bg-blue-50 rounded-2xl px-8 py-5 border border-blue-100 shadow-sm">
              <span className="text-3xl mb-1">⏱️</span>
              <span className="text-2xl font-bold text-blue-700">{test.time_limit_minutes} мин</span>
              <span className="text-sm text-blue-500 mt-1">Время</span>
            </div>
            <div className="flex flex-col items-center bg-green-50 rounded-2xl px-8 py-5 border border-green-100 shadow-sm">
              <span className="text-3xl mb-1">🎯</span>
              <span className="text-2xl font-bold text-green-700">{test.passing_score}%</span>
              <span className="text-sm text-green-500 mt-1">Проходной</span>
            </div>
            <div className="flex flex-col items-center bg-orange-50 rounded-2xl px-8 py-5 border border-orange-100 shadow-sm">
              <span className="text-3xl mb-1">🔄</span>
              <span className="text-2xl font-bold text-orange-700">{test.max_attempts} попыт{test.max_attempts === 1 ? 'ка' : test.max_attempts < 5 ? 'ки' : 'ок'}</span>
              <span className="text-sm text-orange-500 mt-1">Попыток</span>
            </div>
            {(test.total_questions ?? 0) > 0 && (
              <div className="flex flex-col items-center bg-purple-50 rounded-2xl px-8 py-5 border border-purple-100 shadow-sm">
                <span className="text-3xl mb-1">❓</span>
                <span className="text-2xl font-bold text-purple-700">{test.total_questions}</span>
                <span className="text-sm text-purple-500 mt-1">Вопросов</span>
              </div>
            )}
          </div>

          <button
            onClick={handleStartTest}
            disabled={loadingTest}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-12 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-lg disabled:opacity-60"
          >
            {loadingTest ? 'Загрузка...' : 'Начать тестирование'}
          </button>
        </div>
      );
    }

    if (testState === 'taking' && testQuestions.length > 0) {
      const q = testQuestions[currentQuestionIndex];
      const isLast = currentQuestionIndex === testQuestions.length - 1;
      const allAnswered = testQuestions.every(q => answers[q.id] !== undefined);
      const timerWarning = timeLeft !== null && timeLeft < 60;

      return (
        <div className="flex flex-col h-full">
          {/* Progress bar + timer */}
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-600">
                Вопрос {currentQuestionIndex + 1} из {testQuestions.length}
              </span>
              {timeLeft !== null && (
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${timerWarning ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-200 text-gray-700'}`}>
                  ⏱️ {formatTime(timeLeft)}
                </span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / testQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <h4 className="text-xl font-semibold text-gray-900 mb-8 leading-relaxed">{q.question}</h4>
            <div className="grid gap-3">
              {q.options.map((option, i) => {
                const isSelected = answers[q.id] === option;
                return (
                  <button
                    key={i}
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: option }))}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all text-base font-medium ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 text-gray-700'
                    }`}
                  >
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm mr-3 font-bold ${
                      isSelected ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 flex justify-between items-center gap-4">
            <button
              onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
            >
              ← Назад
            </button>

            {/* Question dots */}
            <div className="flex gap-1.5 flex-wrap justify-center">
              {testQuestions.map((tq, i) => (
                <button
                  key={tq.id}
                  onClick={() => setCurrentQuestionIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === currentQuestionIndex
                      ? 'bg-indigo-600 scale-125'
                      : answers[tq.id]
                      ? 'bg-green-400'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {isLast ? (
              <button
                onClick={handleSubmitTest}
                disabled={!allAnswered || loadingTest}
                className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-50 transition-all shadow-md"
              >
                {loadingTest ? 'Отправка...' : 'Завершить тест ✓'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIndex(i => i + 1)}
                className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-md"
              >
                Далее →
              </button>
            )}
          </div>
        </div>
      );
    }

    if (testState === 'certificate' && testResult) {
      const certNumber = testResult.certificate?.certificate_number ?? '';
      const certUrl = `${window.location.origin}${routeHelpers.certificate(certNumber)}`;

      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          <div className="relative mb-6">
            <div className="w-28 h-28 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-5xl shadow-2xl animate-bounce">
              🏆
            </div>
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-2">Поздравляем!</h3>
          <p className="text-gray-500 mb-6 max-w-md">
            Вы успешно прошли тест и завершили курс. Ваш сертификат готов!
          </p>

          {/* Certificate card */}
          <div
            className="bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 rounded-2xl w-full max-w-lg shadow-2xl text-white mb-6 overflow-hidden"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-400" />
            <div className="p-7">
              <div className="text-center mb-5">
                <p className="text-[10px] font-sans tracking-widest text-blue-400 uppercase mb-1">Сертификат</p>
                <p className="text-xs text-white/60 font-sans">об успешном прохождении курса</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-1 text-left">
                  <p className="text-white/50 text-xs font-sans mb-1">Выдан</p>
                  <p className="text-xl font-bold text-white mb-1">{course.title}</p>
                  <div className="flex gap-5 mt-3 text-sm">
                    <div>
                      <p className="text-white/40 text-xs font-sans">Балл</p>
                      <p className="text-green-400 font-bold text-lg">{testResult.score_percentage}%</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs font-sans">Дата</p>
                      <p className="text-white font-medium">
                        {testResult.certificate?.issued_at
                          ? new Date(testResult.certificate.issued_at).toLocaleDateString('ru-RU')
                          : new Date().toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <p className="text-white/30 text-[10px] font-mono mt-3">{certNumber}</p>
                </div>
                {certQrUrl && (
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <img src={certQrUrl} alt="QR" className="w-20 h-20 rounded-lg bg-white p-1" />
                    <p className="text-white/30 text-[9px] text-center font-sans">Проверка</p>
                  </div>
                )}
              </div>
            </div>
            <div className="h-2 bg-gradient-to-r from-orange-400 to-yellow-400" />
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate('/profile')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all"
            >
              Перейти в профиль 🎉
            </button>
            <a
              href={certUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all"
            >
              🔗 Открыть сертификат
            </a>
          </div>
        </div>
      );
    }

    if (testState === 'result' && testResult) {
      const passed = testResult.passed;
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6 shadow-lg ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
            {passed ? '✅' : '❌'}
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{passed ? 'Тест пройден!' : 'Тест не пройден'}</h3>
          <p className="text-gray-500 mb-8 text-lg">
            {passed
              ? `Отличный результат! Ваш балл ${testResult.score_percentage}% превышает проходной порог.`
              : `Ваш балл ${testResult.score_percentage}% ниже проходного порога ${testResult.passing_score}%. Попробуйте еще раз.`}
          </p>

          {/* Score circle */}
          <div className={`w-32 h-32 rounded-full border-8 flex flex-col items-center justify-center mb-10 ${passed ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}`}>
            <span className={`text-4xl font-black ${passed ? 'text-green-600' : 'text-red-600'}`}>{testResult.score_percentage}%</span>
            <span className="text-xs text-gray-500">ваш балл</span>
          </div>

          {/* Results accordion */}
          <div className="w-full max-w-xl text-left mb-8 space-y-2">
            {testResult.details.map((d, i) => (
              <div key={d.question_id} className={`rounded-xl p-4 border ${d.is_correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-3">
                  <span className="text-lg">{d.is_correct ? '✅' : '❌'}</span>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{i + 1}. {d.question}</p>
                    {!d.is_correct && (
                      <p className="text-xs text-gray-500 mt-1">Правильный ответ: <span className="font-semibold text-green-700">{d.correct_answer}</span></p>
                    )}
                    {d.explanation && <p className="text-xs text-gray-500 mt-1 italic">{d.explanation}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!passed && (
            <button
              onClick={() => { setTestState('info'); setAnswers({}); }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-10 rounded-xl shadow-md transition-all"
            >
              Попробовать снова
            </button>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-auto md:h-screen sticky top-0">
        <div className="p-6 border-b border-gray-200">
          <button onClick={() => navigate('/profile')} className="text-gray-500 hover:text-gray-700 flex items-center mb-4 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад в профиль
          </button>
          <h1 className="text-xl font-bold text-gray-900 line-clamp-2">{course.title}</h1>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Прогресс</span>
              <span>{Math.round((currentStepIndex / Math.max(steps.length, 1)) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.round((currentStepIndex / Math.max(steps.length, 1)) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {steps.length === 0 ? (
            <div className="p-6 text-gray-500 text-center">Нет материалов</div>
          ) : (
            <ul className="py-2">
              {steps.map((step, idx) => {
                const isActive = idx === currentStepIndex;
                const isCompleted = idx < currentStepIndex;
                return (
                  <li key={step.id}>
                    <button
                      onClick={() => handleStepChange(idx)}
                      className={`w-full text-left px-6 py-4 flex items-start transition-colors ${isActive ? 'bg-blue-50 border-r-4 border-blue-600' : 'hover:bg-gray-50'}`}
                    >
                      <div className={`flex-shrink-0 mt-1 mr-3 flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        isCompleted ? 'bg-green-100 text-green-600' : isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-medium line-clamp-2 ${isActive ? 'text-blue-900' : isCompleted ? 'text-gray-900' : 'text-gray-600'}`}>
                          {getStepIcon(step)} {step.title}
                        </div>
                        {step.type === 'test' && (
                          <div className="flex gap-2 mt-1 flex-wrap">
                            <span className="text-xs text-gray-400">⏱️ {(step.data as Test).time_limit_minutes} мин</span>
                            <span className="text-xs text-gray-400">🎯 {(step.data as Test).passing_score}%</span>
                          </div>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm z-10">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            {currentStep && (
              <>
                <span className="mr-3 text-2xl">{getStepIcon(currentStep)}</span>
                {currentStep.title}
              </>
            )}
          </h2>
          {currentStep?.type === 'test' && testState === 'taking' && timeLeft !== null && (
            <span className={`text-sm font-bold px-4 py-2 rounded-full ${timeLeft < 60 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-indigo-100 text-indigo-700'}`}>
              ⏱️ {formatTime(timeLeft)}
            </span>
          )}
        </header>

        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[60vh] m-4 md:m-8">
            {!currentStep ? (
              <div className="p-12 text-center text-gray-500">Нет материалов</div>
            ) : currentStep.type === 'test' ? (
              renderTestContent()
            ) : (
              // Material viewer
              <div className="p-0">
                {(() => {
                  const mat = currentStep.data as CourseMaterial;
                  if (mat.type === 'video') {
                    return mat.external_url ? (
                      <div className="w-full bg-black aspect-video">
                        <iframe className="w-full h-full" src={mat.external_url.replace('watch?v=', 'embed/')} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                      </div>
                    ) : (
                      <div className="p-12 text-center text-gray-400">
                        <span className="text-6xl block mb-4">▶️</span>
                        <p>Видео недоступно</p>
                      </div>
                    );
                  }
                  if (mat.type === 'pdf') return (
                    <div className="h-[70vh] bg-gray-100 flex flex-col items-center justify-center">
                      <span className="text-6xl mb-4 text-red-500">📄</span>
                      <h4 className="text-xl font-bold text-gray-700 mb-4">{mat.file_name || 'PDF Документ'}</h4>
                      <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Скачать PDF
                      </button>
                    </div>
                  );
                  if (mat.type === 'link') return (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">🔗</div>
                      <h3 className="text-xl font-medium mb-4">Внешняя ссылка</h3>
                      <a href={mat.external_url || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center bg-blue-50 text-blue-700 font-medium py-3 px-6 rounded-lg hover:bg-blue-100 transition-colors gap-2">
                        Перейти
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    </div>
                  );
                  return (
                    <div className="p-8 md:p-12">
                      {mat.content
                        ? <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: mat.content }} />
                        : <div className="text-gray-500 italic">Содержимое пусто...</div>}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Footer nav — hide during active test-taking */}
        {!(currentStep?.type === 'test' && testState === 'taking') && (
          <footer className="bg-white border-t border-gray-200 p-4 md:px-8 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 shrink-0">
            <button
              onClick={() => handleStepChange(currentStepIndex - 1)}
              disabled={currentStepIndex === 0}
              className={`px-6 py-3 rounded-lg font-medium flex items-center transition-all ${
                currentStepIndex === 0 ? 'opacity-50 cursor-not-allowed text-gray-400 bg-gray-50' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Предыдущий шаг
            </button>

            <button
              onClick={() => currentStepIndex < steps.length - 1 ? handleStepChange(currentStepIndex + 1) : navigate('/profile')}
              className={`px-8 py-3 rounded-lg font-medium flex items-center text-white transition-all shadow-md hover:shadow-lg ${
                currentStepIndex === steps.length - 1 ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {currentStepIndex === steps.length - 1 ? 'Завершить курс 🎉' : 'Следующий шаг'}
              {currentStepIndex !== steps.length - 1 && (
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </footer>
        )}
      </main>
    </div>
  );
};

export default LearnCourse;
