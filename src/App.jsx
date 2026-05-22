import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Capabilities from './pages/Capabilities';
import Equipment from './pages/Equipment';
import Quality from './pages/Quality';
import Industries from './pages/Industries';
import Contact from './pages/Contact';

export default function App() {
  return (
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
  );
}
