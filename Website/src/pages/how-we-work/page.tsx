import Nav from '@/pages/home/components/Nav';
import Footer from '@/pages/home/components/Footer';
import HowWeWork from '@/components/HowWeWork';

export default function HowWeWorkPage() {
  return (
    <main className="bg-background-50 min-h-screen">
      <Nav />
      <HowWeWork />
      <Footer />
    </main>
  );
}