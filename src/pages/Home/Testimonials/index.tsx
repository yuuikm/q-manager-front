import { type FC } from 'react';
import {
  TESTIMONIALS_HEADER,
  TESTIMONIALS_LIST,
  type TestimonialItem,
} from './config';

const Testimonials: FC = () => {
  return (
    <section className="py-14 bg-[#F8FAFC] border-b border-slate-200" id="reviews">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
            {TESTIMONIALS_HEADER.tag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
            {TESTIMONIALS_HEADER.title}
          </h2>
        </div>

        {/* 3 Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS_LIST.map((item: TestimonialItem) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-500 mb-3 text-sm">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[18px]">
                      star
                    </span>
                  ))}
                </div>

                <p className="text-sm text-slate-700 italic leading-relaxed mb-6">
                  {item.quote}
                </p>
              </div>

              {/* Author Footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div
                  className={`w-10 h-10 rounded-full ${item.avatarBgClass} text-white flex items-center justify-center font-bold text-sm shrink-0`}
                >
                  {item.initials}
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">{item.name}</span>
                  <span className="text-xs text-slate-500">{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
