import { useLocation, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Capabilities from './pages/Capabilities';
import Equipment from './pages/Equipment';
import Quality from './pages/Quality';
import Industries from './pages/Industries';
import Contact from './pages/Contact';
import AdminRFQDashboard from './pages/AdminRFQDashboard';

function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="flex min-h-screen flex-col">
        <Routes>
          <Route path="/admin/rfqs" element={<AdminRFQDashboard />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/capabilities" element={<Capabilities />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/quality" element={<Quality />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </PublicLayout>
    </div>
  );
}
