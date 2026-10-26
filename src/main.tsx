import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'store/store';
// @ts-ignore
import 'styles/index.css';
import App from 'pages/App.tsx';
import Header from 'pages/layout/Header';
import Footer from 'pages/layout/Footer';
import FaqBotWidget from 'components/FaqBotWidget';

function LayoutWrapper() {
  const location = useLocation();
  const isImmersivePage = location.pathname === '/login' || 
                          location.pathname === '/register' || 
                          location.pathname.startsWith('/learn');

  // SPA Route tracking for Yandex.Metrika
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof (window as any).ym === 'function') {
      (window as any).ym(95516632, 'hit', window.location.href);
    }
  }, [location.pathname, location.search]);

  return (
    <>
      {!isImmersivePage && <Header />}
      <App />
      {!isImmersivePage && <Footer />}
      <FaqBotWidget />
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <StrictMode>
        <LayoutWrapper />
      </StrictMode>
    </BrowserRouter>
  </Provider>,
);
