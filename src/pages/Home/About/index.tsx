import { type FC } from 'react';
import {
  ABOUT_HEADER,
  COMPANY_HIGHLIGHTS,
  AUDIT_STAGES,
  type AuditStageItem,
  type CompanyHighlight,
} from './config';

const About: FC = () => {
  return (
    <section className="py-14 bg-white border-b border-slate-200" id="consulting">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" id="about-company">
          {/* Left Column: Company Info */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
              {ABOUT_HEADER.tag}
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {ABOUT_HEADER.title}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {ABOUT_HEADER.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {COMPANY_HIGHLIGHTS.map((item: CompanyHighlight) => (
                <div key={item.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-sm font-bold text-brand-700 block mb-1">
                    {item.title}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Audit Stages */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-600 text-[20px]">
                account_tree
              </span>
              <span>Этапы аудиторского сопровождения</span>
            </h3>

            <div className="space-y-3">
              {AUDIT_STAGES.map((stage: AuditStageItem) => (
                <div
                  key={stage.number}
                  className="flex items-start gap-3 p-3.5 bg-white rounded-lg border border-slate-200 hover:border-brand-200 transition-colors"
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      stage.isCompletedStatus
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-brand-100 text-brand-700'
                    }`}
                  >
                    {stage.number}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 text-sm block mb-0.5">{stage.title}</span>
                    <p className="text-xs text-slate-600 leading-relaxed">{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
