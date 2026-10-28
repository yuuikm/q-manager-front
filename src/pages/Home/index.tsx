import { useState } from 'react';
import Slider from 'pages/Home/Slider';
import LearningFormats from 'pages/Home/LearningFormats';
import Courses from 'pages/Home/Courses';
import Documents from 'pages/Home/Documents';
import ManagerHelp from 'pages/Home/ManagerHelp';
import Partners from 'pages/Home/Partners';
import About from 'pages/Home/About';
import Testimonials from 'pages/Home/Testimonials';
import News from 'pages/Home/News';
import Faq from 'pages/Home/Faq';
import CallbackBlock from 'pages/Home/CallbackBlock';

import PreviewModal from 'components/shared/PreviewModal';
import EnrollModal from 'components/shared/EnrollModal';
import Toast from 'components/shared/Toast';

function Home() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{ title: string; standard: string } | null>(null);
  const [enrollCourseTitle, setEnrollCourseTitle] = useState<string | null>(null);

  const handlePreviewDocument = (title: string, standard: string) => {
    setPreviewDoc({ title, standard });
  };

  const handleEnrollCourse = (courseTitle: string) => {
    setEnrollCourseTitle(courseTitle);
  };

  const handleLeadSuccess = (msg: string) => {
    setToastMessage(msg);
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Promo Slider with Key Statistics */}
      <Slider />

      {/* 2. 3 Formats of Professional Training */}
      <LearningFormats />

      {/* 3. Courses & Certification Programs */}
      <Courses onEnroll={handleEnrollCourse} />

      {/* 4. Documents & Standard Procedures Market */}
      <Documents
        onPreview={handlePreviewDocument}
        onBuy={(_, title) => setToastMessage(`Переход к оформлению «${title}»`)}
      />

      {/* 5. In Help to Quality Manager (Free Checklists & Matrices) */}
      <ManagerHelp />

      {/* 6. Trusted Partners */}
      <Partners />

      {/* 7. About Company & Consulting Audit Stages */}
      <About />

      {/* 8. Participant & Client Reviews */}
      <Testimonials />

      {/* 9. News & Standards Updates */}
      <News />

      {/* 10. Frequently Asked Questions */}
      <Faq />

      {/* 11. Consultation & Audit Request Lead Block */}
      <CallbackBlock onLeadSuccess={handleLeadSuccess} />

      {/* Modals & Feedback */}
      <PreviewModal
        isOpen={!!previewDoc}
        title={previewDoc?.title || ''}
        standard={previewDoc?.standard || ''}
        onClose={() => setPreviewDoc(null)}
      />

      <EnrollModal
        isOpen={!!enrollCourseTitle}
        courseTitle={enrollCourseTitle || ''}
        onClose={() => setEnrollCourseTitle(null)}
        onSuccess={(msg) => setToastMessage(msg)}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}

export default Home;
