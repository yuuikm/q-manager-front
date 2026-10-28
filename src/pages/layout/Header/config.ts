import { ROUTES } from 'constants/routes';

export interface HeaderDropdownChild {
  label: string;
  path: string;
  icon?: string;
  description?: string;
}

export interface HeaderNavItem {
  id: string;
  label: string;
  path: string;
  children?: HeaderDropdownChild[];
  anchorId?: string;
}

export const HEADER_PHONE = {
  raw: '+77272749392',
  display: '+7 (727) 274-93-92',
};

export const HEADER_LOGO = {
  title: 'Q-Manager',
  subtitle: 'Интерсертифика Казахстан',
  icon: 'verified',
};

export const HEADER_NAV_ITEMS: HeaderNavItem[] = [
  {
    id: 'education',
    label: 'Обучение',
    path: ROUTES.COURSES,
    children: [
      {
        label: 'Онлайн-курсы (Zoom)',
        path: ROUTES.COURSES_ONLINE,
        icon: 'videocam',
        description: 'Вебинары с ведущими аудиторами',
      },
      {
        label: 'Очные классы в Алматы',
        path: ROUTES.COURSES_OFFLINE,
        icon: 'location_on',
        description: 'Аудитории на ул. Байзакова 299',
      },
      {
        label: 'Дистанционно (LMS 24/7)',
        path: ROUTES.COURSES_SELF,
        icon: 'devices',
        description: 'Круглосуточный доступ к материалам',
      },
      {
        label: 'Каталог всех 34 курсов',
        path: ROUTES.COURSES,
        icon: 'arrow_forward',
      },
    ],
  },
  {
    id: 'consulting',
    label: 'Консалтинг',
    path: ROUTES.CONSULTATION_DEVELOPMENT,
    anchorId: '#consulting',
  },
  {
    id: 'documents',
    label: 'Документы',
    path: ROUTES.DOCUMENTS,
    anchorId: '#docs-market',
  },
  {
    id: 'manager-help',
    label: 'В помощь менеджеру',
    path: ROUTES.MANAGER_HELP,
    anchorId: '#manager-help',
  },
  {
    id: 'about',
    label: 'О нас',
    path: ROUTES.ABOUT_US,
    anchorId: '#about-company',
  },
  {
    id: 'news',
    label: 'Новости',
    path: ROUTES.NEWS,
    anchorId: '#news',
  },
  {
    id: 'contacts',
    label: 'Контакты',
    path: ROUTES.CONTACT,
    anchorId: '#contacts',
  },
];

export const PROFILE_MENU_ITEMS = [
  { label: 'Мои документы', path: ROUTES.DOCUMENTS, icon: 'description' },
  { label: 'Мои курсы', path: ROUTES.COURSES, icon: 'school' },
  { label: 'Профиль', path: ROUTES.PROFILE, icon: 'account_circle' },
];
