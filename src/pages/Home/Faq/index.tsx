import { type FC, useState } from 'react';
import { FAQ_HEADER, FAQ_ITEMS, type FaqItem } from './config';

const Faq: FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-14 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
            {FAQ_HEADER.tag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
            {FAQ_HEADER.title}
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item: FaqItem) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 text-base font-bold text-slate-800 hover:text-brand-700 transition-colors"
                >
                  <span>{item.question}</span>
                  <span
                    className={`material-symbols-outlined text-[20px] text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-700' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-sm text-slate-600 border-t border-slate-100 pt-3 leading-relaxed animate-fade-in">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;
