import { ROUTES } from 'constants/routes';

export interface ManagerHelpItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBgClass: string;
  iconColorClass: string;
  actionLabel: string;
  actionIcon: string;
  path: string;
}

export const MANAGER_HELP_HEADER = {
  tag: 'База знаний и шаблонов',
  title: 'В помощь менеджеру по качеству',
  subtitle:
    'Бесплатные нормативные материалы, чек-листы аудита и типовые классификаторы для практической работы.',
  allLinkText: 'Все материалы раздела',
  allLinkPath: ROUTES.MANAGER_HELP,
};

export const MANAGER_HELP_ITEMS: ManagerHelpItem[] = [
  {
    id: 'checklist-iso9001',
    title: 'Чек-лист внутреннего аудита ISO 9001:2015',
    description:
      'Полный опросник для проверки подразделений предприятия перед внешним инспекционным контролем.',
    icon: 'checklist',
    iconBgClass: 'bg-brand-50',
    iconColorClass: 'text-brand-700',
    actionLabel: 'Скачать PDF бесплатно',
    actionIcon: 'download',
    path: ROUTES.MANAGER_HELP,
  },
  {
    id: 'matrix-risk',
    title: 'Матрица рисков и возможностей СМК',
    description:
      'Готовая таблица Excel с расчетными формулами вероятности и последствий рисков (п. 6.1 ISO 9001).',
    icon: 'analytics',
    iconBgClass: 'bg-emerald-50',
    iconColorClass: 'text-emerald-700',
    actionLabel: 'Скачать XLS шаблон',
    actionIcon: 'download',
    path: ROUTES.MANAGER_HELP,
  },
  {
    id: 'glossary',
    title: 'Глоссарий терминов СТ РК & ISO',
    description:
      'Справочник ключевых определений менеджмента качества, экологии и охраны труда на трех языках.',
    icon: 'menu_book',
    iconBgClass: 'bg-amber-50',
    iconColorClass: 'text-amber-700',
    actionLabel: 'Читать онлайн',
    actionIcon: 'arrow_forward',
    path: ROUTES.MANAGER_HELP,
  },
  {
    id: 'samruk-guide',
    title: 'Гайд по аудитам Самрук-Қазына',
    description:
      'Пошаговое руководство по подтверждению квалификационных требований в государственных закупках.',
    icon: 'fact_check',
    iconBgClass: 'bg-purple-50',
    iconColorClass: 'text-purple-700',
    actionLabel: 'Открыть инструкцию',
    actionIcon: 'arrow_forward',
    path: ROUTES.MANAGER_HELP,
  },
];
