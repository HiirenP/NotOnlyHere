import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/design/design-system/utils';

export function AdminStatCard({
  label,
  value,
  change,
  changeType = 'up',
  compareText,
  icon: Icon,
  iconBg,
}: {
  label: string;
  value: string;
  change?: string;
  changeType?: 'up' | 'down';
  compareText?: string;
  icon: LucideIcon;
  iconBg: string;
}) {
  return (
    <div className="bg-white border border-[#e8eaed] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#676a79] uppercase tracking-wide">{label}</p>
          <p className="text-2xl lg:text-3xl font-bold text-[#14191e] mt-2 tabular-nums">{value}</p>
          {change && (
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-md',
                  changeType === 'up' ? 'bg-[#0cbc87]/10 text-[#0cbc87]' : 'bg-[#d6293e]/10 text-[#d6293e]',
                )}
              >
                {changeType === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {change}
              </span>
              {compareText && <span className="text-[10px] text-[#a1a5b3]">{compareText}</span>}
            </div>
          )}
        </div>
        <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shrink-0', iconBg)}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

export function AdminPanel({ title, subtitle, action, children }: { title?: string; subtitle?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="space-y-5">
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            {title && <h2 className="text-lg font-bold text-[#14191e]">{title}</h2>}
            {subtitle && <p className="text-sm text-[#676a79] mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function AdminTabs({ tabs, active, onChange, rightAction }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void; rightAction?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e8eaed] pb-0">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors',
              active === tab.id ? 'border-[#0f6fec] text-[#0f6fec]' : 'border-transparent text-[#676a79] hover:text-[#14191e]',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {rightAction}
    </div>
  );
}

export function DonutChart({ segments, centerLabel, centerValue }: { segments: { label: string; value: number; color: string }[]; centerLabel?: string; centerValue?: string }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let offset = 0;
  const r = 40;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-28 h-28 shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {segments.map((seg) => {
            const pct = seg.value / total;
            const dash = pct * c;
            const el = (
              <circle
                key={seg.label}
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="12"
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
              />
            );
            offset += dash;
            return el;
          })}
        </svg>
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue && <span className="text-lg font-bold text-[#14191e]">{centerValue}</span>}
            {centerLabel && <span className="text-[10px] text-[#676a79]">{centerLabel}</span>}
          </div>
        )}
      </div>
      <div className="space-y-2 flex-1">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
              <span className="text-xs text-[#676a79]">{seg.label}</span>
            </div>
            <span className="text-xs font-bold text-[#14191e]">{Math.round((seg.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LineChart({ data, lines }: { data: { label: string; values: number[] }[]; lines: { key: number; color: string; label: string }[] }) {
  const allVals = data.flatMap((d) => d.values);
  const max = Math.max(...allVals, 1);
  const w = 100;
  const h = 60;

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-48" preserveAspectRatio="none">
        {lines.map((line) => {
          const points = data.map((d, i) => {
            const x = (i / (data.length - 1)) * w;
            const y = h - (d.values[line.key] / max) * (h - 8) - 4;
            return `${x},${y}`;
          }).join(' ');
          return (
            <polyline
              key={line.label}
              points={points}
              fill="none"
              stroke={line.color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * w;
          return <circle key={d.label} cx={x} cy={h - 2} r="0" />;
        })}
      </svg>
      <div className="flex justify-between mt-2">
        {data.map((d) => (
          <span key={d.label} className="text-[10px] text-[#a1a5b3] font-medium">{d.label}</span>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-[#e8eaed]">
        {lines.map((line) => (
          <div key={line.label} className="flex items-center gap-2">
            <span className="w-3 h-0.5 rounded" style={{ backgroundColor: line.color }} />
            <span className="text-xs text-[#676a79]">{line.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProgressRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
          <circle cx="36" cy="36" r={r} fill="none" stroke="#f5f6f8" strokeWidth="6" />
          <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={`${dash} ${c}`} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#14191e]">{value}%</span>
      </div>
      <span className="text-[10px] text-[#676a79] font-medium text-center">{label}</span>
    </div>
  );
}

export function HorizontalBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-semibold text-[#14191e]">{label}</span>
        <span className="text-[#676a79]">{pct}%</span>
      </div>
      <div className="h-2 bg-[#f5f6f8] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
