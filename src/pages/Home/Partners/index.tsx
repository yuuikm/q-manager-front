import { type FC } from 'react';
import { PARTNERS_HEADER, PARTNERS_LIST, type PartnerItem } from './config';

const Partners: FC = () => {
  return (
    <section className="py-10 bg-slate-100 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6 block">
          {PARTNERS_HEADER.title}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 items-center">
          {PARTNERS_LIST.map((partner: PartnerItem) => (
            <div
              key={partner.id}
              className="bg-white py-3.5 px-4 rounded-lg border border-slate-200 text-sm font-bold text-slate-800 shadow-xs hover:border-slate-300 transition-colors"
            >
              {partner.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
