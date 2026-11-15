import { ROUTES } from 'constants/routes';

export interface LearningFormatItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBgClass: string;
  iconTextClass: string;
  buttonClass: string;
  buttonLabel: string;
  path: string;
  features: string[];
}

export const LEARNING_FORMATS_HEADER = {
  tag: 'Форматы квалификационной подготовки',
  title: '3 формата профессионального обучения',
  subtitle:
    'Выберите оптимальный формат обучения персонала под регламент вашего предприятия с получением официального сертификата соответствия.',
};

export const LEARNING_FORMATS: LearningFormatItem[] = [
  {
    id: 'online',
    title: 'Онлайн (Zoom)',
    description:
      'Живые вебинары с ведущими аудиторами международного реестра. Интерактивный диалог, разбор реальных практических кейсов вашего бизнеса и совместные аудиторские практикумы.',
    icon: 'videocam',
    iconBgClass: 'bg-brand-100',
    iconTextClass: 'text-brand-700',
    buttonClass: 'bg-brand-700 text-white hover:bg-brand-800',
    buttonLabel: 'Программы онлайн-курсов',
    path: ROUTES.COURSES_ONLINE,
    features: [
      'Прямой эфир с разбором ваших вопросов',
      'Доступ к Full HD записям лекций',
      'Официальный сертификат с регистрацией',
    ],
  },
  {
    id: 'offline',
    title: 'Очные тренинги в аудиториях',
    description:
      'Занятия в оборудованном учебном центре в Алматы (ул. Байзакова 299) либо корпоративные выездные сессии на производство заказчика по Республике Казахстан.',
    icon: 'location_on',
    iconBgClass: 'bg-slate-200',
    iconTextClass: 'text-slate-800',
    buttonClass: 'bg-slate-900 text-white hover:bg-slate-800',
    buttonLabel: 'Программы оффлайн курсов',
    path: ROUTES.COURSES_OFFLINE,
    features: [
      'Глубокое погружение без отвлечений от работы',
      'Ролевые игры по процедуре внутреннего аудита',
      'Печатные раздаточные материалы и шаблоны',
    ],
  },
  {
    id: 'self-education',
    title: 'Дистанционно (24/7)',
    description:
      'Интерактивное самообучение на платформе в удобное время. Доступ к видеолекциям, нормативным материалам, электронному тестированию и сдаче экзамена со смартфона или ПК.',
    icon: 'devices',
    iconBgClass: 'bg-emerald-100',
    iconTextClass: 'text-emerald-800',
    buttonClass: 'bg-brand-700 text-white hover:bg-brand-800',
    buttonLabel: 'Программы дистанционных курсов',
    path: ROUTES.COURSES_SELF,
    features: [
      'Индивидуальный график прохождения модулей',
      'Круглосуточный доступ к учебной базе 6 месяцев',
      'Получение сертификата онлайн',
    ],
  },
];
