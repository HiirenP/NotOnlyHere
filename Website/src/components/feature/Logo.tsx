interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showMark?: boolean;
  light?: boolean;
  className?: string;
}

const config = {
  sm: { mark: 'w-7 h-7', text: 'text-lg', gap: 'gap-2' },
  md: { mark: 'w-9 h-9', text: 'text-xl', gap: 'gap-2.5' },
  lg: { mark: 'w-14 h-14', text: 'text-4xl', gap: 'gap-4' },
};

function InfinityMark({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="logoGrad"
          x1="0"
          y1="13"
          x2="40"
          y2="13"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#6A4CF7" />
          <stop offset="50%" stopColor="#3D7FF8" />
          <stop offset="100%" stopColor="#22C8CF" />
        </linearGradient>
      </defs>
      {/* Left speech bubble */}
      <path
        d="M12 1C6.477 1 2 5.477 2 10.5C2 15.523 6.477 19.5 10.5 19.5L7 24L14 19.5C17.5 19.5 22 15.523 22 10.5C22 5.477 17.523 1 12 1Z"
        stroke="url(#logoGrad)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Right speech bubble */}
      <path
        d="M28 1C33.523 1 38 5.477 38 10.5C38 15.523 33.523 19.5 29.5 19.5L33 24L26 19.5C22.5 19.5 18 15.523 18 10.5C18 5.477 22.477 1 28 1Z"
        stroke="url(#logoGrad)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default function Logo({ size = 'md', showMark = true, light = false, className = '' }: LogoProps) {
  const c = config[size];
  const textColor = light ? 'text-background-50' : 'text-foreground-950';

  return (
    <div className={`flex items-center ${c.gap} ${className}`}>
      {showMark && <InfinityMark className={`${c.mark} flex-shrink-0`} />}
      <span className={`font-display ${c.text} tracking-tight ${textColor} uppercase leading-none`}>
        Not<em className="not-italic gradient-text">Only</em>Here
      </span>
    </div>
  );
}