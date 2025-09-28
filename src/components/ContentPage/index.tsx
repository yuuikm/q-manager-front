// libraries
import { type FC } from 'react';

// Types
interface ContentSection {
  id: string;
  title?: string;
  subtitle?: string;
  content?: string;
  type: 'paragraph' | 'mission' | 'values' | 'activities' | 'contact';
}

interface ActivityItem {
  title: string;
  description: string;
}

interface ValueItem {
  title: string;
  description: string;
  points?: string[];
}

interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
}

interface ContentPageProps {
  heroTitle: string;
  heroSubtitle?: string;
  heroImage?: string;
  sections: ContentSection[];
  activities?: ActivityItem[];
  values?: ValueItem[];
  contactInfo?: ContactInfo;
  backgroundColor?: string;
}

const ContentPage: FC<ContentPageProps> = ({
  heroTitle,
  heroSubtitle,
  heroImage,
  sections,
  activities,
  values,
  contactInfo,
  backgroundColor = 'bg-gray-50'
}) => {
  const renderSection = (section: ContentSection) => {
    switch (section.type) {
      case 'paragraph':
        return (
          <div key={section.id} className="mb-8">
            {section.title && (
              <h2 className="text-2xl font-bold mb-4 text-blue-600">
                {section.title}
              </h2>
            )}
            {section.subtitle && (
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {section.subtitle}
              </h3>
            )}
            {section.content && (
              <p className="text-gray-700 leading-relaxed">
                {section.content}
              </p>
            )}
          </div>
        );

      case 'mission':
        return (
          <div key={section.id} className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-blue-600">
              {section.title}
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <ul className="space-y-4">
                {section.content && section.content.split('\n').map((point, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{point.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'values':
        return (
          <div key={section.id} className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-blue-600">
              {section.title}
            </h2>
            {values && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {values.map((value, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">
                      {value.title}
                    </h3>
                    <p className="text-gray-700 mb-4">{value.description}</p>
                    {value.points && (
                      <ul className="space-y-2">
                        {value.points.map((point, pointIndex) => (
                          <li key={pointIndex} className="flex items-start">
                            <svg
                              className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-gray-600 text-sm">{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'activities':
        return (
          <div key={section.id} className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-blue-600">
              {section.title}
            </h2>
            {activities && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">
                      {activity.title}
                    </h3>
                    <p className="text-gray-700">{activity.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'contact':
        return (
          <div key={section.id} className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-blue-600">
              {section.title}
            </h2>
            <div className="bg-blue-600 text-white p-8 rounded-lg">
              <div className="max-w-2xl">
                <h3 className="text-xl font-semibold mb-4">
                  {section.subtitle}
                </h3>
                {section.content && <p className="mb-6">{section.content}</p>}
                
                {contactInfo && (
                  <div className="space-y-3">
                    {contactInfo.phone && (
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span>{contactInfo.phone}</span>
                      </div>
                    )}
                    {contactInfo.email && (
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span>{contactInfo.email}</span>
                      </div>
                    )}
                    {contactInfo.address && (
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>{contactInfo.address}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div key={section.id} className="mb-8">
            {section.content && (
              <p className="text-gray-700 leading-relaxed">
                {section.content}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${backgroundColor}`}>
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        {heroImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
        )}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {heroTitle}
            </h1>
            {heroSubtitle && (
              <p className="text-xl md:text-2xl opacity-90">
                {heroSubtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {sections.map(renderSection)}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContentPage;
