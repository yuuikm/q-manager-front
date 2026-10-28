import { ROUTES } from 'constants/routes';

export interface FooterLinkItem {
  label: string;
  path: string;
}

export interface FooterSection {
  title: string;
  links: FooterLinkItem[];
}

export const FOOTER_COMPANY = {
  name: 'Q-Manager',
  description:
    'ТОО «Интерсертифика Консалтинг Казахстан» — официальный аккредитованный центр сертификации и обучения систем менеджмента.',
  contacts: {
    address: 'г. Алматы, ул. Байзакова 299',
    phone: '+7 (727) 274-93-92',
    phoneRaw: '+77272749392',
    email: 'info@q-manager.kz',
  },
};

export const FOOTER_ISO_DIRECTIONS: FooterLinkItem[] = [
  { label: 'СМК (ISO 9001:2015) — Качество', path: ROUTES.COURSES },
  { label: 'СЭМ (ISO 14001:2015) — Экология', path: ROUTES.COURSES },
  { label: 'СМОТ (ISO 45001:2018) — Охрана труда', path: ROUTES.COURSES },
  { label: 'СМАК (ISO 37001:2025) — Антикоррупция', path: ROUTES.COURSES },
  { label: 'СМБПП (ISO 22000) — Пищевая безопасность', path: ROUTES.COURSES },
  { label: 'Европейская модель EFQM', path: ROUTES.COURSES },
];

export const FOOTER_FORMATS_SERVICES: FooterLinkItem[] = [
  { label: 'Онлайн-курсы (Zoom / Teams)', path: ROUTES.COURSES_ONLINE },
  { label: 'Очные классы в Алматы', path: ROUTES.COURSES_OFFLINE },
  { label: 'Дистанционно (LMS 24/7)', path: ROUTES.COURSES_SELF },
  { label: 'База шаблонов регламентов СТО', path: ROUTES.DOCUMENTS },
  { label: 'В помощь менеджеру (Чек-листы)', path: ROUTES.MANAGER_HELP },
];

export const FOOTER_LEGAL_LINKS: FooterLinkItem[] = [
  { label: 'Политика конфиденциальности', path: '#' },
  { label: 'Публичная оферта', path: '#' },
];
