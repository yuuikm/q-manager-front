import { Route, Routes } from 'react-router-dom';
import Home from 'pages/Home';
import { ROUTES } from 'constants/routes';
import Login from 'pages/Login';
import Register from 'pages/Register';
import Profile from 'pages/Profile';
import Documents from 'pages/Documents';
import DocumentDetail from 'pages/DocumentDetail';
import News from 'pages/News';
import NewsDetail from 'pages/NewsDetail';
import Courses from 'pages/Courses';
import CourseDetail from 'pages/CourseDetail';
import LearnCourse from 'pages/LearnCourse';
import Checkout from 'pages/Checkout';
import About from 'pages/About';
import Contact from 'pages/Contact';
import DevelopmentConsultation from 'pages/Consultation/Development';
import EFQMConsultation from 'pages/Consultation/EFQM';
import ImprovementConsultation from 'pages/Consultation/Improvement';
import AuditConsultation from 'pages/Consultation/Audit';
import ManagerHelp from 'pages/ManagerHelp';
import ManagerHelpDetail from 'pages/ManagerHelpDetail';
import SubcategoryDetail from 'pages/SubcategoryDetail';
import CertificatePage from 'pages/Certificate';

function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.PROFILE} element={<Profile />} />
      <Route path={ROUTES.DOCUMENTS} element={<Documents />} />
      <Route path={ROUTES.SUBCATEGORY_DETAIL} element={<SubcategoryDetail />} />
      <Route path={ROUTES.DOCUMENT_DETAIL} element={<DocumentDetail />} />
      <Route path={ROUTES.NEWS} element={<News />} />
      <Route path={ROUTES.NEWS_DETAIL} element={<NewsDetail />} />
      <Route path={ROUTES.COURSES} element={<Courses />} />
      <Route path={ROUTES.COURSES_ONLINE} element={<Courses type="online" />} />
      <Route path={ROUTES.COURSES_OFFLINE} element={<Courses type="offline" />} />
      <Route path={ROUTES.COURSES_SELF} element={<Courses type="self_learning" />} />
      <Route path={ROUTES.COURSE_DETAIL} element={<CourseDetail />} />
      <Route path={ROUTES.LEARN_COURSE} element={<LearnCourse />} />
      <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
      <Route path={ROUTES.ABOUT_US} element={<About />} />
      <Route path={ROUTES.CONTACT} element={<Contact />} />
      <Route path={ROUTES.CONSULTATION_DEVELOPMENT} element={<DevelopmentConsultation />} />
      <Route path={ROUTES.CONSULTATION_EFQM} element={<EFQMConsultation />} />
      <Route path={ROUTES.CONSULTATION_IMPROVEMENT} element={<ImprovementConsultation />} />
      <Route path={ROUTES.CONSULTATION_AUDIT} element={<AuditConsultation />} />
      <Route path={ROUTES.MANAGER_HELP} element={<ManagerHelp />} />
      <Route path={ROUTES.MANAGER_HELP_DETAIL} element={<ManagerHelpDetail />} />
      <Route path={ROUTES.CERTIFICATE} element={<CertificatePage />} />
    </Routes>
  );
}

export default App;
