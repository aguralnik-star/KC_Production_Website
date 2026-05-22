import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';
import Home from './pages/Home';
import About from './pages/About';
import Capabilities from './pages/Capabilities';
import Equipment from './pages/Equipment';
import Quality from './pages/Quality';
import Industries from './pages/Industries';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminRFQDashboard from './pages/AdminRFQDashboard';

export default function App() {
  return (
    <Routes>
      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin/rfqs" element={<AdminRFQDashboard />} />
      </Route>

      <Route
        path="/admin"
        element={<Navigate to="/admin/rfqs" replace />}
      />

      <Route
        path="/*"
        element={
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/capabilities" element={<Capabilities />} />
                <Route path="/equipment" element={<Equipment />} />
                <Route path="/quality" element={<Quality />} />
                <Route path="/industries" element={<Industries />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
            <Footer />
          </div>
        }
      />
    </Routes>
  );
}
