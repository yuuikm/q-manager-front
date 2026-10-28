export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarBgClass: string;
  rating: number;
  quote: string;
}

export const TESTIMONIALS_HEADER = {
  tag: 'Опыт участников',
  title: 'Отзывы выпускников и партнеров',
};

export const TESTIMONIALS_LIST: TestimonialItem[] = [
  {
    id: 'sanat-kubanov',
    name: 'Санат Кубанов',
    role: 'Инженер по качеству • ТОО «TenjoTranzit»',
    initials: 'СК',
    avatarBgClass: 'bg-brand-700',
    rating: 5,
    quote:
      '«Курс просто замечательный. Преподаватель очень доступно и понятно всё объясняет. Приводит различные примеры. Чувствительно, что всё объясняют человеческим, не замудрённым языком. С удовольствием прошёл бы ещё раз.»',
  },
  {
    id: 'asel-baytursynova',
    name: 'Асель Байтурсынова',
    role: 'Руководитель комплаенс-отдела',
    initials: 'АБ',
    avatarBgClass: 'bg-brand-600',
    rating: 5,
    quote:
      '«Готовили документацию по ISO 37001 для тендера. За 3 дня закрыли все нестыковки благодаря готовым регламентам Q-Manager и консультации аудитора. Проверку прошли с первого раза без единого замечания.»',
  },
  {
    id: 'erlan-zhakupov',
    name: 'Ерлан Жакупов',
    role: 'Директор по охране труда и экологии',
    initials: 'ЕЖ',
    avatarBgClass: 'bg-emerald-700',
    rating: 5,
    quote:
      '«Дистанционный формат на LMS превзошел ожидания: видеоуроки сняты на высшем уровне, тесты глубокие, а не формальные. Сертификат внутреннего аудитора прислали почтой с защитными знаками.»',
  },
];
