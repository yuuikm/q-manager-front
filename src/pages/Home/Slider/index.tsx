import { type FC, useEffect, useState, useCallback } from 'react';
import { sliderAPI, type Slider as SliderType } from 'api/slider';
import { BASE_URL } from 'constants/endpoints';
import { HERO_STATS, FALLBACK_SLIDES } from './config';

interface DisplaySlide {
  id: number | string;
  badgeText: string;
  badgeIcon?: string;
  badgeVariant?: 'brand' | 'amber' | 'emerald';
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  primaryButtonIcon?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  secondaryButtonIcon?: string;
  imageUrl: string;
  caption?: string;
}

const Slider: FC = () => {
  const [slides, setSlides] = useState<DisplaySlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const data: SliderType[] = await sliderAPI.getSliders();
        if (data && data.length > 0) {
          const mapped: DisplaySlide[] = data.map((item) => ({
            id: item.id,
            badgeText: 'Аккредитованный центр ISO & Модель EFQM',
            badgeVariant: 'brand',
            title: item.title || 'Международная сертификация ISO & Модель EFQM',
            description:
              item.description ||
              'Комплексная подготовка специалистов и аудит систем менеджмента от официального аккредитованного центра.',
            primaryButtonText: 'Подробнее',
            primaryButtonHref: item.link_url || '#courses-catalog',
            primaryButtonIcon: 'arrow_forward',
            secondaryButtonText: 'Получить консультацию',
            secondaryButtonHref: '#callback-block',
            secondaryButtonIcon: 'support_agent',
            imageUrl: `${BASE_URL}/storage/${item.image_path}`,
            caption: 'Официальные квалификационные сертификаты',
          }));
          setSlides(mapped);
        } else {
          // Fallback to high quality stitch slides
          setSlides(
            FALLBACK_SLIDES.map((s) => ({
              id: s.id,
              badgeText: s.badge.text,
              badgeIcon: s.badge.icon,
              badgeVariant: s.badge.variant,
              title: s.title,
              description: s.description,
              primaryButtonText: s.primaryButton.label,
              primaryButtonHref: s.primaryButton.href,
              primaryButtonIcon: s.primaryButton.icon,
              secondaryButtonText: s.secondaryButton?.label,
              secondaryButtonHref: s.secondaryButton?.href,
              secondaryButtonIcon: s.secondaryButton?.icon,
              imageUrl: s.image,
              caption: s.caption,
            }))
          );
        }
      } catch (error) {
        console.error('Error in Slider component:', error);
        setSlides(
          FALLBACK_SLIDES.map((s) => ({
            id: s.id,
            badgeText: s.badge.text,
            badgeIcon: s.badge.icon,
            badgeVariant: s.badge.variant,
            title: s.title,
            description: s.description,
            primaryButtonText: s.primaryButton.label,
            primaryButtonHref: s.primaryButton.href,
            primaryButtonIcon: s.primaryButton.icon,
            secondaryButtonText: s.secondaryButton?.label,
            secondaryButtonHref: s.secondaryButton?.href,
            secondaryButtonIcon: s.secondaryButton?.icon,
            imageUrl: s.image,
            caption: s.caption,
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-slide effect
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [slides.length, nextSlide]);

  if (loading) {
    return (
      <section className="py-8 sm:py-10 lg:py-14 bg-gradient-to-b from-white via-slate-50 to-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl h-[620px] sm:h-[560px] lg:h-[480px] border border-slate-200 animate-pulse" />
        </div>
      </section>
    );
  }


  const getBadgeStyle = (variant?: 'brand' | 'amber' | 'emerald') => {
    switch (variant) {
      case 'amber':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'emerald':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-brand-50 text-brand-700 border-brand-200';
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-white via-slate-50 to-[#F8FAFC] border-b border-slate-200 overflow-hidden py-8 sm:py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Slider Card - Fixed height to avoid layout shift when title or description length varies */}
        <div className="relative bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden h-[620px] sm:h-[560px] lg:h-[480px]">
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 flex flex-col lg:flex-row items-center justify-between p-6 sm:p-8 lg:p-12 xl:p-14 gap-6 lg:gap-8 transition-opacity duration-500 ${
                  isActive
                    ? 'opacity-100 pointer-events-auto z-10'
                    : 'opacity-0 pointer-events-none z-0'
                }`}
              >
                {/* Left Text Content */}
                <div className="max-w-2xl flex flex-col justify-center gap-3 sm:gap-4 lg:gap-5 w-full">
                  <div
                    className={`inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border ${getBadgeStyle(
                      slide.badgeVariant
                    )}`}
                  >
                    {slide.badgeIcon ? (
                      <span className="material-symbols-outlined text-[18px]">
                        {slide.badgeIcon}
                      </span>
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-600 animate-pulse" />
                    )}
                    <span>{slide.badgeText}</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] line-clamp-2 lg:line-clamp-3">
                    {slide.title}
                  </h1>

                  <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {slide.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 sm:pt-2">
                    <a
                      href={slide.primaryButtonHref}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-700 text-white font-semibold text-base hover:bg-brand-800 transition-colors shadow-sm"
                    >
                      <span>{slide.primaryButtonText}</span>
                      {slide.primaryButtonIcon && (
                        <span className="material-symbols-outlined text-[20px]">
                          {slide.primaryButtonIcon}
                        </span>
                      )}
                    </a>

                    {slide.secondaryButtonText && (
                      <a
                        href={slide.secondaryButtonHref || '#callback-block'}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 text-slate-800 font-semibold text-base hover:bg-slate-200 transition-colors border border-slate-200"
                      >
                        {slide.secondaryButtonIcon && (
                          <span className="material-symbols-outlined text-brand-600 text-[20px]">
                            {slide.secondaryButtonIcon}
                          </span>
                        )}
                        <span>{slide.secondaryButtonText}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Image Box */}
                <div className="w-full lg:w-80 xl:w-96 shrink-0 h-44 sm:h-52 lg:h-72 xl:h-80 rounded-xl overflow-hidden shadow-md relative bg-slate-100">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {slide.caption && (
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-4">
                      <span className="text-xs sm:text-sm font-medium text-white">{slide.caption}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Navigation Arrows */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Предыдущий слайд"
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center transition-transform active:scale-95 z-20"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button
                type="button"
                aria-label="Следующий слайд"
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center transition-transform active:scale-95 z-20"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </>
          )}

          {/* Dots Pagination */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2 z-20">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Слайд ${idx + 1}`}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'w-7 bg-brand-700'
                      : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 4 Key Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {HERO_STATS.map((stat) => (
            <div
              key={stat.id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[28px]">{stat.icon}</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight block">
                  {stat.value}
                </span>
                <p className="text-sm text-slate-600 font-medium leading-tight mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Slider;
