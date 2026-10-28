export interface HeroStatItem {
  id: string;
  value: string;
  label: string;
  icon: string;
}

export interface FallbackSlideItem {
  id: number;
  badge: {
    text: string;
    icon?: string;
    variant: 'brand' | 'amber' | 'emerald';
  };
  title: string;
  description: string;
  primaryButton: {
    label: string;
    href: string;
    icon?: string;
  };
  secondaryButton?: {
    label: string;
    href: string;
    icon?: string;
  };
  image: string;
  caption: string;
}

export const HERO_STATS: HeroStatItem[] = [
  {
    id: 'experience',
    value: '15+ лет',
    label: 'Экспертного опыта в РК',
    icon: 'history_edu',
  },
  {
    id: 'students',
    value: '4 500+',
    label: 'Обученных специалистов',
    icon: 'school',
  },
  {
    id: 'audits',
    value: '98%',
    label: 'Успешных внешних аудитов',
    icon: 'verified',
  },
  {
    id: 'regulations',
    value: '120+',
    label: 'Регламентов и СТО',
    icon: 'assignment',
  },
];

export const FALLBACK_SLIDES: FallbackSlideItem[] = [
  {
    id: 1,
    badge: {
      text: 'Аккредитованный центр ISO & Модель EFQM в Казахстане',
      variant: 'brand',
    },
    title: 'Международная сертификация ISO & Модель EFQM',
    description:
      'Комплексная подготовка специалистов и аудит систем менеджмента от официального аккредитованного центра ТОО «Интерсертифика Консалтинг Казахстан». Официальные квалификационные сертификаты.',
    primaryButton: {
      label: 'Выбрать направление обучения',
      href: '#courses-catalog',
      icon: 'arrow_forward',
    },
    secondaryButton: {
      label: 'Получить консультацию',
      href: '#callback-block',
      icon: 'support_agent',
    },
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDYtTp_Fmq7uMxI3ICMkTAMx-vPeFis7vCJIwzj-ZZupRrExFqSbtNop60N1I_vbpQ-_B6KUeK7EAsF_5asmC6Jp6qEGDoFzbipggyW9SZTVSHULbvyAZtIHDbVhioIa9Q4_xgIsQdte3UJfwN0ZNxxoCzfEjktP9J3gH3GA9nqcZ1kKI2XVQRm28nbN67jbH5JVW5ln1ggI99fXgZyhXkd8_OAUhmuMkSTG0Z36AVCVMXNElIbEGXx',
    caption: 'Выдача сертификатов национального и международного образца',
  },
  {
    id: 2,
    badge: {
      text: 'Выездные и аудиторные интенсивы',
      icon: 'groups',
      variant: 'amber',
    },
    title: 'Корпоративное обучение ISO 9001, 14001, 45001',
    description:
      'Очные выездные тренинги на вашем производственном объекте или в оснащенных классах в центре Алматы (ул. Байзакова 299). Корпоративным группам от 3 человек — специальная скидка 15%.',
    primaryButton: {
      label: 'Очные программы и график',
      href: '/courses/offline',
      icon: 'calendar_month',
    },
    secondaryButton: {
      label: 'Запросить расчет со скидкой 15%',
      href: '#callback-block',
    },
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDVi570ACfWzXU5sgRC74MRGhZvD0v-40_75JfV9eraWRsv5WtqtcBadTbAfdf5RxR48I0-Cl4e3RtvtUhYH_JiWAMQU7CeAH59XZzhQOhlrGZt89skkphc3l0BlEemuJ8Xrh51DKhZvNUzCdBXsQWYsI_6g1XeF4qpcdjtWoE1T9wwIS8UqIAPD7hNqyIEyyQKjBtHbS1H77RhsDilV0Pg8gXT5xNIi0iRRqyYlgtFtxXbSWQXquPj',
    caption: 'Практические воркшопы под специфику предприятия',
  },
  {
    id: 3,
    badge: {
      text: 'Готовая нормативная база и СТО',
      icon: 'file_download_done',
      variant: 'emerald',
    },
    title: 'База готовых регламентов, СТО и процедур СМК/ХАССП',
    description:
      'Быстрое внедрение нормативной документации без переплат аудиторам. Шаблоны, матрицы рисков и стандарты предприятия для успешного прохождения проверок Самрук-Қазына и инспекций.',
    primaryButton: {
      label: 'Перейти в магазин регламентов',
      href: '#docs-market',
      icon: 'description',
    },
    secondaryButton: {
      label: 'Скачать бесплатные образцы',
      href: '#manager-help',
    },
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDKsKC2k4WhbgsAjS3E9ex0MYO9B9VCI57Q1OX0CTlEdq99qWJ1EOKTEyAgjmEbDd9Or3iB2F59Ju4oM7eJfeu7J-HdSRkInluB_xsgra7USwwr3YJfAq-Jv0eZH6mt3yptg5p2TRBs8T_GKa_EhH59fpJmPD0w8SRFlcTqy0Yq1RMowPrLeVIpYwe6evHo5bxAhQTyN0U5ym4cinyzBlNK7j9g_QJhqEETgx0KhB6jOmGiwmwZlchW',
    caption: 'Более 120 актуальных типовых стандартов организации',
  },
];
