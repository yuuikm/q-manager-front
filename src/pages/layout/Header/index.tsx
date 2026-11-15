import { type FC, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { logout, getCurrentUser, checkAuth } from 'store/authSlice';
import { ROUTES } from 'constants/routes';
import AuthModal from 'components/shared/AuthModal';
import {
  HEADER_NAV_ITEMS,
  HEADER_PHONE,
  HEADER_LOGO,
  HEADER_COMPANY_INFO,
  PROFILE_MENU_ITEMS,
  type HeaderNavItem,
  type HeaderDropdownChild,
} from './config';

const Header: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAppSelector((state: any) => state.auth);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      dispatch(checkAuth());
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      setShowProfileDropdown(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDropdownEnter = (id: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(id);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // Direct page navigation without anchors
  const handleNavClick = (item: HeaderNavItem) => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);

    if (item.path === ROUTES.HOME && location.pathname === ROUTES.HOME) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    navigate(item.path);
  };

  const handleDropdownChildClick = (child: HeaderDropdownChild) => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    navigate(child.path);
  };

  const scrollToCallback = () => {
    setIsMobileMenuOpen(false);
    if (location.pathname === ROUTES.HOME) {
      const el = document.getElementById('callback-block');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate('/#callback-block');
  };

  return (
    <>
      {/* 1. HEADER (КОМПАКТНЫЙ, АККУРАТНЫЙ И БЕЗ ПЕРЕНОСОВ В ОДНУ СТРОКУ) */}
      <header className="fixed top-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-16 flex items-center justify-between gap-4">
          {/* Logo without subtitle */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-brand-700 flex items-center justify-center text-white shadow-sm shadow-brand-700/30 group-hover:bg-brand-800 transition-colors shrink-0">
              <span className="material-symbols-outlined text-[18px] lg:text-[20px]">{HEADER_LOGO.icon}</span>
            </div>
            <span className="text-base lg:text-lg font-bold tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors whitespace-nowrap">
              {HEADER_LOGO.title}
            </span>
          </Link>

          {/* Desktop Navigation (Compact, Grouped Dropdowns, Direct Page Navigation) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 whitespace-nowrap text-xs xl:text-sm font-medium">
            {HEADER_NAV_ITEMS.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isDropdownOpen = activeDropdown === item.id;
              const isActive = location.pathname === item.path && !hasChildren;

              if (hasChildren) {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => handleDropdownEnter(item.id)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(isDropdownOpen ? null : item.id)}
                      className="flex items-center gap-0.5 px-2.5 py-1.5 rounded-md text-slate-700 hover:text-brand-700 hover:bg-slate-50 transition-colors"
                    >
                      <span>{item.label}</span>
                      <span
                        className={`material-symbols-outlined text-[16px] text-slate-400 transition-transform duration-200 ${
                          isDropdownOpen ? 'rotate-180 text-brand-700' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 pt-1.5 w-64 z-50 animate-fade-in">
                        <div className="bg-white rounded-lg shadow-xl border border-slate-200 py-1 text-sm text-slate-700 overflow-hidden">
                          {item.children!.map((child, idx) => {
                            if (child.isDividerAbove) {
                              return (
                                <div key={idx}>
                                  <div className="h-px bg-slate-100 my-1" />
                                  <button
                                    type="button"
                                    onClick={() => handleDropdownChildClick(child)}
                                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-brand-700 hover:underline text-left"
                                  >
                                    <span>{child.label}</span>
                                    {child.icon && (
                                      <span className="material-symbols-outlined text-[14px]">
                                        {child.icon}
                                      </span>
                                    )}
                                  </button>
                                </div>
                              );
                            }

                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleDropdownChildClick(child)}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-brand-50 hover:text-brand-700 transition-colors"
                              >
                                {child.icon && (
                                  <span className="material-symbols-outlined text-brand-600 text-[18px]">
                                    {child.icon}
                                  </span>
                                )}
                                <span className="text-xs xl:text-sm font-medium">{child.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`px-2.5 py-1.5 rounded-md transition-colors ${
                    isActive
                      ? 'text-brand-700 font-semibold bg-brand-50'
                      : 'text-slate-700 hover:text-brand-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
            <div className="hidden sm:flex items-center gap-2">
              {/* Auth Button or Profile Dropdown */}
              {isAuthenticated && user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs lg:text-sm font-medium text-slate-700 hover:text-brand-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                  >
                    <span className="material-symbols-outlined text-[18px] text-brand-700">
                      account_circle
                    </span>
                    <span className="max-w-[120px] truncate">{user.username || 'Профиль'}</span>
                    <span className="material-symbols-outlined text-[16px] text-slate-400">
                      expand_more
                    </span>
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-fade-in">
                      {PROFILE_MENU_ITEMS.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-xs lg:text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px] text-slate-500">
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </Link>
                      ))}
                      <div className="h-px bg-slate-100 my-1" />
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs lg:text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span>Выйти</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs lg:text-sm font-medium text-slate-700 hover:text-brand-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                >
                  <span className="material-symbols-outlined text-[18px]">account_circle</span>
                  <span>Войти</span>
                </button>
              )}

              {/* Leave Request Button */}
              <button
                type="button"
                onClick={scrollToCallback}
                className="inline-flex items-center justify-center px-3.5 py-2 bg-brand-700 text-white rounded-lg text-xs lg:text-sm font-semibold hover:bg-brand-800 transition-colors shadow-sm"
              >
                <span>Оставить заявку</span>
              </button>
            </div>

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              aria-label="Открыть меню"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:text-brand-700 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-5 h-5 fill-none stroke-current" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Drawer Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Drawer Slide-Over */}
        <div
          className={`fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-white shadow-2xl border-l border-slate-200 lg:hidden flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
          }`}
        >
          {/* Drawer Top Header without subtitle */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-[18px]">{HEADER_LOGO.icon}</span>
              </div>
              <span className="text-base font-bold text-slate-900 leading-tight">
                {HEADER_LOGO.title}
              </span>
            </div>
            <button
              type="button"
              aria-label="Закрыть меню"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Drawer Nav Links Body */}
          <div className="p-5 space-y-4 flex-1 overflow-y-auto text-sm">
            {/* Nav Items */}
            {HEADER_NAV_ITEMS.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = activeDropdown === item.id;
              const isActive = location.pathname === item.path && !hasChildren;

              if (hasChildren) {
                return (
                  <div key={item.id} className="border-b border-slate-100 pb-3">
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(isExpanded ? null : item.id)}
                      className="w-full flex items-center justify-between py-1.5 text-sm font-semibold text-slate-800"
                    >
                      <span>{item.label}</span>
                      <span
                        className={`material-symbols-outlined text-[18px] text-slate-400 transition-transform ${
                          isExpanded ? 'rotate-180 text-brand-700' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="space-y-1.5 pl-2 pt-1.5">
                        {item.children!.map((child, cIdx) => (
                          <button
                            key={cIdx}
                            type="button"
                            onClick={() => handleDropdownChildClick(child)}
                            className="w-full flex items-center gap-2 py-1.5 text-xs text-slate-700 hover:text-brand-700 text-left"
                          >
                            {child.icon && (
                              <span className="material-symbols-outlined text-brand-600 text-[16px]">
                                {child.icon}
                              </span>
                            )}
                            <span>{child.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`w-full text-left py-2 text-sm font-semibold transition-colors border-b border-slate-100 ${
                    isActive ? 'text-brand-700 font-bold' : 'text-slate-800 hover:text-brand-700'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Company Info Footer in Drawer */}
            <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-800">{HEADER_COMPANY_INFO.company}</p>
              <p>{HEADER_COMPANY_INFO.address}</p>
              <a href={`tel:${HEADER_PHONE.raw}`} className="text-slate-800 font-medium block hover:text-brand-700">
                {HEADER_COMPANY_INFO.phone}
              </a>
              <p>{HEADER_COMPANY_INFO.schedule}</p>
            </div>
          </div>

          {/* Drawer Bottom Actions */}
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-2">
            {isAuthenticated && user ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 px-1 py-1 text-slate-800 text-xs font-semibold">
                  <span className="material-symbols-outlined text-[18px] text-brand-700">account_circle</span>
                  <span>{user.username || 'Профиль'}</span>
                </div>
                <Link
                  to={ROUTES.PROFILE}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
                >
                  Личный кабинет
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white border border-slate-200 text-slate-800 text-sm font-semibold hover:bg-slate-100 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">account_circle</span>
                <span>Войти в кабинет</span>
              </button>
            )}

            <button
              type="button"
              onClick={scrollToCallback}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Оставить заявку</span>
            </button>
          </div>
        </div>
      </header>

      {/* Auth Modal Popup */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;
