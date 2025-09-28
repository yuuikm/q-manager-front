// libraries
import { type FC } from 'react';
import ContentPage from 'components/ContentPage';

const Contact: FC = () => {
  const sections = [
    {
      id: 'intro',
      type: 'paragraph' as const,
      title: 'Наши контакты',
      content: 'Мы всегда готовы ответить на ваши вопросы и предоставить необходимую информацию. Свяжитесь с нами любым удобным для вас способом.'
    }
  ];

  const activities = [
    {
      title: 'Дистанционное обучение',
      description: 'Современные онлайн-курсы и тренинги для повышения квалификации персонала'
    },
    {
      title: 'Оффлайн обучение',
      description: 'Традиционные очные курсы и семинары в наших учебных центрах'
    },
    {
      title: 'Онлайн обучение',
      description: 'Интерактивные вебинары и live-сессии с экспертами'
    },
    {
      title: 'Разработка и внедрение систем менеджмента',
      description: 'Полный цикл работ по созданию и внедрению систем менеджмента качества'
    },
    {
      title: 'Внедрение Европейской Модели EFQM',
      description: 'Помощь в внедрении модели совершенства EFQM для повышения конкурентоспособности'
    },
    {
      title: 'Улучшение систем менеджмента',
      description: 'Аудит и оптимизация существующих систем менеджмента'
    },
    {
      title: 'Подготовка компании к сертификационному аудиту',
      description: 'Комплексная подготовка организации к прохождению сертификационного аудита'
    }
  ];

  const missionContent = [
    'Мы предоставляем профессиональные услуги в области менеджмента качества;',
    'Наша команда состоит из сертифицированных экспертов с многолетним опытом;',
    'Мы гарантируем индивидуальный подход к каждому клиенту;',
    'Бесплатная консультация для всех новых клиентов.'
  ];

  const contactInfo = {
    phone: '+7 (727) 274-93-92',
    email: 'info@standard.kz',
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
    title: 'Наши услуги',
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
      heroTitle="Контакты"
      heroSubtitle="Свяжитесь с нами для получения профессиональных консультаций"
      heroImage="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      sections={allSections}
      activities={activities}
      contactInfo={contactInfo}
      backgroundColor="bg-gray-50"
    />
  );
};

export default Contact;
