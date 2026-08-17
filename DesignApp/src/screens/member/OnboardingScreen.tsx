import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { checkInMoods, circles, currentUser } from '@/data/mock';

const steps = ['Welcome', 'Your Circles', 'Check in', 'Meet Ava', 'Ready'];

export function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [selectedCircles, setSelectedCircles] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const firstName = currentUser.displayName.split(' ')[0];

  const toggleCircle = (id: string) => {
    setSelectedCircles((current) => {
      if (current.includes(id)) return current.filter((circleId) => circleId !== id);
      if (current.length === 3) return current;
      return [...current, id];
    });
  };

  const canContinue =
    step === 0 ||
    (step === 1 && selectedCircles.length === 3) ||
    (step === 2 && selectedMood !== null) ||
    step === 3;

  return (
    <div className="min-h-screen bg-[#eff2f6] font-ui px-4 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between gap-4 mb-8">
          <Link to="/design" className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl overflow-hidden bg-[#0b4fbf] shadow-sm">
              <img
                src="/logo-icon.png"
                alt="NotOnlyHere"
                className="w-full h-full object-cover scale-[2.15] origin-[center_32%]"
              />
            </span>
            <span className="text-sm font-bold text-[#14191e] hidden sm:inline">NotOnlyHere</span>
          </Link>
          <Link to="/design/app/feed" className="text-xs font-semibold text-[#676a79] hover:text-[#0f6fec]">
            Skip for now
          </Link>
        </header>

        <div className="mb-6">
          <div className="flex items-center gap-1.5 sm:gap-3">
            {steps.map((label, index) => (
              <div key={label} className="flex-1">
                <div
                  className={`h-1.5 rounded-full transition-colors ${
                    index <= step ? 'bg-[#0f6fec]' : 'bg-white border border-[#e8eaed]'
                  }`}
                />
                <p
                  className={`hidden sm:block mt-2 text-[10px] font-semibold ${
                    index === step ? 'text-[#0f6fec]' : 'text-[#a1a5b3]'
                  }`}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <main className="bg-white border border-[#e8eaed] rounded-2xl shadow-[0_8px_32px_rgba(20,25,30,0.07)] overflow-hidden">
          {step === 0 && (
            <section className="min-h-[540px] grid md:grid-cols-[1.05fr_0.95fr]">
              <div className="p-7 sm:p-10 flex flex-col justify-center">
                <span className="w-14 h-14 rounded-2xl bg-[#0f6fec]/10 text-[#0f6fec] flex items-center justify-center mb-6">
                  <HeartHandshake size={26} />
                </span>
                <p className="text-xs font-bold uppercase tracking-wider text-[#0f6fec] mb-3">You belong here</p>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#14191e] leading-tight">
                  Welcome, {firstName}.
                  <br />
                  We&apos;re glad you&apos;re here.
                </h1>
                <p className="text-base text-[#676a79] mt-5 max-w-md leading-relaxed">
                  Let&apos;s find your people and shape a space that feels supportive from the moment you arrive.
                </p>
              </div>
              <div className="bg-gradient-to-br from-[#0f6fec] via-[#315cdf] to-[#6610f2] p-7 sm:p-10 text-white flex flex-col justify-center">
                <p className="text-sm font-bold mb-5">In the next few moments, you&apos;ll:</p>
                <div className="space-y-5">
                  {[
                    ['Choose three Circles', 'Find conversations that feel relevant to you.'],
                    ['Check in with yourself', 'Share how you feel — privately.'],
                    ['Meet Ava', 'Know where to find support any time.'],
                  ].map(([title, copy], index) => (
                    <div key={title} className="flex gap-3">
                      <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-xs font-bold shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-bold">{title}</p>
                        <p className="text-xs text-white/70 mt-0.5 leading-relaxed">{copy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {step === 1 && (
            <section className="p-6 sm:p-9 min-h-[540px]">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0f6fec] mb-2">Let&apos;s find your people</p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#14191e]">Choose three Circles</h1>
                  <p className="text-sm text-[#676a79] mt-2">You can join, leave, or discover more at any time.</p>
                </div>
                <span className="text-sm font-bold text-[#0f6fec]">{selectedCircles.length} of 3 selected</span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {circles.slice(0, 6).map((circle) => {
                  const selected = selectedCircles.includes(circle.id);
                  return (
                    <button
                      key={circle.id}
                      type="button"
                      onClick={() => toggleCircle(circle.id)}
                      className={`relative text-left overflow-hidden rounded-xl border-2 transition-all ${
                        selected
                          ? 'border-[#0f6fec] shadow-[0_4px_16px_rgba(15,111,236,0.12)]'
                          : 'border-[#e8eaed] hover:border-[#0f6fec]/30'
                      }`}
                    >
                      <img src={circle.cover} alt="" className="w-full h-24 object-cover" />
                      <span
                        className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                          selected
                            ? 'bg-[#0f6fec] border-white text-white'
                            : 'bg-white/90 border-white text-transparent'
                        }`}
                      >
                        <Check size={14} />
                      </span>
                      <span className="block p-3">
                        <span className="block text-sm font-bold text-[#14191e]">{circle.name}</span>
                        <span className="block text-xs text-[#676a79] mt-1 leading-relaxed">{circle.identityLine}</span>
                        <span className="flex items-center gap-1 mt-2 text-[10px] text-[#a1a5b3]">
                          <Users size={11} /> {circle.members.toLocaleString()} members
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="p-7 sm:p-10 min-h-[540px] flex flex-col justify-center">
              <div className="max-w-2xl mx-auto w-full text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-[#0f6fec] mb-2">A private check-in</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#14191e]">How are you feeling today?</h1>
                <p className="text-sm text-[#676a79] mt-2">
                  Only you can see this. We&apos;ll use it to gently point you toward support.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8">
                  {checkInMoods.map((mood) => {
                    const selected = selectedMood === mood.id;
                    return (
                      <button
                        key={mood.id}
                        type="button"
                        onClick={() => setSelectedMood(mood.id)}
                        className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          selected
                            ? 'border-[#0f6fec] bg-[#0f6fec]/5 shadow-sm'
                            : 'border-[#e8eaed] hover:border-[#0f6fec]/30'
                        }`}
                      >
                        <span className="text-3xl">{mood.emoji}</span>
                        <span className={`text-xs font-bold ${selected ? 'text-[#0f6fec]' : 'text-[#676a79]'}`}>
                          {mood.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-7 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0cbc87]/10 text-[#0a8f69] text-xs font-semibold">
                  <ShieldCheck size={15} />
                  Your check-in is private and never shown on your profile.
                </div>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="min-h-[540px] grid md:grid-cols-2">
              <div className="p-7 sm:p-10 flex flex-col justify-center">
                <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#e91e8c] to-[#6610f2] text-white flex items-center justify-center mb-6 shadow-sm">
                  <Sparkles size={25} />
                </span>
                <p className="text-xs font-bold uppercase tracking-wider text-[#e91e8c] mb-2">Meet Ava</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#14191e] leading-tight">
                  Supportive conversation, available 24/7.
                </h1>
                <p className="text-sm text-[#676a79] mt-4 leading-relaxed">
                  Ava can listen, suggest grounding exercises, and help you find a Circle. Ava is an AI companion — not a therapist or crisis service.
                </p>
                <div className="mt-6 space-y-3 text-xs text-[#676a79]">
                  <p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-[#0cbc87]" /> Private conversation</p>
                  <p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-[#0cbc87]" /> No judgment or social pressure</p>
                  <p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-[#0cbc87]" /> A bridge to real community</p>
                </div>
              </div>
              <div className="p-6 sm:p-8 bg-[#f5f6f8] flex items-center">
                <div className="w-full bg-white border border-[#e8eaed] rounded-2xl shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 p-4 border-b border-[#e8eaed]">
                    <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#e91e8c] to-[#6610f2] text-white flex items-center justify-center">
                      <Sparkles size={15} />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#14191e]">Ava</p>
                      <p className="text-[10px] text-[#0cbc87] font-semibold">Available now</p>
                    </div>
                  </div>
                  <div className="p-4 space-y-3 min-h-60">
                    <div className="max-w-[85%] bg-[#f5f6f8] rounded-2xl rounded-bl-md px-4 py-3 text-xs text-[#14191e] leading-relaxed">
                      Hi {firstName}. I&apos;m Ava. What would feel most helpful right now — a quiet check-in, a grounding exercise, or finding a Circle?
                    </div>
                    <div className="ml-auto max-w-[75%] bg-[#0f6fec]/10 text-[#14191e] rounded-2xl rounded-br-md px-4 py-3 text-xs">
                      Maybe a quiet check-in.
                    </div>
                    <div className="max-w-[85%] bg-[#f5f6f8] rounded-2xl rounded-bl-md px-4 py-3 text-xs text-[#14191e] leading-relaxed">
                      We can take it one sentence at a time. No pressure to explain everything.
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="p-7 sm:p-12 min-h-[540px] flex flex-col items-center justify-center text-center">
              <span className="w-20 h-20 rounded-full bg-[#0cbc87]/12 text-[#0cbc87] flex items-center justify-center mb-6">
                <Check size={38} />
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-[#0cbc87] mb-3">You&apos;re all set</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#14191e]">Now you&apos;re ready.</h1>
              <p className="text-sm sm:text-base text-[#676a79] mt-4 max-w-lg leading-relaxed">
                Your Circles are waiting, your check-in is private, and Ava is always nearby. Welcome to a community built around kindness.
              </p>
              <div className="grid sm:grid-cols-3 gap-3 mt-8 w-full max-w-2xl text-left">
                <div className="p-4 rounded-xl bg-[#f5f6f8]">
                  <p className="text-lg font-bold text-[#0f6fec]">3</p>
                  <p className="text-xs font-semibold text-[#676a79] mt-1">Circles chosen</p>
                </div>
                <div className="p-4 rounded-xl bg-[#f5f6f8]">
                  <p className="text-lg">{checkInMoods.find((mood) => mood.id === selectedMood)?.emoji}</p>
                  <p className="text-xs font-semibold text-[#676a79] mt-1">Today&apos;s private check-in</p>
                </div>
                <div className="p-4 rounded-xl bg-[#f5f6f8]">
                  <p className="text-lg font-bold text-[#e91e8c]">Ava</p>
                  <p className="text-xs font-semibold text-[#676a79] mt-1">Available whenever needed</p>
                </div>
              </div>
              <Link
                to="/design/app/feed"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0f6fec] hover:bg-[#0d5ed4] text-white text-sm font-bold transition-colors"
              >
                Enter your community
                <ArrowRight size={17} />
              </Link>
              <Link to="/design/app/invite" className="mt-3 text-xs font-bold text-[#0f6fec] hover:underline">
                Invite someone to join you
              </Link>
            </section>
          )}

          {step < 4 && (
            <footer className="px-6 sm:px-9 py-4 border-t border-[#e8eaed] bg-[#fafbfc] flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep((current) => Math.max(0, current - 1))}
                disabled={step === 0}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#676a79] hover:text-[#14191e] disabled:opacity-0"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep((current) => Math.min(4, current + 1))}
                disabled={!canContinue}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0f6fec] hover:bg-[#0d5ed4] text-white text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {step === 0 ? 'Let’s begin' : step === 3 ? 'Finish setup' : 'Continue'}
                <ArrowRight size={16} />
              </button>
            </footer>
          )}
        </main>
      </div>
    </div>
  );
}
