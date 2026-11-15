export interface AuditStageItem {
  number: number;
  title: string;
  description: string;
  isCompletedStatus?: boolean;
}

export interface CompanyHighlight {
  id: string;
  title: string;
  description: string;
}

export const ABOUT_HEADER = {
  tag: 'О компании & Аккредитация',
  title: 'ТОО «ИнтерСерт Консалтинг ЦентрАзия»',
  description:
    'Мы обеспечиваем экспертную подготовку предприятий к прохождению сертификационного аудита систем качества, экологии и промышленной безопасности. Все программы разработаны с учетом стандартов СТ РК, ISO и регламентов фонда «Самрук-Қазына».',
};

export const COMPANY_HIGHLIGHTS: CompanyHighlight[] = [
  {
    id: 'qr-verification',
    title: 'QR-верификация дипломов',
    description:
      'Каждый сертификат аудитора вносится в реестр центра с мгновенным подтверждением по защищенному QR-коду.',
  },
  {
    id: 'efqm-license',
    title: 'Лицензия EFQM',
    description:
      'Официальные эксперты европейской модели делового совершенства для участников премии «Алтын Сапа».',
  },
];

export const AUDIT_STAGES: AuditStageItem[] = [
  {
    number: 1,
    title: 'Диагностический GAP-аудит',
    description: 'Анализ текущего состояния процессов и выявление несоответствий.',
  },
  {
    number: 2,
    title: 'Обучение персонала и аудиторов',
    description: 'Практические тренинги для рабочей группы предприятия.',
  },
  {
    number: 3,
    title: 'Разработка регламентов и СТО',
    description: 'Создание процедур, карт процессов и политик качества.',
  },
  {
    number: 4,
    title: 'Успешный сертификационный аудит',
    description: 'Сопровождение при проверке органом по сертификации.',
    isCompletedStatus: true,
  },
];
