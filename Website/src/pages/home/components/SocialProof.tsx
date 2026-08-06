const trustTags = [
  'Free to join',
  'Anonymous posting',
  'Human moderation',
  'Ages 16+',
  'Privacy first',
  'Peer support',
];

export default function SocialProof() {
  return (
    <section className="py-6 md:py-10 bg-background-50 border-y border-background-200">
      <div className="px-4 sm:px-6 md:px-12 lg:px-16">
        <p className="font-mono text-xs uppercase tracking-widest text-foreground-950 text-center mb-6">
          Built for safety, designed for trust
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-6 md:gap-x-10 gap-y-3">
          {trustTags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-sm uppercase tracking-wider text-foreground-500 whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}