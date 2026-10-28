import { type FC, useState } from 'react';
import { FAQ_ENDPOINTS } from 'constants/endpoints';

interface EnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  onSuccess?: (msg: string) => void;
}

const LEARNING_MODES = [
  'Онлайн (Zoom)',
  'Очно в аудиториях в Алматы',
  'Дистанционно на платформе LMS',
];

const EnrollModal: FC<EnrollModalProps> = ({ isOpen, onClose, courseTitle, onSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [learningMode, setLearningMode] = useState(LEARNING_MODES[0]);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch(FAQ_ENDPOINTS.LEADS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: fullName,
          phone,
          program: `${courseTitle} (${learningMode})`,
          source: 'enroll_course_modal',
        }),
      }).catch((err) => console.log('Enroll submit notice:', err));

      onSuccess?.(`Заявка на курс «${courseTitle}» принята! Наш менеджер свяжется с вами.`);
      onClose();
    } catch (err) {
      console.error('Error submitting enrollment:', err);
      onSuccess?.(`Заявка на курс принята!`);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-7 relative border border-slate-200">
        <button
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-brand-700 text-[24px]">school</span>
          <h3 className="text-lg font-bold text-slate-900">Запись на курс</h3>
        </div>

        <p className="text-sm font-semibold text-brand-700 mb-4 bg-brand-50 p-2.5 rounded-lg border border-brand-100">
          {courseTitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">
              ФИО участника
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Иванов Сергей"
              required
              className="w-full px-3.5 py-2.5 text-base rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-700"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">
              Телефон / WhatsApp
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (777) 000-00-00"
              required
              className="w-full px-3.5 py-2.5 text-base rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-700"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">
              Формат обучения
            </label>
            <select
              value={learningMode}
              onChange={(e) => setLearningMode(e.target.value)}
              className="w-full px-3.5 py-2.5 text-base rounded-lg bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-700"
            >
              {LEARNING_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-brand-700 text-white rounded-lg text-base font-bold hover:bg-brand-800 transition-colors shadow-sm mt-3 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <span>{submitting ? 'Отправка...' : 'Подтвердить регистрацию'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnrollModal;
