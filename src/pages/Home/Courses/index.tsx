import { type FC, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { coursesAPI } from 'api/courses';
import { BASE_URL } from 'constants/endpoints';
import {
  COURSES_SECTION_HEADER,
  FALLBACK_COURSES,
  type FallbackCourse,
} from './config';

interface CoursesProps {
  onEnroll?: (courseTitle: string) => void;
}

interface CourseCardViewData {
  id: number;
  title: string;
  categoryName: string;
  description: string;
  price: number;
  durationHours?: number;
  badgeText: string;
  imageUrl: string;
}

const Courses: FC<CoursesProps> = ({ onEnroll }) => {
  const [courses, setCourses] = useState<CourseCardViewData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await coursesAPI.getCourses({
          featured: true,
          page: 1,
        });

        if (response.data && response.data.length > 0) {
          const mapped: CourseCardViewData[] = response.data.slice(0, 6).map((c) => ({
            id: c.id,
            title: c.title,
            categoryName: c.category?.name || 'Курс сертификации',
            description: c.description || 'Программа повышения квалификации и аудит систем качества.',
            price: c.price || 50000,
            durationHours: c.duration_hours || 36,
            badgeText: 'Zoom • Онлайн',
            imageUrl: c.featured_image
              ? `${BASE_URL}/storage/${c.featured_image}`
              : FALLBACK_COURSES[0].imageUrl,
          }));
          setCourses(mapped);
        } else {
          setCourses(
            FALLBACK_COURSES.map((f: FallbackCourse) => ({
              id: f.id,
              title: f.title,
              categoryName: f.categoryName,
              description: f.description,
              price: f.price,
              durationHours: f.durationHours,
              badgeText: f.formatBadge,
              imageUrl: f.imageUrl,
            }))
          );
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setCourses(
          FALLBACK_COURSES.map((f: FallbackCourse) => ({
            id: f.id,
            title: f.title,
            categoryName: f.categoryName,
            description: f.description,
            price: f.price,
            durationHours: f.durationHours,
            badgeText: f.formatBadge,
            imageUrl: f.imageUrl,
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₸';
  };

  const handleEnrollClick = (title: string) => {
    if (onEnroll) {
      onEnroll(title);
    } else {
      const el = document.getElementById('callback-block');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-14 bg-[#F8FAFC] border-b border-slate-200" id="courses-catalog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-sm sm:text-base font-bold uppercase tracking-wider text-brand-700">
              {COURSES_SECTION_HEADER.tag}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-1.5 tracking-tight">
              {COURSES_SECTION_HEADER.title}
            </h2>
          </div>
          <Link
            to={COURSES_SECTION_HEADER.allCoursesPath}
            className="text-base sm:text-lg font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1 group"
          >
            <span>{COURSES_SECTION_HEADER.allCoursesLabel}</span>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-xl h-96 border border-slate-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div>
                  {/* Image container with badges */}
                  <div className="h-48 bg-slate-100 overflow-hidden relative">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded text-xs sm:text-sm font-semibold text-slate-700 shadow-sm">
                      {course.badgeText}
                    </div>
                    {course.durationHours && (
                      <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white px-3 py-1 rounded text-xs sm:text-sm font-medium">
                        {course.durationHours} акад. часов
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-700 block mb-2">
                      {course.categoryName}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 leading-snug line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-base text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>

                {/* Footer with Price and Buttons */}
                <div className="p-6 pt-0">
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-xs sm:text-sm text-slate-500 block uppercase font-medium">
                        Стоимость
                      </span>
                      <span className="text-xl sm:text-2xl font-bold text-slate-900">
                        {formatPrice(course.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => navigate(`/courses/${course.id}`)}
                        className="px-4 py-2.5 text-sm sm:text-base font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                      >
                        Подробнее
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEnrollClick(course.title)}
                        className="px-4.5 py-2.5 text-sm sm:text-base font-semibold bg-brand-700 text-white hover:bg-brand-800 rounded-lg transition-colors shadow-xs"
                      >
                        Записаться
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Courses;
