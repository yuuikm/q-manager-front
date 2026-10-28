import { ROUTES } from 'constants/routes';

export interface FallbackCourse {
  id: number;
  title: string;
  categoryName: string;
  description: string;
  price: number;
  durationHours: number;
  formatBadge: string;
  imageUrl: string;
}

export const COURSES_SECTION_HEADER = {
  tag: 'Каталог учебных программ',
  title: 'Курсы и программы сертификации',
  allCoursesLabel: 'Смотреть все курсы в каталоге',
  allCoursesPath: ROUTES.COURSES,
};

export const FALLBACK_COURSES: FallbackCourse[] = [
  {
    id: 1,
    title: 'Консультант по системам менеджмента ISO 9001, 14001, 45001',
    categoryName: 'Интегрированные системы (ИСМ)',
    description:
      'Комплексная методика построения, аудита и оптимизации интегрированных систем на предприятиях Республики Казахстан.',
    price: 50000,
    durationHours: 36,
    formatBadge: 'Zoom • Онлайн',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDVi570ACfWzXU5sgRC74MRGhZvD0v-40_75JfV9eraWRsv5WtqtcBadTbAfdf5RxR48I0-Cl4e3RtvtUhYH_JiWAMQU7CeAH59XZzhQOhlrGZt89skkphc3l0BlEemuJ8Xrh51DKhZvNUzCdBXsQWYsI_6g1XeF4qpcdjtWoE1T9wwIS8UqIAPD7hNqyIEyyQKjBtHbS1H77RhsDilV0Pg8gXT5xNIi0iRRqyYlgtFtxXbSWQXquPj',
  },
  {
    id: 2,
    title: 'Внутренний аудитор системы противодействия коррупции СМАК',
    categoryName: 'ISO 37001:2025',
    description:
      'Подготовка комплаенс-контролеров для проведения независимой антикоррупционной оценки согласно стандарту СТ РК ISO 37001.',
    price: 50000,
    durationHours: 32,
    formatBadge: 'Zoom • Онлайн',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDsfamPrr6pFd-xwviH2mi-r_GBqN_Qo8o4EByatl4FOr1GIelQxCyHjcryij3D-V05uoUzdpV1Ai8OiZftIBEgU3-QIRzlMIJmCfUMPt2zidIAKzPuuM8ElvbHR1YvOy_vTl4AHMDw4KCK58N3k9RmKpGtxYdv9CbkSSBnOdNogwBgA-2ERBSeyVhb6eaZ93plA8eQVBNZqZ82x8oCgGONGWkc_NV8bK6G6vEnfL3sCKjyLifpZkqy',
  },
  {
    id: 3,
    title: 'Европейская модель совершенства: Оценка зрелости процессов',
    categoryName: 'Модель EFQM',
    description:
      'Освоение европейской методологии непрерывного совершенствования для подготовки к национальной премии «Алтын Сапа».',
    price: 75000,
    durationHours: 48,
    formatBadge: 'Очно в Алматы',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDfJiroH2JgXXSvyvJMwmTp99_JjRrLgDMeVjztjCnXgRmR2lId8_cHQVo_ZO78CbfN_vrNRq1JSgBYe_zRu0s2cuUv1fr1W6vrPPbRN63gon99nCRjJrMe7Gv72xPZoMnA_QP0Q6xrN5qR4DRy5oIPBfAscoL8a_961JAkMqckdbr-NDHEPOv9fXWksJ0vYToO6weGY4_QZi8Ogso6tuB5ERRjFCbMA1UHea2O1PmVV3wnfmT-ar84',
  },
];
