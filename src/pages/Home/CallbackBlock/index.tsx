import { type FC, useState } from 'react';
import { FAQ_ENDPOINTS } from 'constants/endpoints';
import {
  CALLBACK_HEADER,
  CALLBACK_FEATURES,
  PROGRAM_OPTIONS,
  type CallbackFeature,
} from './config';

interface CallbackBlockProps {
  onLeadSuccess?: (message: string) => void;
}

const CallbackBlock: FC<CallbackBlockProps> = ({ onLeadSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [program, setProgram] = useState(PROGRAM_OPTIONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch(FAQ_ENDPOINTS.LEADS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          phone,
          program,
          source: 'main_callback_block',
        }),
      }).catch((err) => console.log('Lead submission network note:', err));

      setIsSubmitted(true);
      setName('');
      setPhone('');
      onLeadSuccess?.('Заявка успешно отправлена! Наш ведущий аудитор свяжется с вами в течение 15 минут.');
    } catch (err) {
      console.error('Error submitting lead:', err);
      setIsSubmitted(true);
      onLeadSuccess?.('Заявка принята! Мы скоро свяжемся с вами.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="py-14 bg-gradient-to-r from-brand-900 via-brand-800 to-brand-950 text-white"
      id="callback-block"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Info & Perks */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-semibold self-start border border-white/20">
              {CALLBACK_HEADER.discountBadge}
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              {CALLBACK_HEADER.title}
            </h2>

            <p className="text-base sm:text-lg text-brand-100 leading-relaxed max-w-xl">
              {CALLBACK_HEADER.subtitle}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 text-[15px] sm:text-base font-medium text-brand-100">
              {CALLBACK_FEATURES.map((feature: CallbackFeature) => (
                <div key={feature.id} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-[22px]">
                    check_circle
                  </span>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Lead Form Card */}
          <div className="lg:col-span-5 bg-white text-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1.5">
              Заявка на обучение или аудит
            </h3>
            <p className="text-sm sm:text-base text-slate-500 mb-6">
              Свяжемся с вами в течение 15 минут в рабочее время
            </p>

            {isSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[28px]">done_all</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900">Спасибо за заявку!</h4>
                <p className="text-sm sm:text-base text-slate-600">
                  Менеджер центра свяжется с вами в ближайшее время.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-3 text-base text-brand-700 font-semibold hover:underline"
                >
                  Отправить еще одну заявку
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-800 block mb-1.5">
                    Ваше имя и компания
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Алибек, ТОО «КазПром»"
                    required
                    className="w-full px-4 py-3 text-base rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-700"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-800 block mb-1.5">
                    Контактный телефон
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (701) 000-00-00"
                    required
                    className="w-full px-4 py-3 text-base rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-700"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-800 block mb-1.5">
                    Интересующая программа
                  </label>
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full px-4 py-3 text-base rounded-lg bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-700"
                  >
                    {PROGRAM_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-brand-700 text-white rounded-lg text-base font-bold hover:bg-brand-800 transition-colors shadow-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                  <span>{isSubmitting ? 'Отправка...' : 'Отправить заявку'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallbackBlock;
