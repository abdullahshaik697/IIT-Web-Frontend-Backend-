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

// Admin Imports
import AdminLayout from './admin/layouts/MainLayout';
import DashboardPage from './admin/pages/DashboardPage';
import AdmissionPage from './admin/pages/AdmissionPage';
import EnrolledPage from './admin/pages/EnrolledPage';
import CertificateGeneratorPage from './admin/pages/CertificateGeneratorPage';
import FeeChallanGenerator from './admin/pages/FeeChallanGenerator';
import VerifyFeePage from './admin/pages/VerifyFeePage';
import AdminLogin from './admin/pages/AdminLogin';
import AdminCoursesPage from './admin/pages/AdminCoursesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Login Route (No Layout) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* User Routes */}
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

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="courses" element={<AdminCoursesPage />} />
          <Route path="admissions" element={<AdmissionPage />} />
          <Route path="enrolled" element={<EnrolledPage />} />
          <Route path="certificates" element={<CertificateGeneratorPage />} />
          <Route path="fees" element={<FeeChallanGenerator />} />
          <Route path="verify-fee" element={<VerifyFeePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
