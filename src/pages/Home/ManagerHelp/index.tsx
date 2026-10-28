import { type FC } from 'react';
import { Link } from 'react-router-dom';
import {
  MANAGER_HELP_HEADER,
  MANAGER_HELP_ITEMS,
  type ManagerHelpItem,
} from './config';

const ManagerHelp: FC = () => {
  return (
    <section className="py-14 bg-[#F8FAFC] border-b border-slate-200" id="manager-help">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-sm sm:text-base font-bold uppercase tracking-wider text-brand-700">
              {MANAGER_HELP_HEADER.tag}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-1.5 tracking-tight">
              {MANAGER_HELP_HEADER.title}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mt-2">
              {MANAGER_HELP_HEADER.subtitle}
            </p>
          </div>
          <Link
            to={MANAGER_HELP_HEADER.allLinkPath}
            className="text-base sm:text-lg font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1 group"
          >
            <span>{MANAGER_HELP_HEADER.allLinkText}</span>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MANAGER_HELP_ITEMS.map((item: ManagerHelpItem) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 hover:border-brand-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div
                  className={`w-11 h-11 rounded-lg ${item.iconBgClass} ${item.iconColorClass} flex items-center justify-center mb-4`}
                >
                  <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-[15px] sm:text-base text-slate-600 mb-4 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <Link
                to={item.path}
                className="text-base font-semibold text-brand-700 hover:underline flex items-center gap-1 pt-3.5 border-t border-slate-100"
              >
                <span>{item.actionLabel}</span>
                <span className="material-symbols-outlined text-[18px]">
                  {item.actionIcon}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManagerHelp;
