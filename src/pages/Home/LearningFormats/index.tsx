import { type FC } from 'react';
import { Link } from 'react-router-dom';
import {
  LEARNING_FORMATS,
  LEARNING_FORMATS_HEADER,
  type LearningFormatItem,
} from './config';

const LearningFormats: FC = () => {
  return (
    <section className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-sm sm:text-base font-bold uppercase tracking-wider text-brand-700">
            {LEARNING_FORMATS_HEADER.tag}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-1.5 tracking-tight">
            {LEARNING_FORMATS_HEADER.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-2">
            {LEARNING_FORMATS_HEADER.subtitle}
          </p>
        </div>

        {/* 3 Formats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LEARNING_FORMATS.map((format: LearningFormatItem) => (
            <div
              key={format.id}
              className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-xl ${format.iconBgClass} ${format.iconTextClass} flex items-center justify-center mb-5`}
                >
                  <span className="material-symbols-outlined text-[26px]">{format.icon}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">{format.title}</h3>

                <p className="text-base sm:text-[17px] text-slate-600 mb-6 leading-relaxed">
                  {format.description}
                </p>

                <ul className="space-y-3 mb-6 text-[15px] sm:text-base text-slate-700 font-medium">
                  {format.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-brand-600 text-[20px] shrink-0">
                        check_circle
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <Link
                  to={format.path}
                  className={`inline-flex items-center justify-center w-full py-3.5 px-4 rounded-lg text-base font-semibold transition-colors ${format.buttonClass}`}
                >
                  <span>{format.buttonLabel}</span>
                  <span className="material-symbols-outlined text-[18px] ml-1.5">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningFormats;
