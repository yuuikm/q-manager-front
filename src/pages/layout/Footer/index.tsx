import { type FC, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthModal from 'components/shared/AuthModal';
import {
  FOOTER_COMPANY,
  FOOTER_ISO_DIRECTIONS,
  FOOTER_FORMATS_SERVICES,
  FOOTER_LEGAL_LINKS,
} from './config';

const currentYear = new Date().getFullYear();

const Footer: FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800" id="contacts">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Col 1: Logo & Company Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded bg-brand-600 flex items-center justify-center text-white shrink-0">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                </div>
                <span className="text-base font-bold text-white tracking-tight">
                  {FOOTER_COMPANY.name}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                {FOOTER_COMPANY.description}
              </p>
              <div className="text-xs text-slate-400 space-y-1.5">
                <p className="text-slate-200 font-semibold mb-1">Контакты центра:</p>
                <p>{FOOTER_COMPANY.contacts.address}</p>
                <p>
                  Тел:{' '}
                  <a
                    href={`tel:${FOOTER_COMPANY.contacts.phoneRaw}`}
                    className="hover:text-white font-medium transition-colors"
                  >
                    {FOOTER_COMPANY.contacts.phone}
                  </a>
                </p>
                <p>
                  Email:{' '}
                  <a
                    href={`mailto:${FOOTER_COMPANY.contacts.email}`}
                    className="hover:text-white font-medium transition-colors"
                  >
                    {FOOTER_COMPANY.contacts.email}
                  </a>
                </p>
              </div>
            </div>

            {/* Col 2: ISO Directions */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                Направления ISO
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {FOOTER_ISO_DIRECTIONS.map((item) => (
                  <li key={item.label}>
                    <Link to={item.path} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Formats & Services */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                Форматы и сервисы
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {FOOTER_FORMATS_SERVICES.map((item) => (
                  <li key={item.label}>
                    <Link to={item.path} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Personal Cabinet */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                Личный кабинет
              </h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Авторизуйтесь для доступа к материалам курсов и купленным стандартам.
              </p>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full py-2 px-3 bg-brand-700 hover:bg-brand-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span>Войти в систему</span>
              </button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© {currentYear} Платформа Q-Manager. Все права защищены.</p>
            <div className="flex gap-6">
              {FOOTER_LEGAL_LINKS.map((link) => (
                <a key={link.label} href={link.path} className="hover:text-slate-200 transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Footer;
