import { ShieldCheck } from 'lucide-react';

export function FoundingMemberBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span
      title="Founding Member — one of the first 1,000 people here"
      className={`inline-flex items-center gap-1 rounded-full border border-[#0cbc87]/25 bg-[#0cbc87]/10 text-[#087f60] font-bold whitespace-nowrap ${
        compact ? 'p-0.5' : 'px-2 py-0.5 text-[10px]'
      }`}
    >
      <ShieldCheck size={compact ? 13 : 12} fill="currentColor" className="text-[#0cbc87]" />
      {!compact && 'Founding Member'}
    </span>
  );
}
