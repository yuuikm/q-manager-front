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
  PROFILE_MENU_ITEMS,
  type HeaderNavItem,
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

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      setShowProfileDropdown(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavClick = (item: HeaderNavItem) => {
    if (item.anchorId && location.pathname === ROUTES.HOME) {
      const el = document.querySelector(item.anchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate(item.path);
  };

  const handleDropdownEnter = (id: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(id);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const scrollToCallback = () => {
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
      <header className="fixed top-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
          {/* Logo with Verified Quality Badge */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-lg bg-brand-700 flex items-center justify-center text-white shadow-sm shadow-brand-700/30 group-hover:bg-brand-800 transition-colors">
              <span className="material-symbols-outlined text-[22px]">{HEADER_LOGO.icon}</span>
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors leading-tight">
                {HEADER_LOGO.title}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {HEADER_LOGO.subtitle}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 whitespace-nowrap">
            {HEADER_NAV_ITEMS.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isDropdownOpen = activeDropdown === item.id;

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
                      onClick={() =>
                        setActiveDropdown(activeDropdown === item.id ? null : item.id)
                      }
                      className="flex items-center gap-1 px-3 py-2 rounded-md text-[15px] xl:text-base font-medium text-slate-700 hover:text-brand-700 hover:bg-slate-50 transition-colors"
                    >
                      <span>{item.label}</span>
                      <span
                        className={`material-symbols-outlined text-[18px] text-slate-400 transition-transform duration-200 ${
                          isDropdownOpen ? 'rotate-180 text-brand-700' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 pt-1.5 w-72 z-50 animate-fade-in">
                        <div className="bg-white rounded-xl shadow-xl border border-slate-200 py-2 text-slate-700 overflow-hidden">
                          {item.children!.map((child) => (
                            <Link
                              key={child.path}
                              to={child.path}
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                            >
                              {child.icon && (
                                <span className="material-symbols-outlined text-brand-600 text-[20px]">
                                  {child.icon}
                                </span>
                              )}
                              <span className="font-medium text-sm sm:text-[15px]">{child.label}</span>
                            </Link>
                          ))}
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
                  className="px-3 py-2 rounded-md text-[15px] xl:text-base font-medium text-slate-700 hover:text-brand-700 hover:bg-slate-50 transition-colors"
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 whitespace-nowrap">
            {/* Phone Link */}
            <a
              href={`tel:${HEADER_PHONE.raw}`}
              className="hidden sm:flex items-center gap-1.5 text-sm xl:text-base font-semibold text-slate-800 hover:text-brand-700 transition-colors"
            >
              <span className="material-symbols-outlined text-brand-600 text-[20px]">call</span>
              <span>{HEADER_PHONE.display}</span>
            </a>

            {/* Auth Button or Profile Dropdown */}
            {isAuthenticated && user ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-brand-700 bg-slate-100 hover:bg-slate-200/80 rounded-md transition-colors"
                >
                  <span className="material-symbols-outlined text-[19px] text-brand-700">
                    account_circle
                  </span>
                  <span className="max-w-[130px] truncate">{user.username || 'Профиль'}</span>
                  <span className="material-symbols-outlined text-[16px] text-slate-400">
                    expand_more
                  </span>
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                    {PROFILE_MENU_ITEMS.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
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
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-brand-700 bg-slate-100 hover:bg-slate-200/80 rounded-md transition-colors"
              >
                <span className="material-symbols-outlined text-[19px]">account_circle</span>
                <span>Войти</span>
              </button>
            )}

            {/* Leave Request Button */}
            <button
              type="button"
              onClick={scrollToCallback}
              className="inline-flex items-center justify-center px-4 py-2 bg-brand-700 text-white rounded-md text-sm font-semibold hover:bg-brand-800 transition-all shadow-sm"
            >
              <span>Оставить заявку</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              aria-label="Меню"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[26px]">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Phone link on mobile */}
            <a
              href={`tel:${HEADER_PHONE.raw}`}
              className="flex items-center gap-2 py-2.5 text-base font-semibold text-brand-700 border-b border-slate-100 mb-2"
            >
              <span className="material-symbols-outlined text-[20px]">call</span>
              <span>{HEADER_PHONE.display}</span>
            </a>

            {/* Nav Items */}
            {HEADER_NAV_ITEMS.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = activeDropdown === item.id;

              if (hasChildren) {
                return (
                  <div key={item.id} className="border-b border-slate-50 pb-1">
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(isExpanded ? null : item.id)}
                      className="w-full flex items-center justify-between py-2.5 text-base font-semibold text-slate-800"
                    >
                      <span>{item.label}</span>
                      <span
                        className={`material-symbols-outlined text-[20px] text-slate-400 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="pl-3 space-y-2 pb-2">
                        {item.children!.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className="flex items-center gap-2.5 py-1.5 text-sm font-medium text-slate-600 hover:text-brand-700"
                          >
                            {child.icon && (
                              <span className="material-symbols-outlined text-brand-600 text-[18px]">
                                {child.icon}
                              </span>
                            )}
                            <span>{child.label}</span>
                          </Link>
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
                  onClick={() => {
                    handleNavClick(item);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2.5 text-base font-semibold text-slate-800 hover:text-brand-700"
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Auth Modal Popup */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;
