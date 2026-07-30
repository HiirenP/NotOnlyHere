import { useRef, useEffect, useState } from 'react';
import Nav from '@/pages/home/components/Nav';
import Footer from '@/pages/home/components/Footer';

interface FadeSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

function FadeSection({ children, className = '', delay = 0 }: FadeSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const sections = [
  {
    id: 'purpose',
    title: '1. Purpose of the Platform',
    content: (
      <p className="font-mono text-sm text-foreground-600 leading-relaxed">
        NotOnlyHere is a peer-support community — a space where people show up for each other through themed circles, anonymous posting, and compassionate listening. It is not a crisis service, not a substitute for professional mental health care, and not a social media platform. By using NotOnlyHere, you acknowledge that you understand and accept the nature, scope, and limitations of this community.
      </p>
    ),
  },
  {
    id: 'eligibility',
    title: '2. Eligibility',
    content: (
      <>
        <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-4">
          To create an account and use NotOnlyHere, you must meet the following requirements:
        </p>
        <ul className="font-mono text-sm text-foreground-600 leading-relaxed space-y-2 list-disc list-inside">
          <li>You are at least <strong className="text-foreground-950">16 years of age</strong>. If you are under 18, you confirm that you have obtained consent from a parent or legal guardian to use the platform.</li>
          <li>You have not been previously banned or removed from NotOnlyHere for violating our Community Guidelines or these Terms.</li>
          <li>You are not using the platform on behalf of a competitor or for the purpose of scraping, data mining, or replicating our services.</li>
          <li>You are legally capable of entering into binding agreements in your jurisdiction.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'accounts',
    title: '3. User Accounts',
    content: (
      <>
        <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-4">
          When you create an account, you agree to:
        </p>
        <ul className="font-mono text-sm text-foreground-600 leading-relaxed space-y-2 list-disc list-inside">
          <li>Provide accurate and complete registration information. You are never required to use your real name — a chosen username is sufficient.</li>
          <li>Maintain the security of your account credentials. You are responsible for all activity that occurs under your account.</li>
          <li>Notify us immediately at <a href="mailto:info@notonlyhere.com" className="text-foreground-950 underline hover:gradient-text transition-colors cursor-pointer">info@notonlyhere.com</a> if you suspect unauthorized access to your account.</li>
          <li>Not share your account credentials with others or allow others to access the platform through your account.</li>
          <li>Not create more than one account without explicit permission from the NotOnlyHere team.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'guidelines',
    title: '4. Community Guidelines',
    content: (
      <p className="font-mono text-sm text-foreground-600 leading-relaxed">
        By using NotOnlyHere, you agree to follow our <a href="/guidelines" className="text-foreground-950 underline hover:gradient-text transition-colors cursor-pointer">Community Guidelines</a> at all times. These guidelines cover kindness and respect, anonymity protection, prohibition of harassment and hate speech, restrictions on graphic or crisis content, and the reporting process. Violations may result in content removal, temporary suspension, or permanent account termination — at the sole discretion of our moderation team.
      </p>
    ),
  },
  {
    id: 'contributions',
    title: '5. User Contributions',
    content: (
      <>
        <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-4">
          You retain ownership of the content you create and share on NotOnlyHere. By posting content, you grant us a limited, non-exclusive, royalty-free license to display and distribute your content within the platform as necessary to provide the service. This license ends when you delete your content or your account.
        </p>
        <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-4">
          You are solely responsible for the content you post. By sharing content, you represent and warrant that:
        </p>
        <ul className="font-mono text-sm text-foreground-600 leading-relaxed space-y-2 list-disc list-inside">
          <li>You own the content or have the right to share it.</li>
          <li>Your content does not violate the rights of any third party, including intellectual property, privacy, or publicity rights.</li>
          <li>Your content complies with our Community Guidelines and these Terms.</li>
        </ul>
        <p className="font-mono text-sm text-foreground-600 leading-relaxed mt-4">
          We do not endorse any user-generated content. Views expressed by members are their own and do not reflect the views of NotOnlyHere.
        </p>
      </>
    ),
  },
  {
    id: 'ip',
    title: '6. Intellectual Property',
    content: (
      <p className="font-mono text-sm text-foreground-600 leading-relaxed">
        The NotOnlyHere name, logo, branding, website design, platform code, and all original content created by the NotOnlyHere team are our exclusive intellectual property. You may not use, reproduce, modify, or distribute any of these materials without our prior written consent. We respect the intellectual property rights of others and expect our members to do the same. If you believe your intellectual property rights have been infringed on our platform, please contact us at <a href="mailto:info@notonlyhere.com" className="text-foreground-950 underline hover:gradient-text transition-colors cursor-pointer">info@notonlyhere.com</a>.
      </p>
    ),
  },
  {
    id: 'termination',
    title: '7. Account Termination',
    content: (
      <>
        <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-4">
          We reserve the right to suspend or terminate your account at our sole discretion if you violate these Terms or our Community Guidelines. Termination may occur with or without notice, depending on the severity of the violation.
        </p>
        <p className="font-mono text-sm text-foreground-600 leading-relaxed">
          You may delete your account at any time through your account settings. Upon deletion, your personal information and content will be permanently removed from our active systems in accordance with our Privacy Policy. Some anonymized or aggregated data may be retained for analytical purposes.
        </p>
      </>
    ),
  },
  {
    id: 'disclaimer',
    title: '8. Disclaimer of Warranties',
    content: (
      <>
        <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-4">
          NotOnlyHere is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. To the fullest extent permitted by applicable law, we disclaim all warranties, express or implied, including but not limited to:
        </p>
        <ul className="font-mono text-sm text-foreground-600 leading-relaxed space-y-2 list-disc list-inside">
          <li>That the platform will be uninterrupted, error-free, or completely secure.</li>
          <li>That the content, advice, or support shared by other members is accurate, reliable, or appropriate for your situation.</li>
          <li>That the platform is a substitute for professional medical, psychological, or psychiatric advice, diagnosis, or treatment.</li>
          <li>That any particular outcome will result from your participation in the community.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'liability',
    title: '9. Limitation of Liability',
    content: (
      <p className="font-mono text-sm text-foreground-600 leading-relaxed">
        To the fullest extent permitted by applicable law, NotOnlyHere, its founders, team members, volunteers, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including but not limited to emotional distress, loss of data, or any other damages arising from or related to your use of or inability to use the platform, whether based on warranty, contract, tort, or any other legal theory, even if we have been advised of the possibility of such damages. Our total liability for any claim arising from your use of the platform shall not exceed the amount you have paid us (if any) in the twelve months preceding the claim. Because NotOnlyHere is free to join, for most members this amount is zero.
      </p>
    ),
  },
  {
    id: 'changes',
    title: '10. Changes to These Terms',
    content: (
      <p className="font-mono text-sm text-foreground-600 leading-relaxed">
        We may update these Terms from time to time to reflect changes in our practices, legal requirements, or platform evolution. When we make material changes, we will notify you through the platform or via email at least 14 days before the changes take effect. The date at the top of this page indicates when the Terms were last revised. Continued use of NotOnlyHere after changes take effect constitutes acceptance of the updated Terms. If you do not agree with the changes, you should stop using the platform and delete your account.
      </p>
    ),
  },
  {
    id: 'contact-terms',
    title: '11. Contact Us',
    content: (
      <>
        <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-4">
          If you have questions about these Terms, need clarification, or want to report a concern, we are here to help.
        </p>
        <div className="font-mono text-sm text-foreground-600 leading-relaxed space-y-1">
          <p><strong className="text-foreground-950">Email:</strong> <a href="mailto:info@notonlyhere.com" className="text-foreground-950 underline hover:gradient-text transition-colors cursor-pointer">info@notonlyhere.com</a></p>
          <p><strong className="text-foreground-950">Response Time:</strong> We aim to respond within 2 business days.</p>
        </div>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <main className="bg-background-50 min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-foreground-400 block mb-4">
            Effective June 2026
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tighter text-foreground-950 uppercase mb-6">
            Terms of <em className="not-italic gradient-text">Service</em>
          </h1>
          <p className="font-mono text-base md:text-lg text-foreground-600 leading-relaxed max-w-2xl mx-auto">
            These terms define the relationship between you and NotOnlyHere. They are not just legal language — they are the agreement that keeps this community safe, respectful, and sustainable.
          </p>
        </div>
      </section>

      {/* Quick nav */}
      <section className="py-8 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50 border-b border-background-200">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-widest text-foreground-400 mb-4">
            Jump to Section
          </p>
          <div className="flex flex-wrap gap-3">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="font-mono text-xs px-3 py-1.5 border border-background-200 rounded-full text-foreground-600 hover:text-foreground-950 hover:border-foreground-400 transition-colors duration-200 cursor-pointer whitespace-nowrap"
              >
                {s.title.split('. ')[0]}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
        <div className="max-w-3xl mx-auto space-y-14 md:space-y-20">
          {sections.map((s, i) => (
            <FadeSection key={s.id} delay={i * 60}>
              <div id={s.id} className="scroll-mt-28">
                <h2 className="font-display text-2xl md:text-3xl tracking-tighter text-foreground-950 uppercase mb-5 leading-[0.9]">
                  {s.title}
                </h2>
                {s.content}
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* Acceptance footer */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100 border-t border-background-200">
        <FadeSection className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-4">
            By creating an account on NotOnlyHere, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Community Guidelines.
          </p>
          <a
            href="/register"
            className="font-mono text-sm uppercase tracking-wider gradient-btn text-background-50 px-8 py-4 rounded-full whitespace-nowrap cursor-pointer inline-block"
          >
            I Agree — Join the Community
          </a>
        </FadeSection>
      </section>

      <Footer />
    </main>
  );
}