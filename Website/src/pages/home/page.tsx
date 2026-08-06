import Nav from './components/Nav';
import Hero from './components/Hero';
import SocialProof from './components/SocialProof';
import Features from './components/Features';
import Manifesto from '@/components/Manifesto';
import HowWeWork from '@/components/HowWeWork';
import RollingCirclesList from '@/components/RollingCirclesList';
import AISupportTeaser from './components/AISupportTeaser';
import DonationTeaser from './components/DonationTeaser';
import WebCommunityAccess from './components/WebCommunityAccess';
import Testimonials from './components/Testimonials';
import DeepDive from './components/DeepDive';
import BlogPreview from './components/BlogPreview';
import FAQTeaser from './components/FAQTeaser';
import ClosingCTA from './components/ClosingCTA';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="bg-background-50 min-h-screen">
      <Nav />
      <Hero />
      <SocialProof />
      <Features />
      <Manifesto />
      <HowWeWork />
      <RollingCirclesList />
      <AISupportTeaser />
      <DonationTeaser />
      <WebCommunityAccess />
      <Testimonials />
      <DeepDive />
      <BlogPreview />
      <FAQTeaser />
      <ClosingCTA />
      <Footer />
    </main>
  );
}