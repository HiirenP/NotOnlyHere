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
    id: 'collect',
    title: '1. Information We Collect',
    content: (
      <>
        <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-4">
          We collect only the information necessary to provide a safe, supportive community experience. We are intentional about what we ask for and why we ask for it.
        </p>
        <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-2 font-semibold text-foreground-950">
          Information You Provide Directly:
        </p>
        <ul className="font-mono text-sm text-foreground-600 leading-relaxed space-y-2 mb-4 list-disc list-inside">
          <li><strong className="text-foreground-950">Account Information:</strong> When you create an account, we collect your chosen username, email address, and an optional display name. You are never required to use your real name.</li>
          <li><strong className="text-foreground-950">Profile Information:</strong> You may optionally add a profile photo, bio, and general location. All profile fields are optional and can be left blank.</li>
          <li><strong className="text-foreground-950">Content You Share:</strong> Posts, comments, messages, circle interactions, and any other content you voluntarily share within the community.</li>
          <li><strong className="text-foreground-950">Communications:</strong> When you contact us via email or through our contact form, we collect your name, email address, and the content of your message.</li>
          <li><strong className="text-foreground-950">Support Contributions:</strong> If you choose to donate, we process payment information through secure third-party processors. We do not store full payment card details on our servers.</li>
        </ul>
        <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-2 font-semibold text-foreground-950">
          Information Collected Automatically:
        </p>
        <ul className="font-mono text-sm text-foreground-600 leading-relaxed space-y-2 list-disc list-inside">
          <li><strong className="text-foreground-950">Usage Data:</strong> Pages visited, features used, time spent on the platform, and general interaction patterns — all anonymized and aggregated where possible.</li>
          <li><strong className="text-foreground-950">Device Information:</strong> Browser type, operating system, device type, and screen resolution — used solely to optimize the platform experience.</li>
          <li><strong className="text-foreground-950">IP Address:</strong> Collected for security purposes, abuse prevention, and broad geographic analytics. Not linked to your account in an identifiable way for routine operations.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'use',
    title: '2. How We Use Your Information',
    content: (
      <>
        <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-4">
          Every use of your data serves a specific purpose tied to providing and improving the NotOnlyHere community. We do not use your data in ways that are unrelated to the platform.
        </p>
        <ul className="font-mono text-sm text-foreground-600 leading-relaxed space-y-2 list-disc list-inside">
          <li><strong className="text-foreground-950">Providing the Service:</strong> To create and maintain your account, display your content within your circles, enable messaging, and deliver the core community experience.</li>
          <li><strong className="text-foreground-950">Community Safety:</strong> To detect and prevent harassment, spam, abuse, and violations of our Community Guidelines. This includes automated content flagging and human moderation review.</li>
          <li><strong className="text-foreground-950">AI Support Features:</strong> To power our AI companion, circle recommendations, and wellness check-in features. AI interactions are processed in real time and are not used to build persistent profiles.</li>
          <li><strong className="text-foreground-950">Communications:</strong> To send you essential account notifications, community updates you have opted into, and responses to your support inquiries.</li>
          <li><strong className="text-foreground-950">Improvement & Analytics:</strong> To understand how the community is used, identify areas for improvement, and make NotOnlyHere better — using anonymized and aggregated data wherever possible.</li>
          <li><strong className="text-foreground-950">Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes, and to protect the rights, property, and safety of NotOnlyHere, our members, and the public.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'share',
    title: '3. How We Share Your Information',
    content: (
      <>
        <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-4">
          We do not sell your personal information. Period. We do not share it with advertisers, data brokers, or third-party marketing companies. Here is the limited set of circumstances where sharing may occur:
        </p>
        <ul className="font-mono text-sm text-foreground-600 leading-relaxed space-y-2 list-disc list-inside">
          <li><strong className="text-foreground-950">With Other Members:</strong> Content you post publicly within circles, your chosen username, and optional profile information are visible to other members of those circles. Anonymous posts do not display your username.</li>
          <li><strong className="text-foreground-950">Service Providers:</strong> We work with trusted third-party providers for hosting, email delivery, payment processing, and analytics. These providers are contractually bound to use your data only as necessary to provide services to us.</li>
          <li><strong className="text-foreground-950">Legal Obligations:</strong> We may disclose information if required by law, subpoena, or other legal process, or if we believe in good faith that disclosure is necessary to protect the rights, property, or safety of NotOnlyHere, our members, or the public.</li>
          <li><strong className="text-foreground-950">Business Transfers:</strong> In the unlikely event of a merger, acquisition, or sale of assets, member information may be transferred as part of that transaction. We will notify you before your information is transferred and becomes subject to a different privacy policy.</li>
          <li><strong className="text-foreground-950">With Your Consent:</strong> We may share your information for any other purpose with your explicit consent.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'cookies',
    title: '4. Cookies and Tracking Technologies',
    content: (
      <p className="font-mono text-sm text-foreground-600 leading-relaxed">
        We use minimal cookies and similar technologies to keep you signed in, remember your preferences, and understand basic usage patterns. We do not use tracking cookies for advertising purposes, and we do not deploy third-party advertising trackers. You can control cookie settings through your browser. Disabling essential cookies may affect your ability to stay logged in or use certain features of the platform.
      </p>
    ),
  },
  {
    id: 'security',
    title: '5. Data Security',
    content: (
      <p className="font-mono text-sm text-foreground-600 leading-relaxed">
        We implement industry-standard security measures to protect your information — including encryption in transit (TLS), encrypted storage, access controls, and regular security reviews. However, no method of electronic storage or transmission is 100% secure. While we work hard to protect your data, we cannot guarantee absolute security. We encourage you to use a strong, unique password and to notify us immediately if you suspect unauthorized access to your account.
      </p>
    ),
  },
  {
    id: 'rights',
    title: '6. Your Rights and Choices',
    content: (
      <>
        <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-4">
          You have meaningful control over your information and how it is used:
        </p>
        <ul className="font-mono text-sm text-foreground-600 leading-relaxed space-y-2 list-disc list-inside">
          <li><strong className="text-foreground-950">Access & Correction:</strong> You can view and update your account information at any time through your profile settings.</li>
          <li><strong className="text-foreground-950">Data Portability:</strong> You can request a copy of your data in a portable format by contacting us.</li>
          <li><strong className="text-foreground-950">Deletion:</strong> You can delete your account at any time. When you delete your account, your personal information is permanently removed from our active systems. Some anonymized or aggregated data may be retained for analytical purposes.</li>
          <li><strong className="text-foreground-950">Communication Preferences:</strong> You can opt out of non-essential communications at any time through your account settings or by using the unsubscribe link in our emails.</li>
          <li><strong className="text-foreground-950">Anonymity:</strong> You always have the option to post anonymously and to use a username that does not reveal your real identity.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'children',
    title: '7. Children&apos;s Privacy',
    content: (
      <p className="font-mono text-sm text-foreground-600 leading-relaxed">
        NotOnlyHere is intended for users aged 16 and older. We do not knowingly collect personal information from children under 16. If we learn that we have collected personal information from a child under 16 without verified parental consent, we will delete that information as quickly as possible. If you believe a child under 16 has provided us with personal information, please contact us immediately at <a href="mailto:info@notonlyhere.com" className="text-foreground-950 underline hover:gradient-text transition-colors cursor-pointer">info@notonlyhere.com</a>.
      </p>
    ),
  },
  {
    id: 'updates',
    title: '8. Updates to This Privacy Policy',
    content: (
      <p className="font-mono text-sm text-foreground-600 leading-relaxed">
        We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or platform features. When we make material changes, we will notify you through the platform or via email before the changes take effect. The date at the top of this policy indicates when it was last revised. Continued use of NotOnlyHere after changes take effect constitutes acceptance of the updated policy.
      </p>
    ),
  },
  {
    id: 'contact',
    title: '9. Contact Us',
    content: (
      <>
        <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-4">
          If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please reach out. We take privacy seriously and will respond as promptly as we can.
        </p>
        <div className="font-mono text-sm text-foreground-600 leading-relaxed space-y-1">
          <p><strong className="text-foreground-950">Email:</strong> <a href="mailto:info@notonlyhere.com" className="text-foreground-950 underline hover:gradient-text transition-colors cursor-pointer">info@notonlyhere.com</a></p>
          <p><strong className="text-foreground-950">Response Time:</strong> We aim to respond to privacy-related inquiries within 5 business days.</p>
        </div>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-background-50 min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-foreground-400 block mb-4">
            Updated June 2026
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tighter text-foreground-950 uppercase mb-6">
            Privacy <em className="not-italic gradient-text">Policy</em>
          </h1>
          <p className="font-mono text-base md:text-lg text-foreground-600 leading-relaxed max-w-2xl mx-auto">
            Your privacy is not an afterthought — it is a foundation of how we build this community. This policy explains what information we collect, how we use it, and the choices you have.
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

      {/* Crisis disclaimer */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100 border-t border-background-200">
        <FadeSection className="max-w-3xl mx-auto">
          <div className="bg-foreground-950 p-8 md:p-10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-background-50 rounded-full mt-0.5">
                <i className="ri-shield-check-line text-foreground-950 text-lg" />
              </div>
              <div>
                <h3 className="font-display text-xl tracking-tighter text-background-50 uppercase mb-3 leading-[0.9]">
                  Our <em className="not-italic gradient-text">Commitment</em>
                </h3>
                <p className="font-mono text-sm text-background-400 leading-relaxed">
                  NotOnlyHere was built on the belief that everyone deserves a safe place to be seen. That safety includes your data. We will never sell your information, never build advertising profiles on you, and never compromise your trust for profit. If you ever have concerns about your privacy here, email us at <a href="mailto:info@notonlyhere.com" className="text-background-50 underline hover:gradient-text transition-colors cursor-pointer">info@notonlyhere.com</a>.
                </p>
              </div>
            </div>
          </div>
        </FadeSection>
      </section>

      <Footer />
    </main>
  );
}