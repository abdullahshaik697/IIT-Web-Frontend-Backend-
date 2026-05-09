import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../src/user/layouts/MainLayout';
import Home from '../src/user/pages/Home';
import AboutPage from '../src/user/pages/AboutUs';
import CoursesPage from '../src/user/pages/Courses';
import ContactPage from '../src/user/pages/ContactUs';
import TestimonialsPage from '../src/user/pages/SuccessStories';
import AdmissionForm from './user/components/AdmissionForm';
import CertificateVerification from './user/components/CertificateVerification';
import  DonateUs from '../src/user/pages/DonateUs';
import  Event from '../src/user/pages/Event';
import NotFound from '../src/user/pages/NotFound';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home/>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/admission" element={<AdmissionForm />} />
          <Route path="/certificate-verification" element={<CertificateVerification />} />
          <Route path="/donate" element={<DonateUs/>} />
          <Route path="/events" element={<Event/>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
