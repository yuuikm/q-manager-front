import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  standard: string;
}

const PreviewModal: FC<PreviewModalProps> = ({ isOpen, onClose, title, standard }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-7 relative border border-slate-200">
        <button
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-2.5 mb-3.5">
          <span className="material-symbols-outlined text-brand-700 text-[24px]">description</span>
          <h3 className="text-lg font-bold text-slate-900">Предосмотр образца документа</h3>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 mb-4">
          <span className="text-xs font-mono uppercase bg-brand-100 text-brand-800 px-2 py-0.5 rounded font-semibold">
            {standard || 'ISO 9001:2015'}
          </span>
          <h4 className="text-base font-bold text-slate-900 mt-2">{title}</h4>
        </div>

        <div className="border border-slate-200 rounded-lg p-4 text-xs sm:text-sm text-slate-700 bg-white space-y-3 font-mono h-52 overflow-y-auto leading-relaxed">
          <p className="font-bold text-slate-900">1. НАЗНАЧЕНИЕ И ОБЛАСТЬ ПРИМЕНЕНИЯ</p>
          <p>
            1.1. Настоящая документированная процедура устанавливает единый порядок выполнения
            операций в соответствии с требованиями стандартов Республики Казахстан и международных
            директив ISO.
          </p>
          <p className="font-bold text-slate-900">2. НОРМАТИВНЫЕ ССЫЛКИ</p>
          <p>
            2.1. СТ РК ISO 9001-2016 «Системы менеджмента качества. Требования».
            <br />
            2.2. Закон Республики Казахстан «О техническом регулировании».
          </p>
          <p className="font-bold text-slate-900">3. ТЕРМИНЫ, ОПРЕДЕЛЕНИЯ И СОКРАЩЕНИЯ</p>
          <p>
            3.1. В рамках документа используются типовые формуляры регистрации записей качества и
            матрицы распределения ответственности (RACI).
          </p>
          <p className="font-bold text-slate-900">4. ПОРЯДОК УПРАВЛЕНИЯ И АРХИВИРОВАНИЯ</p>
          <p>
            4.1. Все формы и протоколы подлежат обязательной регистрации в электронном реестре
            предприятия.
          </p>
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Закрыть
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/documents');
            }}
            className="px-5 py-2.5 text-sm sm:text-base font-semibold bg-brand-700 text-white hover:bg-brand-800 rounded-lg transition-colors shadow-xs"
          >
            Купить полную версию (5 000 ₸)
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
