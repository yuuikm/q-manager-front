import { type FC, useEffect, useState } from 'react';
import { sliderAPI, type Slider as SliderType } from 'api/slider';
import { BASE_URL } from 'constants/endpoints.ts';

const Slider: FC = () => {
  const [sliders, setSliders] = useState<SliderType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const data = await sliderAPI.getSliders();
        setSliders(data);
      } catch (error) {
        console.error('Error in Slider component:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSliders();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (sliders.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliders.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [sliders.length]);

  if (loading) {
    return (
      <section className="container mx-auto my-5 rounded-2xl h-[400px] md:h-[500px] bg-gray-200 animate-pulse" />
    );
  }

  // Fallback if no sliders are active
  if (sliders.length === 0) {
    return (
      <section className="container hero-section text-white py-20 mx-auto my-5 rounded-2xl">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Учебный центр Q-Manager</h1>
          <p className="text-xl md:text-2xl mb-8">Профессиональное обучение менеджменту качества</p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <a
              href="/courses"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
            >
              Наши курсы
            </a>
            <a
              href="/contacts"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
            >
              Консультация
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container relative overflow-hidden mx-auto my-5 rounded-2xl h-[400px] md:h-[500px] shadow-2xl">
      {sliders.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms] ease-linear transform scale-100"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${BASE_URL}/storage/${slide.image_path})`,
              transform: index === currentIndex ? 'scale(1.05)' : 'scale(1)'
            }}
          />

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-6">
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl transition-all duration-1000 delay-300 ${index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
              {slide.title}
            </h2>
            <p className={`text-xl md:text-2xl mb-10 max-w-2xl drop-shadow-lg transition-all duration-1000 delay-500 ${index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
              {slide.description}
            </p>
            {slide.link_url && (
              <a
                href={slide.link_url}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold text-lg transform hover:scale-105 transition-all duration-300 shadow-xl delay-700 ${index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
              >
                Подробнее
              </a>
            )}
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      {sliders.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-4 z-20">
          {sliders.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-500 ${index === currentIndex
                ? 'bg-blue-500 w-10'
                : 'bg-white/40 w-2 hover:bg-white/70'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {sliders.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + sliders.length) % sliders.length)}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-opacity hidden md:block"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % sliders.length)}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-opacity hidden md:block"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </section>
  );
};

export default Slider;
