import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SkipToContent from './components/SkipToContent';
import LoadingState from './components/LoadingState';
import ConversionTracker from './components/ConversionTracker';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';
import { lazyWithRetry } from './utils/performanceUtils';

const Home = lazy(() => lazyWithRetry(() => import('./pages/Home')));
const About = lazy(() => lazyWithRetry(() => import('./pages/About')));
const Capabilities = lazy(() => lazyWithRetry(() => import('./pages/Capabilities')));
const Equipment = lazy(() => lazyWithRetry(() => import('./pages/Equipment')));
const Quality = lazy(() => lazyWithRetry(() => import('./pages/Quality')));
const Industries = lazy(() => lazyWithRetry(() => import('./pages/Industries')));
const Projects = lazy(() => lazyWithRetry(() => import('./pages/Projects')));
const CaseStudyDetail = lazy(() => lazyWithRetry(() => import('./pages/CaseStudyDetail')));
const ServiceLandingPage = lazy(() => lazyWithRetry(() => import('./pages/ServiceLandingPage')));
const Contact = lazy(() => lazyWithRetry(() => import('./pages/Contact')));
const RFQConfirmation = lazy(() => lazyWithRetry(() => import('./pages/RFQConfirmation')));
const RFQStatusLookup = lazy(() => lazyWithRetry(() => import('./pages/RFQStatusLookup')));
const AdditionalInfoUpload = lazy(() => lazyWithRetry(() => import('./pages/AdditionalInfoUpload')));
const AdminLogin = lazy(() => lazyWithRetry(() => import('./pages/AdminLogin')));
const AdminRFQDashboard = lazy(() => lazyWithRetry(() => import('./pages/AdminRFQDashboard')));
const AdminRFQProductionReadiness = lazy(() => lazyWithRetry(() => import('./pages/AdminRFQProductionReadiness')));
const AdminRFQOperationsCommandCenter = lazy(() => lazyWithRetry(() => import('./pages/AdminRFQOperationsCommandCenter')));
const LaunchChecklist = lazy(() => lazyWithRetry(() => import('./pages/LaunchChecklist')));
const AdminLaunchGoNoGoReview = lazy(() => lazyWithRetry(() => import('./pages/AdminLaunchGoNoGoReview')));
const AdminHandoffCenter = lazy(() => lazyWithRetry(() => import('./pages/AdminHandoffCenter')));
const AdminPostLaunchDashboard = lazy(() => lazyWithRetry(() => import('./pages/AdminPostLaunchDashboard')));
const AdminMobileBrowserQA = lazy(() => lazyWithRetry(() => import('./pages/AdminMobileBrowserQA')));
const AdminContentQAAudit = lazy(() => lazyWithRetry(() => import('./pages/AdminContentQAAudit')));
const AdminOwnerHandoff = lazy(() => lazyWithRetry(() => import('./pages/AdminOwnerHandoff')));
const AdminGoLiveCommandCenter = lazy(() => lazyWithRetry(() => import('./pages/AdminGoLiveCommandCenter')));
const AdminRealContentReplacement = lazy(() => lazyWithRetry(() => import('./pages/AdminRealContentReplacement')));
const AdminCaseStudyBuilder = lazy(() => lazyWithRetry(() => import('./pages/AdminCaseStudyBuilder')));
const AdminTestimonials = lazy(() => lazyWithRetry(() => import('./pages/AdminTestimonials')));

function PublicRoutes() {
  return (
    <Suspense fallback={<LoadingState message="Loading page…" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/capabilities" element={<Capabilities />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/quality" element={<Quality />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/projects/:slug" element={<CaseStudyDetail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/services/:slug" element={<ServiceLandingPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/rfq/confirmation" element={<RFQConfirmation />} />
        <Route path="/rfq/status" element={<RFQStatusLookup />} />
        <Route path="/rfq/additional-info/:token" element={<AdditionalInfoUpload />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <Suspense fallback={<LoadingState message="Loading application…" />}>
      <ConversionTracker />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin/rfqs" element={<AdminRFQDashboard />} />
          <Route path="/admin/rfq-readiness" element={<AdminRFQProductionReadiness />} />
          <Route path="/admin/rfq-operations" element={<AdminRFQOperationsCommandCenter />} />
          <Route path="/admin/launch-checklist" element={<LaunchChecklist />} />
          <Route path="/admin/launch-go-no-go" element={<AdminLaunchGoNoGoReview />} />
          <Route path="/admin/handoff" element={<AdminHandoffCenter />} />
          <Route path="/admin/post-launch" element={<AdminPostLaunchDashboard />} />
          <Route path="/admin/mobile-browser-qa" element={<AdminMobileBrowserQA />} />
          <Route path="/admin/content-qa" element={<AdminContentQAAudit />} />
          <Route path="/admin/owner-handoff" element={<AdminOwnerHandoff />} />
          <Route path="/admin/go-live" element={<AdminGoLiveCommandCenter />} />
          <Route path="/admin/real-content" element={<AdminRealContentReplacement />} />
          <Route path="/admin/case-studies" element={<AdminCaseStudyBuilder />} />
          <Route path="/admin/case-studies/:id" element={<AdminCaseStudyBuilder />} />
          <Route path="/admin/testimonials" element={<AdminTestimonials />} />
        </Route>

        <Route path="/admin" element={<Navigate to="/admin/rfqs" replace />} />

        <Route
          path="/*"
          element={
            <div className="flex min-h-screen flex-col">
              <SkipToContent />
              <div id="kc-live-region" className="sr-only" aria-live="polite" aria-atomic="true" />
              <Header />
              <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
                <PublicRoutes />
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
}
