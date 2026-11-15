import { ROUTES } from 'constants/routes';

export interface FallbackDocument {
  id: number;
  title: string;
  description?: string;
  standard: string;
  fileFormat: string;
  fileName: string;
  fileSizeText: string;
  price: number;
}

export const DOCUMENTS_SECTION_HEADER = {
  tag: 'Магазин готовых процедур и СТО',
  title: 'База регламентов и шаблонов СМК',
  subtitle: 'Официальные формы и методические указания в DOCX/PDF для быстрого внедрения.',
  allDocsLabel: 'Вся база документов (120+ файлов)',
  allDocsPath: ROUTES.DOCUMENTS,
};

export const FALLBACK_DOCUMENTS: FallbackDocument[] = [
  {
    id: 1,
    title: 'Документированная процедура: Анализ СМБПП со стороны руководства',
    description: 'Официальный регламент проведения анализа системы безопасности пищевой продукции с протоколом совещания и формой отчета.',
    standard: 'ISO 22000 / HACCP',
    fileFormat: 'DOCX + PDF',
    fileName: 'analiz-smbpp-rukovodstvo.docx',
    fileSizeText: '340 КБ',
    price: 5000,
  },
  {
    id: 2,
    title: 'Методические указания: Идентификация, оценка и управление рисками СМК',
    description: 'Практическая методика с матрицей рисков 5х5, реестром возможностей и планом предупреждающих корректирующих действий.',
    standard: 'ISO 9001:2015',
    fileFormat: 'DOCX + XLS',
    fileName: 'ocenka-upravlenie-riskami.docx',
    fileSizeText: '620 КБ',
    price: 5000,
  },
  {
    id: 3,
    title: 'Документированная процедура: Выполнение антикоррупционных обязательств',
    description: 'Комплект документов антикоррупционного комплаенс-контроля: политика подарков, проверка деловых партнеров и журнал инцидентов.',
    standard: 'ISO 37001:2025',
    fileFormat: 'DOCX + PDF',
    fileName: 'anticorrupt-obyazatelstva.docx',
    fileSizeText: '480 КБ',
    price: 5000,
  },
];
