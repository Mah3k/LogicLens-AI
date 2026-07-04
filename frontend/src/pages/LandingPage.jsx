import Navbar from '../components/common/Navbar';
import Hero from '../components/landing/Hero';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonials from '../components/landing/Testimonials';
import Footer from '../components/landing/Footer';


export default function LandingPage() {
  return (
    <div style={{ background: 'var(--bg-app)' }}>
      <Navbar />
      <Hero />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </div>
  );
}
