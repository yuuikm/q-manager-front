import { type FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { coursesAPI, type Course } from 'api/courses';
import ContentCard, { type ContentCardData } from 'components/shared/ContentCard';
import { COURSE_TITLES, COURSE_DESCRIPTIONS } from 'constants/courses';

interface CoursesProps {
  type?: 'online' | 'offline' | 'self_learning';
}

const Courses: FC<CoursesProps> = ({ type }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Reset page when type changes
  useEffect(() => {
    setCurrentPage(1);
  }, [type]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await coursesAPI.getCourses({ 
          page: currentPage,
          ...(type ? { type } : {})
        });
        setCourses(response.data);
        setTotalPages(response.last_page);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки курсов');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentPage, type]);

  const pageTitle = type ? COURSE_TITLES[type] : COURSE_TITLES.default;
  const pageDescription = type ? COURSE_DESCRIPTIONS[type] : COURSE_DESCRIPTIONS.default;

  const handleViewDetails = (item: ContentCardData) => {
    navigate(`/courses/${item.id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-12">{pageTitle}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-12">{pageTitle}</h1>
            <div className="text-center text-red-600">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold mb-6 text-gray-900">{pageTitle}</h1>
              {pageDescription.subtitle && (
                <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                  {pageDescription.subtitle}
                </p>
              )}
            </div>
            
            {pageDescription.sections && pageDescription.sections.length > 0 && (
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {pageDescription.sections.map((section, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold mb-4 text-gray-900">{section.title}</h3>
                    {section.content && (
                      <p className="text-gray-600 leading-relaxed mb-4">{section.content}</p>
                    )}
                    {section.list && (
                      <ul className="space-y-4">
                        {section.list.map((item, idxi) => (
                          <li key={idxi} className="flex flex-start">
                            <span className="mr-3 mt-0.5 text-blue-600">{item.icon || (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            )}</span>
                            <span className="text-gray-600">
                              {item.label && <strong className="font-semibold text-gray-900 mr-1">{item.label}:</strong>}
                              {item.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.map((course) => (
              <ContentCard
                key={course.id}
                item={course as ContentCardData}
                type="course"
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {courses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Курсы пока не добавлены</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Назад
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 border rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Вперед
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
