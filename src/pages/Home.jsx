import Hero from '../components/Hero';
import Credibility from '../components/Credibility';
import Capabilities from '../components/Capabilities';
import Industries from '../components/Industries';
import Equipment from '../components/Equipment';
import Quality from '../components/Quality';
import RFQSection from '../components/RFQSection';

export default function Home() {
  return (
    <>
      <Hero />
      <Credibility />
      <Capabilities limit={6} />
      <Industries />
      <Equipment preview />
      <Quality compact />
      <RFQSection />
    </>
  );
}
