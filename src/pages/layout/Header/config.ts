import { ROUTES } from 'constants/routes';

export interface HeaderDropdownChild {
  label: string;
  path: string;
  icon?: string;
  description?: string;
  isDividerAbove?: boolean;
}

export interface HeaderNavItem {
  id: string;
  label: string;
  path: string;
  children?: HeaderDropdownChild[];
}

export const HEADER_PHONE = {
  raw: '+77272749392',
  display: '+7 (727) 274-93-92',
};

export const HEADER_COMPANY_INFO = {
  company: 'ТОО «ИнтерСерт Консалтинг ЦентрАзия»',
  address: 'г. Алматы, ул. Байзакова 299',
  phone: '+7 (727) 274-93-92',
  schedule: 'Пн-Пт: 09:00 - 18:00',
};

export const HEADER_LOGO = {
  title: 'Q-Manager',
  icon: 'verified',
};

export const HEADER_NAV_ITEMS: HeaderNavItem[] = [
  {
    id: 'home',
    label: 'Главная',
    path: ROUTES.HOME,
  },
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
        isDividerAbove: true,
      },
    ],
  },
  {
    id: 'services-docs',
    label: 'Услуги и документы',
    path: ROUTES.DOCUMENTS,
    children: [
      {
        label: 'Консалтинг ISO',
        path: ROUTES.CONSULTATION_DEVELOPMENT,
        icon: 'verified_user',
      },
      {
        label: 'База регламентов СТО',
        path: ROUTES.DOCUMENTS,
        icon: 'description',
      },
      {
        label: 'В помощь менеджеру',
        path: ROUTES.MANAGER_HELP,
        icon: 'checklist',
      },
    ],
  },
  {
    id: 'company',
    label: 'О компании',
    path: ROUTES.ABOUT_US,
    children: [
      {
        label: 'Об учебном центре',
        path: ROUTES.ABOUT_US,
        icon: 'apartment',
      },
      {
        label: 'Новости и события',
        path: ROUTES.NEWS,
        icon: 'newspaper',
      },
      {
        label: 'Контакты',
        path: ROUTES.CONTACT,
        icon: 'mail',
      },
    ],
  },
];

export const PROFILE_MENU_ITEMS = [
  { label: 'Мои документы', path: ROUTES.DOCUMENTS, icon: 'description' },
  { label: 'Мои курсы', path: ROUTES.COURSES, icon: 'school' },
  { label: 'Профиль', path: ROUTES.PROFILE, icon: 'account_circle' },
];
