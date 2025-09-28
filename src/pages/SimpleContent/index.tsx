// libraries
import { type FC } from 'react';
import ContentPage from 'components/ContentPage';

const SimpleContent: FC = () => {
  // Example of a simple content page with just text sections
  const sections = [
    {
      id: 'intro',
      type: 'paragraph' as const,
      title: 'Добро пожаловать',
      content: 'Это пример простой страницы с контентом. Вы можете легко изменить заголовок, текст и другие элементы.'
    },
    {
      id: 'main-content',
      type: 'paragraph' as const,
      content: 'Здесь может быть любой текст, который вы хотите отобразить. Компонент автоматически форматирует его и применяет соответствующие стили.'
    },
    {
      id: 'conclusion',
      type: 'paragraph' as const,
      title: 'Заключение',
      content: 'Этот компонент очень гибкий и позволяет создавать различные типы страниц с минимальными усилиями.'
    }
  ];

  return (
    <ContentPage
      heroTitle="Простая страница"
      heroSubtitle="Пример использования компонента ContentPage"
      sections={sections}
      backgroundColor="bg-white"
    />
  );
};

export default SimpleContent;
