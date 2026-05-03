import { type FC, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coursesAPI, type Course, type CourseMaterial, type Test } from 'api/courses';
import { COURSE_ENDPOINTS } from 'constants/endpoints';

type StepType = 'material' | 'test';

interface LearningStep {
  id: string; // unique string id
  type: StepType;
  title: string;
  data: CourseMaterial | Test;
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

  useEffect(() => {
    const fetchEverything = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const courseId = parseInt(id);

        // Fetch course, materials, and tests in parallel
        const [courseData, materialsData, testsData] = await Promise.all([
          coursesAPI.getCourse(courseId),
          coursesAPI.getCourseMaterials(courseId),
          coursesAPI.getCourseTests(courseId).catch(() => []) // tests might fail if not fully implemented backend, safe fallback
        ]);

        // Construct steps
        const sortedMaterials = [...materialsData].sort((a, b) => a.sort_order - b.sort_order);
        const newSteps: LearningStep[] = [
          ...sortedMaterials.map(m => ({ id: `m-${m.id}`, type: 'material' as StepType, title: m.title, data: m })),
          ...testsData.map(t => ({ id: `t-${t.id}`, type: 'test' as StepType, title: t.title, data: t }))
        ];

        setCourse(courseData);
        setSteps(newSteps);

        // Fetch user progress
        const token = localStorage.getItem('auth_token');
        if (token) {
          const resp = await fetch(COURSE_ENDPOINTS.USER_ENROLLED_COURSES, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          });
          if (resp.ok) {
            const data = await resp.json();
            const enrollment = data.enrollments.find((e: any) => e.course_id === courseId);
            if (!enrollment) {
              throw new Error('Вы не записаны на этот курс');
            }
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

  const handleStepChange = async (newIndex: number) => {
    if (newIndex < 0 || newIndex >= steps.length) return;
    
    setCurrentStepIndex(newIndex);
    
    // Save progress
    if (course && !updating) {
      setUpdating(true);
      try {
        const progressPercentage = Math.round(((newIndex + 1) / steps.length) * 100);
        await coursesAPI.updateCourseProgress(course.id, newIndex, progressPercentage);
      } catch (e) {
        console.error('Failed to update progress', e);
      } finally {
        setUpdating(false);
      }
    }
  };

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
          <button
            onClick={() => navigate('/profile')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Вернуться в профиль
          </button>
        </div>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-auto md:h-screen sticky top-0">
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={() => navigate('/profile')}
            className="text-gray-500 hover:text-gray-700 flex items-center mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад в профиль
          </button>
          <h1 className="text-xl font-bold text-gray-900 line-clamp-2">{course.title}</h1>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Прогресс</span>
              <span>{Math.round(((currentStepIndex) / Math.max(steps.length, 1)) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.round(((currentStepIndex) / Math.max(steps.length, 1)) * 100)}%` }}
              ></div>
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
                      className={`w-full text-left px-6 py-4 flex items-start transition-colors ${
                        isActive ? 'bg-blue-50 border-r-4 border-blue-600' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`flex-shrink-0 mt-1 mr-3 flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                        isCompleted ? 'bg-green-100 text-green-600' : isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-medium line-clamp-2 ${isActive ? 'text-blue-900' : isCompleted ? 'text-gray-900' : 'text-gray-600'}`}>
                          {getStepIcon(step)} {step.title}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header toolbar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center bg-opacity-90 backdrop-blur-sm shadow-sm z-10">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            {currentStep && (
              <>
                <span className="mr-3 text-2xl">{getStepIcon(currentStep)}</span>
                {currentStep.title}
              </>
            )}
          </h2>
        </header>

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 relative">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[60vh]">
            {!currentStep ? (
              <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center h-full">
                <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p>Материалы отсутствуют</p>
              </div>
            ) : currentStep.type === 'test' ? (
              <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">
                  📝
                </div>
                <h3 className="text-2xl font-bold mb-4">{currentStep.data.title}</h3>
                {(currentStep.data as Test).description && (
                  <p className="text-gray-600 mb-8 max-w-lg text-lg">{(currentStep.data as Test).description}</p>
                )}
                
                <div className="bg-gray-50 rounded-lg p-6 w-full max-w-sm mb-8 border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-500">Проходной балл:</span>
                    <span className="font-semibold text-gray-900">{(currentStep.data as Test).passing_score}%</span>
                  </div>
                  {((currentStep.data as Test).total_questions ?? 0) > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Количество вопросов:</span>
                      <span className="font-semibold text-gray-900">{(currentStep.data as Test).total_questions}</span>
                    </div>
                  )}
                </div>

                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                  Начать тестирование
                </button>
              </div>
            ) : (
              // Material viewing logic
              <div className="p-0">
                 {(() => {
                   const mat = currentStep.data as CourseMaterial;
                   if (mat.type === 'video') {
                     return (
                       <div className="w-full bg-black aspect-video flex items-center justify-center text-white">
                         {/* Here you could embed a video player if you had an external URL or file path */}
                         {mat.external_url ? (
                           <iframe 
                             className="w-full h-full" 
                             src={mat.external_url.replace("watch?v=", "embed/")} 
                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                             allowFullScreen>
                           </iframe>
                         ) : (
                           <div className="text-center p-8">
                             <span className="text-6xl mb-4 block">▶️</span>
                             <p className="text-lg text-gray-400">Плеер видео-контента</p>
                           </div>
                         )}
                       </div>
                     );
                   }
                   if (mat.type === 'pdf') {
                     return (
                       <div className="w-full flex-col h-[70vh] bg-gray-100 flex items-center justify-center border-b">
                          <span className="text-6xl mb-4 text-red-500">📄</span>
                          <h4 className="text-xl font-bold text-gray-700 mb-2">{mat.file_name || 'PDF Документ'}</h4>
                          <button className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors shadow flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            Скачать PDF
                          </button>
                       </div>
                     );
                   }
                   if (mat.type === 'link') {
                     return (
                       <div className="p-12 text-center">
                         <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">🔗</div>
                         <h3 className="text-xl font-medium mb-4">Внешняя ссылка</h3>
                         <a href={mat.external_url || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center bg-blue-50 text-blue-700 font-medium py-3 px-6 rounded-lg hover:bg-blue-100 transition-colors">
                           Перейти по ссылке
                           <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                         </a>
                       </div>
                     );
                   }
                   // Default: text type
                   return (
                     <div className="p-8 md:p-12">
                       {mat.content ? (
                         <div className="prose prose-blue max-w-none prose-img:rounded-xl prose-img:shadow-md prose-headings:text-gray-900 prose-p:text-gray-700" dangerouslySetInnerHTML={{ __html: mat.content }} />
                       ) : (
                         <div className="text-gray-500 italic">Содержимое пусто...</div>
                       )}
                     </div>
                   );
                 })()}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <footer className="bg-white border-t border-gray-200 p-4 md:px-8 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 shrink-0">
          <button
            onClick={() => handleStepChange(currentStepIndex - 1)}
            disabled={currentStepIndex === 0}
            className={`px-6 py-3 rounded-lg font-medium flex items-center transition-all ${
              currentStepIndex === 0 
                ? 'opacity-50 cursor-not-allowed text-gray-400 bg-gray-50' 
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:shadow-sm'
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Предыдущий шаг
          </button>

          <button
            onClick={() => {
              if (currentStepIndex < steps.length - 1) {
                handleStepChange(currentStepIndex + 1);
              } else {
                navigate('/profile'); // Finished!
              }
            }}
            className={`px-8 py-3 rounded-lg font-medium flex items-center text-white transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg ${
              currentStepIndex === steps.length - 1
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
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
      </main>
    </div>
  );
};

export default LearnCourse;
