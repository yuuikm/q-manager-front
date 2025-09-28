// libraries
import { type FC } from 'react';
import ContentPage from 'components/ContentPage';

const EFQMConsultation: FC = () => {
  const sections = [
    {
      id: 'intro',
      type: 'paragraph' as const,
      title: 'Внедрение Европейской Модели EFQM',
      content: 'Предлагаем инновационный инструмент управления компаний – Систему менеджмента интегрированную с Европейской Моделью Совершенства EFQM, которая развивает, улучшает системы менеджмента и будучи внедренной и действующей, позволит выйти вашей компании на новый уровень.'
    },
    {
      id: 'benefits',
      type: 'paragraph' as const,
      content: 'Оценивание деятельности компании в целом, а так же деятельности отдельно взятого подразделения, унификация всех процессов организации, их согласованное действие, своевременное выявление и устранение недостатков будут способствовать улучшению видения бизнеса. Это, безусловно, повысит степень доверия потребителей и всех заинтересованных сторон.'
    },
    {
      id: 'approach',
      type: 'paragraph' as const,
      content: 'Модель совершенствования требует улучшения управления компании с помощью повышения его уровня, чтобы гарантировать, что выпускаемая продукция и предоставляемые услуги соответствуют запросам общества. Основой успеха данного подхода могут послужить бенчмаркинг, обучение и повышение квалификации.'
    }
  ];

  const activities = [
    {
      title: 'Оценка текущего состояния',
      description: 'Комплексная диагностика системы менеджмента и процессов организации'
    },
    {
      title: 'Внедрение модели совершенства',
      description: 'Интеграция EFQM модели в существующую систему управления'
    },
    {
      title: 'Унификация процессов',
      description: 'Согласование и оптимизация всех организационных процессов'
    },
    {
      title: 'Обучение персонала',
      description: 'Повышение квалификации сотрудников в области модели совершенства'
    },
    {
      title: 'Бенчмаркинг',
      description: 'Сравнение с лучшими практиками и внедрение улучшений'
    },
    {
      title: 'Мониторинг результатов',
      description: 'Постоянная оценка результативности и корректировка процессов'
    }
  ];

  const missionContent = [
    'Определите, как успешно функционирует система менеджмента Вашей организации;',
    'В любое время оцените результативность деятельности отдельно взятого подразделения;',
    'Получите обратную связь о результатах работы вашей организации;',
    'Внедрите в организации культуру устойчивого превосходства;',
    'Развейте людей в духе моделей превосходства.'
  ];

  const contactInfo = {
    phone: '+7 (727) 274-93-92',
    email: 'efqm@q-manager.kz',
    address: '050008, г.Алматы, ул.Байзакова, 299'
  };

  const missionSection = {
    id: 'mission',
    type: 'mission' as const,
    title: 'Что вы получите',
    content: missionContent.join('\n')
  };

  const activitiesSection = {
    id: 'activities',
    type: 'activities' as const,
    title: 'Наши услуги по внедрению EFQM',
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
      heroTitle="Внедрение Европейской Модели EFQM"
      heroSubtitle="Инновационный инструмент управления для достижения совершенства"
      heroImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      sections={allSections}
      activities={activities}
      contactInfo={contactInfo}
      backgroundColor="bg-gray-50"
    />
  );
};

export default EFQMConsultation;
