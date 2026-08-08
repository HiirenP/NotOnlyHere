import { Circle, MessageCircle, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { checkInMoods, type CheckInMood } from '@/data/mock';

export function DailyCheckIn() {
  const [selected, setSelected] = useState<CheckInMood | null>(null);

  return (
    <div className="bg-white border border-[#e8eaed] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4 mb-4">
      <h3 className="text-sm font-bold text-[#14191e]">How are you feeling today?</h3>
      <p className="text-xs text-[#676a79] mt-1">Private to you — we’ll gently point you toward support.</p>

      <div className="grid grid-cols-5 gap-2 mt-4">
        {checkInMoods.map((mood) => {
          const isActive = selected?.id === mood.id;
          return (
            <button
              key={mood.id}
              type="button"
              onClick={() => setSelected(mood)}
              className={`flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-xl border text-center transition-all ${
                isActive
                  ? 'border-[#0f6fec] bg-[#0f6fec]/5 shadow-sm'
                  : 'border-[#e8eaed] hover:border-[#0f6fec]/30 hover:bg-[#f5f6f8]'
              }`}
            >
              <span className="text-xl sm:text-2xl leading-none">{mood.emoji}</span>
              <span className={`text-[10px] sm:text-xs font-semibold leading-tight ${isActive ? 'text-[#0f6fec]' : 'text-[#676a79]'}`}>
                {mood.label}
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-4 pt-4 border-t border-[#e8eaed] space-y-2">
          <p className="text-xs font-semibold text-[#676a79] uppercase tracking-wide">Suggested for you</p>
          <Link
            to={selected.circlePath}
            className="flex items-start gap-3 p-3 rounded-xl bg-[#f5f6f8] hover:bg-[#eef0f4] transition-colors"
          >
            <span className="w-8 h-8 rounded-lg bg-[#0cbc87]/15 text-[#0cbc87] flex items-center justify-center shrink-0">
              <Circle size={16} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#14191e]">Join {selected.circle}</p>
              <p className="text-xs text-[#676a79] mt-0.5">A relevant Circle when you feel {selected.label.toLowerCase()}</p>
            </div>
          </Link>
          <Link
            to="/design/app/ava"
            className="flex items-start gap-3 p-3 rounded-xl bg-[#f5f6f8] hover:bg-[#eef0f4] transition-colors"
          >
            <span className="w-8 h-8 rounded-lg bg-[#e91e8c]/10 text-[#e91e8c] flex items-center justify-center shrink-0">
              <Sparkles size={16} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#14191e]">Gentle Ava conversation</p>
              <p className="text-xs text-[#676a79] mt-0.5">{selected.avaPrompt}</p>
            </div>
          </Link>
          <Link
            to="/design/app/feed"
            className="flex items-start gap-3 p-3 rounded-xl bg-[#f5f6f8] hover:bg-[#eef0f4] transition-colors"
          >
            <span className="w-8 h-8 rounded-lg bg-[#0f6fec]/10 text-[#0f6fec] flex items-center justify-center shrink-0">
              <MessageCircle size={16} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#14191e]">Supportive discussion</p>
              <p className="text-xs text-[#676a79] mt-0.5">{selected.discussion}</p>
            </div>
          </Link>
          <Link to="/design/app/mood" className="inline-block text-xs font-semibold text-[#0f6fec] hover:underline pt-1">
            Open private mood history
          </Link>
        </div>
      )}
    </div>
  );
}
