import { type FC, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { newsAPI } from 'api/news';
import {
  NEWS_SECTION_HEADER,
  FALLBACK_NEWS,
} from './config';

interface DisplayNewsCard {
  id: number;
  date: string;
  title: string;
  description: string;
}

const News: FC = () => {
  const [news, setNews] = useState<DisplayNewsCard[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await newsAPI.getNews({
          featured: true,
          page: 1,
        });

        if (response.data && response.data.length > 0) {
          const mapped: DisplayNewsCard[] = response.data.slice(0, 3).map((item) => ({
            id: item.id,
            date: item.published_at
              ? new Date(item.published_at).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : 'Недавно',
            title: item.title,
            description: item.description || 'Актуальные изменения в области стандартизации и сертификации в Казахстане.',
          }));
          setNews(mapped);
        } else {
          setNews(FALLBACK_NEWS);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setNews(FALLBACK_NEWS);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className="py-14 bg-white border-b border-slate-200" id="news">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-sm sm:text-base font-bold uppercase tracking-wider text-brand-700">
              {NEWS_SECTION_HEADER.tag}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-1.5 tracking-tight">
              {NEWS_SECTION_HEADER.title}
            </h2>
          </div>
          <Link
            to={NEWS_SECTION_HEADER.allNewsPath}
            className="text-base sm:text-lg font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1 group"
          >
            <span>{NEWS_SECTION_HEADER.allNewsLabel}</span>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* 3 News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-6 rounded-xl border border-slate-200 bg-slate-50 h-44 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/news/${item.id}`)}
                className="p-6 sm:p-7 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs sm:text-sm text-slate-500 font-medium block mb-2">
                    {item.date}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2.5 leading-snug group-hover:text-brand-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-base text-slate-600 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center text-base font-semibold text-brand-700 group-hover:translate-x-1 transition-transform">
                  <span>Читать полностью</span>
                  <span className="material-symbols-outlined text-[18px] ml-1.5">arrow_forward</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default News;
