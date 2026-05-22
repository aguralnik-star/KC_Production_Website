import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import CapabilitiesPage from './pages/CapabilitiesPage';
import EquipmentPage from './pages/EquipmentPage';
import QualityPage from './pages/QualityPage';
import Contact from './pages/Contact';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/capabilities" element={<CapabilitiesPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/quality" element={<QualityPage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
