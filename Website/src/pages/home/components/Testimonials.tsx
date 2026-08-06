import CircularTestimonials from '@/components/CircularTestimonials';

const testimonials = [
  {
    quote:
      'NotOnlyHere gave me a place to be honest without performing. Late Night Lounge is my 2am safe place — no judgment, just people who get it.',
    name: 'Anonymous member',
    designation: 'Late Night Lounge',
    src: '/images/testimonial-carousel-1.jpg',
  },
  {
    quote:
      'I was struggling alone for months. The first time I posted anonymously, I got 40 thoughtful responses. It reminded me that people actually care.',
    name: 'Anonymous member',
    designation: 'Gentle Support Circle',
    src: '/images/testimonial-carousel-2.jpg',
  },
  {
    quote:
      'The moderators here actually moderate. I have never seen a space this kind on the internet. It feels like being wrapped in a blanket.',
    name: 'Anonymous member',
    designation: 'Night Shade Circle',
    src: '/images/testimonial-carousel-3.jpg',
  },
];

export default function Testimonials() {
  return (
    <section className="py-12 md:py-20 bg-background-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-widest text-foreground-950 mb-10 text-center">
          Voices from the community
        </p>
        <CircularTestimonials testimonials={testimonials} autoplay />
      </div>
    </section>
  );
}