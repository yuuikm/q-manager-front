import React, { useState, useEffect, useRef } from 'react';
import { faqApi, type FaqItem } from 'api/faq';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  faqItem?: FaqItem;
  options?: FaqItem[];
  showHomeButton?: boolean;
  canGoBack?: boolean;
  isLeadForm?: boolean;
  leadQuestion?: string;
  isLeadSubmitted?: boolean;
}

// Friendly AI Robot SVG Avatar
const RobotAvatar: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => (
  <div
    style={{ width: size, height: size }}
    className={`relative flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-0.5 shadow-md flex-shrink-0 ${className}`}
  >
    <div className="w-full h-full rounded-full bg-slate-900/40 backdrop-blur-xs flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-4/5 h-4/5 text-white"
      >
        {/* Antennas */}
        <circle cx="24" cy="8" r="3" fill="#60A5FA" />
        <path d="M24 11V16" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Head */}
        <rect x="10" y="15" width="28" height="22" rx="8" fill="#FFFFFF" />
        <rect x="12" y="17" width="24" height="18" rx="6" fill="#1E293B" />
        
        {/* Visor / Screen */}
        <rect x="14" y="20" width="20" height="12" rx="4" fill="#0F172A" />
        
        {/* Glowing Eyes */}
        <circle cx="19" cy="25" r="2.5" fill="#38BDF8" className="animate-pulse" />
        <circle cx="29" cy="25" r="2.5" fill="#38BDF8" className="animate-pulse" />

        {/* Cheerful Mouth / Soundwave */}
        <path
          d="M21 29C22 30 23 30.5 24 30.5C25 30.5 26 30 27 29"
          stroke="#38BDF8"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Ears / Headphone nubs */}
        <rect x="7" y="21" width="3" height="8" rx="1.5" fill="#60A5FA" />
        <rect x="38" y="21" width="3" height="8" rx="1.5" fill="#60A5FA" />

        {/* Collar / Body accent */}
        <path d="M17 39C17 37.5 19 36 24 36C29 36 31 37.5 31 39" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
    {/* Online indicator */}
    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
  </div>
);

// Interactive In-Chat Lead Form
const InlineLeadForm: React.FC<{
  initialQuestion: string;
  onSubmitSuccess: (data: { phone: string; question: string }) => void;
}> = ({ initialQuestion, onSubmitSuccess }) => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState(initialQuestion);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError('Пожалуйста, укажите номер телефона');
      return;
    }
    if (!question.trim()) {
      setError('Пожалуйста, напишите ваш вопрос');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await faqApi.submitLeadQuestion({
        phone: phone.trim(),
        email: email.trim() || undefined,
        question: question.trim(),
      });
      onSubmitSuccess({ phone: phone.trim(), question: question.trim() });
    } catch (err: any) {
      setError(err?.message || 'Ошибка при отправке заявки');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 p-3.5 bg-white rounded-2xl border border-blue-200 shadow-sm space-y-2.5 text-xs text-slate-800">
      <div className="flex items-center gap-1.5 font-semibold text-blue-700 text-xs">
        <span>📋</span>
        <span>Оставьте контакты для связи</span>
      </div>

      {error && (
        <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px]">
          {error}
        </div>
      )}

      <div>
        <label className="block text-[11px] font-medium text-slate-600 mb-1">
          Телефон <span className="text-rose-500">*</span>
        </label>
        <input
          type="tel"
          required
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="+7 (___) ___-__-__"
          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-xs"
        />
      </div>

      <div>
        <label className="block text-[11px] font-medium text-slate-600 mb-1">
          Email <span className="text-slate-400">(необязательно)</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="example@mail.ru"
          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-xs"
        />
      </div>

      <div>
        <label className="block text-[11px] font-medium text-slate-600 mb-1">
          Ваш вопрос <span className="text-rose-500">*</span>
        </label>
        <textarea
          required
          rows={2}
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Опишите ваш вопрос..."
          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-xs leading-relaxed"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 active:scale-98 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
      >
        {submitting ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Отправка...</span>
          </>
        ) : (
          <>
            <span>Отправить вопрос менеджеру</span>
            <span>🚀</span>
          </>
        )}
      </button>
    </form>
  );
};

export const FaqBotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rootFaqs, setRootFaqs] = useState<FaqItem[]>([]);
  const [allFaqsFlat, setAllFaqsFlat] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [matchingSuggestions, setMatchingSuggestions] = useState<FaqItem[]>([]);
  const [historyStack, setHistoryStack] = useState<FaqItem[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load FAQ tree
  const loadFaqs = async () => {
    try {
      setLoading(true);
      const data = await faqApi.getFaqs();
      setRootFaqs(data);

      // Flatten tree for quick client-side matching
      const flat: FaqItem[] = [];
      const traverse = (items: FaqItem[]) => {
        items.forEach(item => {
          flat.push(item);
          const children = item.all_active_children || item.active_children;
          if (children && children.length > 0) {
            traverse(children);
          }
        });
      };
      traverse(data);
      setAllFaqsFlat(flat);

      // Initialize welcome message
      initializeChat(data);
    } catch (err) {
      console.error('Error loading FAQ in bot widget:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  // Initialize or reset chat to root questions
  const initializeChat = (roots: FaqItem[]) => {
    const welcomeMsg: ChatMessage = {
      id: 'welcome-' + Date.now(),
      sender: 'bot',
      text: 'Здравствуйте! 👋 Я виртуальный помощник Q-Manager. Выберите тему из готовых вопросов или напишите свой собственный вопрос в поле внизу:',
      options: roots,
      showHomeButton: false,
      canGoBack: false,
    };
    setMessages([welcomeMsg]);
    setHistoryStack([]);
    setCustomInput('');
    setMatchingSuggestions([]);
  };

  // Reset to root (На главную)
  const handleGoHome = () => {
    setHistoryStack([]);
    setCustomInput('');
    setMatchingSuggestions([]);

    const homeUserMsg: ChatMessage = {
      id: 'user-home-' + Date.now(),
      sender: 'user',
      text: '🏠 На главную',
    };

    setMessages(prev => [...prev, homeUserMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const homeBotMsg: ChatMessage = {
        id: 'bot-home-' + Date.now(),
        sender: 'bot',
        text: 'Вы вернулись в главное меню. Выберите интересующую тему или задайте свой вопрос ниже:',
        options: rootFaqs,
        showHomeButton: false,
        canGoBack: false,
      };
      setMessages(prev => [...prev, homeBotMsg]);
    }, 300);
  };

  // Go back one step in the branch hierarchy
  const handleGoBack = () => {
    if (historyStack.length <= 1) {
      handleGoHome();
      return;
    }

    // Pop current item, get previous
    const newStack = [...historyStack];
    newStack.pop(); // remove current
    const previousItem = newStack[newStack.length - 1];
    setHistoryStack(newStack);

    const backUserMsg: ChatMessage = {
      id: 'user-back-' + Date.now(),
      sender: 'user',
      text: '↩️ Назад',
    };

    setMessages(prev => [...prev, backUserMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const children = previousItem.active_children || previousItem.all_active_children || [];
      const backBotMsg: ChatMessage = {
        id: 'bot-back-' + Date.now(),
        sender: 'bot',
        text: `Возвращаемся к теме: "${previousItem.question}"\n\n${previousItem.answer}`,
        faqItem: previousItem,
        options: children,
        showHomeButton: true,
        canGoBack: newStack.length > 0,
      };
      setMessages(prev => [...prev, backBotMsg]);
    }, 300);
  };

  // When a user selects a pre-made FAQ question
  const handleSelectQuestion = async (faq: FaqItem) => {
    // 1. Add user message
    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: faq.question,
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setCustomInput('');
    setMatchingSuggestions([]);

    // Update history stack
    setHistoryStack(prev => [...prev, faq]);

    // Check if item has children or fetch if needed
    let childOptions: FaqItem[] = faq.active_children || faq.all_active_children || [];

    if (childOptions.length === 0) {
      try {
        const fullItem = await faqApi.getFaq(faq.id);
        if (fullItem.active_children && fullItem.active_children.length > 0) {
          childOptions = fullItem.active_children;
        }
      } catch (e) {
        console.error('Could not fetch child questions:', e);
      }
    }

    // 2. Add bot answer
    setTimeout(() => {
      setIsTyping(false);
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: faq.answer,
        faqItem: faq,
        options: childOptions,
        showHomeButton: true,
        canGoBack: true,
      };
      setMessages(prev => [...prev, botMsg]);
    }, 400);
  };

  // Handle typing in custom input (filters matching questions)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomInput(val);

    if (!val.trim()) {
      setMatchingSuggestions([]);
      return;
    }

    const q = val.toLowerCase().trim();
    const matches = allFaqsFlat.filter(
      f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    );
    setMatchingSuggestions(matches.slice(0, 4));
  };

  // Submit custom question typed by user -> opens in-chat lead form!
  const handleCustomQuestionSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const questionText = customInput.trim();
    if (!questionText) return;

    setCustomInput('');
    setMatchingSuggestions([]);

    // 1. User message bubble
    const userMsg: ChatMessage = {
      id: 'user-custom-' + Date.now(),
      sender: 'user',
      text: questionText,
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // 2. Bot response with lead form
    setTimeout(() => {
      setIsTyping(false);
      const formMsg: ChatMessage = {
        id: 'bot-lead-form-' + Date.now(),
        sender: 'bot',
        text: 'Не нашли ответ среди стандартных тем? Оставьте ваши контакты — наш менеджер оперативно свяжется с вами и подробно ответит на вопрос:',
        isLeadForm: true,
        leadQuestion: questionText,
        showHomeButton: true,
        canGoBack: false,
      };
      setMessages(prev => [...prev, formMsg]);
    }, 350);
  };

  // Trigger lead form explicitly from button
  const handleOpenLeadFormDirectly = () => {
    const userMsg: ChatMessage = {
      id: 'user-req-manager-' + Date.now(),
      sender: 'user',
      text: '💬 Задать свой вопрос менеджеру',
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const formMsg: ChatMessage = {
        id: 'bot-lead-form-' + Date.now(),
        sender: 'bot',
        text: 'Напишите ваш вопрос и укажите контактный телефон для связи. Наш специалист ответит вам в ближайшее время:',
        isLeadForm: true,
        leadQuestion: '',
        showHomeButton: true,
        canGoBack: false,
      };
      setMessages(prev => [...prev, formMsg]);
    }, 350);
  };

  // When user successfully submits the lead form
  const handleLeadSuccess = (msgId: string, data: { phone: string; question: string }) => {
    setMessages(prev =>
      prev.map(m => (m.id === msgId ? { ...m, isLeadSubmitted: true } : m))
    );

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const thankYouMsg: ChatMessage = {
        id: 'bot-thanks-' + Date.now(),
        sender: 'bot',
        text: `Спасибо! Ваша заявка успешно отправлена. 🎉\n\nНаш менеджер свяжется с вами по номеру ${data.phone} в рабочее время и ответит на ваш вопрос:\n"${data.question}".`,
        showHomeButton: true,
        canGoBack: false,
      };
      setMessages(prev => [...prev, thankYouMsg]);
    }, 400);
  };

  // Toggle open
  const toggleOpen = () => {
    setIsOpen(prev => {
      const next = !prev;
      if (next) {
        setTimeout(() => inputRef.current?.focus(), 200);
      }
      return next;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none font-sans">
      {/* Floating trigger button */}
      {!isOpen && (
        <div className="relative group">
          {/* Tooltip / Hint badge */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-900 text-white text-xs font-medium py-1.5 px-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none hidden sm:flex items-center gap-1.5">
            <span>💬 Задать вопрос помощнику Q-Manager</span>
          </div>

          <button
            type="button"
            onClick={toggleOpen}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white shadow-xl shadow-blue-500/35 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-108 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer relative overflow-hidden"
            aria-label="Открыть помощник Q-Manager"
          >
            <div className="relative flex items-center justify-center">
              <RobotAvatar size={34} />
              <div className="absolute -top-1.5 -right-2 bg-amber-400 text-slate-900 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white animate-bounce">
                ?
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] max-w-[calc(100vw-32px)] h-[600px] max-h-[calc(100vh-80px)] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-4 flex items-center justify-between shadow-md relative z-10">
            <div className="flex items-center gap-3">
              <RobotAvatar size={38} />
              <div>
                <h3 className="font-bold text-base tracking-tight text-white leading-tight">
                  Помощник Q-Manager
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[11px] text-blue-100 font-medium">Ответы и связь с менеджером</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleGoHome}
                title="Вернуться на главную ветку FAQ"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-sm cursor-pointer"
              >
                🏠
              </button>

              <button
                type="button"
                onClick={toggleOpen}
                title="Закрыть окно"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-base font-semibold cursor-pointer ml-1"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50/60 to-white">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">Загрузка базы знаний...</span>
              </div>
            ) : (
              <>
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    } animate-in fade-in slide-in-from-bottom-2 duration-200`}
                  >
                    {/* Message bubble */}
                    <div
                      className={`flex items-start gap-2 max-w-[88%] ${
                        msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      {msg.sender === 'bot' && <RobotAvatar size={30} />}

                      <div
                        className={`rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-tr-xs font-medium'
                            : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-slate-100'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>

                    {/* Inline Lead Form (if bot message requires lead input) */}
                    {msg.sender === 'bot' && msg.isLeadForm && !msg.isLeadSubmitted && (
                      <div className="pl-9 pr-1 w-full">
                        <InlineLeadForm
                          initialQuestion={msg.leadQuestion || ''}
                          onSubmitSuccess={data => handleLeadSuccess(msg.id, data)}
                        />
                      </div>
                    )}

                    {/* Interactive question branches / options */}
                    {msg.sender === 'bot' && msg.options && msg.options.length > 0 && (
                      <div className="mt-3 pl-9 pr-1 w-full space-y-1.5">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                          <span>Выберите вопрос:</span>
                          <button
                            type="button"
                            onClick={handleOpenLeadFormDirectly}
                            className="text-blue-600 hover:text-blue-800 normal-case font-medium text-[11px] hover:underline cursor-pointer"
                          >
                            + Свой вопрос
                          </button>
                        </div>
                        {msg.options.map(option => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => handleSelectQuestion(option)}
                            className="w-full text-left px-3 py-2 text-xs font-medium rounded-xl border border-blue-200/80 bg-blue-50/70 hover:bg-blue-100 text-blue-900 transition-all duration-150 flex items-center justify-between gap-2 shadow-xs hover:shadow-sm cursor-pointer group hover:translate-x-0.5"
                          >
                            <span className="group-hover:text-blue-700">{option.question}</span>
                            <span className="text-blue-400 group-hover:text-blue-600 font-bold transition-transform group-hover:translate-x-0.5">
                              →
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Navigation bar below answer */}
                    {msg.sender === 'bot' && !msg.isLeadForm && (msg.showHomeButton || msg.canGoBack) && (
                      <div className="mt-2.5 pl-9 flex flex-wrap items-center gap-1.5">
                        {msg.canGoBack && (
                          <button
                            type="button"
                            onClick={handleGoBack}
                            className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition flex items-center gap-1 cursor-pointer"
                          >
                            <span>↩️</span>
                            <span>Назад</span>
                          </button>
                        )}
                        {msg.showHomeButton && (
                          <button
                            type="button"
                            onClick={handleGoHome}
                            className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition flex items-center gap-1 cursor-pointer font-semibold"
                          >
                            <span>🏠</span>
                            <span>На главную</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleOpenLeadFormDirectly}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition flex items-center gap-1 cursor-pointer ml-auto"
                        >
                          <span>💬</span>
                          <span>Задать свой вопрос</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing animation indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 pl-1 animate-in fade-in duration-150">
                    <RobotAvatar size={28} />
                    <div className="bg-white border border-slate-200 px-3 py-2 rounded-2xl rounded-tl-xs flex items-center gap-1 shadow-xs">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Quick matching FAQ suggestions popup (if user is typing a query) */}
          {matchingSuggestions.length > 0 && (
            <div className="bg-amber-50/90 border-t border-b border-amber-200/80 px-3 py-2 text-xs space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between text-[11px] font-semibold text-amber-900">
                <span>💡 Возможно, вы ищете ответ на:</span>
                <button
                  type="button"
                  onClick={() => setMatchingSuggestions([])}
                  className="text-amber-700 hover:text-amber-900 text-[10px]"
                >
                  Скрыть
                </button>
              </div>
              <div className="space-y-1">
                {matchingSuggestions.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectQuestion(item)}
                    className="w-full text-left px-2 py-1 rounded-md bg-white border border-amber-200/70 hover:bg-amber-100/50 text-slate-800 text-[11px] font-medium flex items-center justify-between gap-1 transition cursor-pointer"
                  >
                    <span className="truncate">{item.question}</span>
                    <span className="text-amber-600 font-bold">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Custom Question Input Form */}
          <form
            onSubmit={handleCustomQuestionSubmit}
            className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={customInput}
                onChange={handleInputChange}
                placeholder="Задайте свой вопрос или тему..."
                className="w-full pl-3 pr-8 py-2 text-xs bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-300 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition"
              />
              {customInput && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomInput('');
                    setMatchingSuggestions([]);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!customInput.trim()}
              title="Отправить свой вопрос"
              className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer flex-shrink-0"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 translate-x-0.5"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FaqBotWidget;
