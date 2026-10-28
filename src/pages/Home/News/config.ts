import { ROUTES } from 'constants/routes';

export interface FallbackNewsItem {
  id: number;
  date: string;
  title: string;
  description: string;
}

export const NEWS_SECTION_HEADER = {
  tag: 'События и стандартизация',
  title: 'Новости и изменения стандартов',
  allNewsLabel: 'Все новости',
  allNewsPath: ROUTES.NEWS,
};

export const FALLBACK_NEWS: FallbackNewsItem[] = [
  {
    id: 1,
    date: '12 мая 2025',
    title: 'Обновление требований ISO 37001 для участников квазигосударственного сектора',
    description:
      'Разъяснения экспертов ТОО «Интерсертифика» по внедрению комплаенс-контроля.',
  },
  {
    id: 2,
    date: '28 апреля 2025',
    title: 'Старт весеннего набора в группы обучения аудиторов СМК в Алматы',
    description:
      'Открыта предварительная регистрация на очные интенсивы по ISO 9001 и ISO 14001.',
  },
  {
    id: 3,
    date: '15 апреля 2025',
    title: 'В базу регламентов добавлены 14 новых типовых процедур по ХАССП',
    description:
      'Готовые формы документов для предприятий пищевой промышленности и общепита.',
  },
];
