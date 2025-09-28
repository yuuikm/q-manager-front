// libraries
import { type FC } from 'react';
import ContentPage from 'components/ContentPage';

const AuditConsultation: FC = () => {
  const sections = [
    {
      id: 'intro',
      type: 'paragraph' as const,
      title: 'Подготовка компании к сертификационному аудиту',
      content: 'Мы предоставляем комплексные услуги по подготовке организаций к прохождению сертификационного аудита. Наша команда экспертов поможет вам успешно пройти аудит и получить сертификацию по международным стандартам.'
    },
    {
      id: 'process',
      type: 'paragraph' as const,
      content: 'Подготовка к аудиту включает в себя полный цикл работ: от анализа готовности системы до сопровождения во время проведения аудита. Мы гарантируем высокое качество подготовки и успешное прохождение сертификации.'
    },
    {
      id: 'benefits',
      type: 'paragraph' as const,
      content: 'Сертификация по международным стандартам повышает конкурентоспособность организации, улучшает имидж компании и открывает новые возможности для развития бизнеса.'
    }
  ];

  const activities = [
    {
      title: 'Анализ готовности системы',
      description: 'Комплексная оценка готовности системы менеджмента к аудиту'
    },
    {
      title: 'Подготовка документации',
      description: 'Проверка и доработка всей необходимой документации'
    },
    {
      title: 'Обучение персонала',
      description: 'Подготовка персонала к взаимодействию с аудиторами'
    },
    {
      title: 'Внутренний аудит',
      description: 'Проведение внутреннего аудита для выявления несоответствий'
    },
    {
      title: 'Устранение несоответствий',
      description: 'Помощь в устранении выявленных несоответствий'
    },
    {
      title: 'Сопровождение аудита',
      description: 'Сопровождение процесса сертификационного аудита'
    }
  ];

  const missionContent = [
    'Мы обеспечиваем 100% готовность к сертификационному аудиту;',
    'Наши эксперты имеют многолетний опыт подготовки организаций;',
    'Мы работаем с ведущими сертификационными органами;',
    'Гарантируем успешное прохождение аудита с первого раза.'
  ];

  const contactInfo = {
    phone: '+7 (727) 274-93-92',
    email: 'audit@q-manager.kz',
    address: '050008, г.Алматы, ул.Байзакова, 299'
  };

  const missionSection = {
    id: 'mission',
    type: 'mission' as const,
    title: 'Бесплатная консультация',
    content: missionContent.join('\n')
  };

  const activitiesSection = {
    id: 'activities',
    type: 'activities' as const,
    title: 'Наши услуги по подготовке к аудиту',
    content: ''
  };

  const contactSection = {
    id: 'contact',
    type: 'contact' as const,
    title: 'Остались Вопросы?',
    subtitle: 'Задайте Ваш вопрос',
    content: 'Свяжитесь с нами!'
  };

  const allSections = [
    ...sections,
    activitiesSection,
    missionSection,
    contactSection
  ];

  return (
    <ContentPage
      heroTitle="Подготовка компании к сертификационному аудиту"
      heroSubtitle="Комплексная подготовка к успешному прохождению аудита"
      heroImage="https://images.unsplash.com/photo-1504711331083-9c895941bf81?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      sections={allSections}
      activities={activities}
      contactInfo={contactInfo}
      backgroundColor="bg-gray-50"
    />
  );
};

export default AuditConsultation;
