import { type FC, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { login, register, clearError } from 'store/authSlice';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialTab?: 'login' | 'register';
}

const AuthModal: FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, initialTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (isOpen) {
      dispatch(clearError());
      setFormError(null);
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onSuccess?.();
      onClose();
    }
  }, [isAuthenticated, isOpen, onSuccess, onClose]);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(clearError());
    setFormError(null);
    onClose();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await dispatch(login({ email: loginEmail, password: loginPassword })).unwrap();
      handleClose();
    } catch (err: any) {
      setFormError(err?.message || err || 'Неверный логин или пароль');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!registerName.trim()) {
      setFormError('Пожалуйста, введите ваше имя');
      return;
    }
    try {
      await dispatch(
        register({
          username: registerName,
          email: registerEmail,
          password: registerPassword,
        })
      ).unwrap();
      handleClose();
    } catch (err: any) {
      setFormError(err?.message || err || 'Ошибка при регистрации');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-7 relative border border-slate-200">
        {/* Close Button */}
        <button
          type="button"
          aria-label="Закрыть"
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-brand-700 flex items-center justify-center text-white shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[22px]">verified</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 leading-snug">Личный кабинет Q-Manager</h3>
            <span className="text-xs text-slate-500">Доступ к курсам и документам СМК</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-lg mb-5 text-sm font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              dispatch(clearError());
              setFormError(null);
            }}
            className={`flex-1 py-2.5 rounded-md transition-all text-center ${
              activeTab === 'login'
                ? 'bg-white text-brand-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Вход
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              dispatch(clearError());
              setFormError(null);
            }}
            className={`flex-1 py-2.5 rounded-md transition-all text-center ${
              activeTab === 'register'
                ? 'bg-white text-brand-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Регистрация
          </button>
        </div>

        {/* Error Alert */}
        {(error || formError) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
            <span className="material-symbols-outlined text-red-500 text-[20px] shrink-0">error</span>
            <span>{formError || error}</span>
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                Email или телефон
              </label>
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="name@company.kz"
                required
                className="w-full px-3.5 py-2.5 text-base rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-700"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                Пароль
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 text-base rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-700"
              />
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-brand-700 focus:ring-brand-500 border-slate-300"
                />
                <span>Запомнить меня</span>
              </label>
              <a href="/login" className="text-brand-700 hover:underline">
                Забыли пароль?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-brand-700 text-white rounded-lg text-base font-bold hover:bg-brand-800 transition-colors shadow-sm mt-3 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <span>Выполняется вход...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>Войти в личный кабинет</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                ФИО или Имя
              </label>
              <input
                type="text"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                placeholder="Иванов Сергей"
                required
                className="w-full px-3.5 py-2.5 text-base rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-700"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                Контактный телефон
              </label>
              <input
                type="tel"
                value={registerPhone}
                onChange={(e) => setRegisterPhone(e.target.value)}
                placeholder="+7 (701) 000-00-00"
                className="w-full px-3.5 py-2.5 text-base rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-700"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                Рабочий Email
              </label>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="name@company.kz"
                required
                className="w-full px-3.5 py-2.5 text-base rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-700"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                Создайте пароль
              </label>
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Минимум 8 символов"
                required
                minLength={6}
                className="w-full px-3.5 py-2.5 text-base rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-700"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-brand-700 text-white rounded-lg text-base font-bold hover:bg-brand-800 transition-colors shadow-sm mt-3 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <span>Регистрация...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  <span>Зарегистрироваться</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
