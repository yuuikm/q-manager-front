// libraries
import { type FC } from 'react';
import ContentPage from 'components/ContentPage';

const ImprovementConsultation: FC = () => {
  const sections = [
    {
      id: 'intro',
      type: 'paragraph' as const,
      title: 'Улучшение систем менеджмента',
      content: 'Мы специализируемся на оказании помощи по реанимированию разработанных систем менеджмента. Если вы имеете разработанную систему и она не дает положительных результатов, мы поможем вам улучшить или реанимировать вашу систему.'
    },
    {
      id: 'approach',
      type: 'paragraph' as const,
      content: 'Наш подход основан на глубоком анализе существующих процессов и выявлении узких мест. Мы используем проверенные методологии для оптимизации систем менеджмента и достижения максимальной эффективности.'
    }
  ];

  const activities = [
    {
      title: 'Анализ документации МС',
      description: 'Проведение детального анализа существующей документации системы менеджмента'
    },
    {
      title: 'Обучение специалистов',
      description: 'Проведение обучения специалистов для повышения их квалификации'
    },
    {
      title: 'Идентификация процессов',
      description: 'Выявление и документирование всех ключевых процессов предприятия'
    },
    {
      title: 'Оптимизация процессов',
      description: 'Улучшение и оптимизация существующих бизнес-процессов'
    },
    {
      title: 'Перестройка процессов',
      description: 'Перестройка процессов исходя из целей и политики в области систем менеджмента'
    },
    {
      title: 'Мониторинг и контроль',
      description: 'Внедрение системы мониторинга и контроля эффективности процессов'
    }
  ];

  const missionContent = [
    'Мы реанимируем неэффективные системы менеджмента;',
    'Проводим глубокий анализ существующих процессов;',
    'Обучаем персонал современным методам управления;',
    'Гарантируем значительное улучшение показателей эффективности.'
  ];

  const contactInfo = {
    phone: '+7 (727) 274-93-92',
    email: 'improvement@q-manager.kz',
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
    title: 'Наши услуги по улучшению систем',
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
      heroTitle="Улучшение систем менеджмента"
      heroSubtitle="Реанимируем и оптимизируем ваши системы управления"
      heroImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      sections={allSections}
      activities={activities}
      contactInfo={contactInfo}
      backgroundColor="bg-gray-50"
    />
  );
};

export default ImprovementConsultation;
