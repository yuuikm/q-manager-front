import { ROUTES } from './routes';

export interface MenuItem {
  label: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
  requiresAuth?: boolean;
}

export const MAIN_MENU: MenuItem[] = [
  {
    label: 'Главная',
    path: ROUTES.HOME,
  },
  {
    label: 'Учебный центр',
    path: '#',
    children: [
      {
        label: 'Об учебном центре',
        path: ROUTES.ABOUT_US,
      },
      {
        label: 'Онлайн курсы',
        path: ROUTES.COURSES_ONLINE,
      },
      {
        label: 'Офлайн курсы',
        path: ROUTES.COURSES_OFFLINE,
      },
      {
        label: 'Дистанционное обучение',
        path: ROUTES.COURSES_SELF,
      },
    ],
  },
  {
    label: 'Консультации',
    path: '#',
    children: [
      {
        label: 'Разработка и внедрение систем менеджмента',
        path: ROUTES.CONSULTATION_DEVELOPMENT,
      },
      {
        label: 'Внедрение Европейской Модели EFQM',
        path: ROUTES.CONSULTATION_EFQM,
      },
      {
        label: 'Улучшение систем менеджмента',
        path: ROUTES.CONSULTATION_IMPROVEMENT,
      },
      {
        label: 'Подготовка к сертификационному аудиту',
        path: ROUTES.CONSULTATION_AUDIT,
      },
    ],
  },
  {
    label: 'Новости',
    path: ROUTES.NEWS,
  },
  {
    label: 'Курсы',
    path: '#',
    children: [
      {
        label: 'Онлайн курсы',
        path: ROUTES.COURSES_ONLINE,
      },
      {
        label: 'Офлайн курсы',
        path: ROUTES.COURSES_OFFLINE,
      },
      {
        label: 'Дистанционное обучение',
        path: ROUTES.COURSES_SELF,
      },
    ],
  },
  {
    label: 'Помощь менеджеру',
    path: ROUTES.MANAGER_HELP,
  },
  {
    label: 'Платная документация',
    path: ROUTES.DOCUMENTS,
  },
  {
    label: 'Контакты',
    path: ROUTES.CONTACT,
  },
];

export const USER_MENU: MenuItem[] = [
  {
    label: 'Мои документы',
    path: ROUTES.DOCUMENTS,
    requiresAuth: true,
  },
  {
    label: 'Мои курсы',
    path: ROUTES.COURSES,
    requiresAuth: true,
  },
  {
    label: 'Профиль',
    path: ROUTES.PROFILE,
    requiresAuth: true,
  },
];

export const AUTH_MENU: MenuItem[] = [
  {
    label: 'Войти',
    path: ROUTES.LOGIN,
  },
  {
    label: 'Регистрация',
    path: ROUTES.REGISTER,
  },
];
