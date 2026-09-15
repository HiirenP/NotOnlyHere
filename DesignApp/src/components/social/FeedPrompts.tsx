import { ArrowRight, HeartHandshake, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AvaPromptCard() {
  return (
    <div className="bg-white border border-[#e8eaed] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#e91e8c] to-[#6610f2] text-white flex items-center justify-center shrink-0">
          <Sparkles size={18} />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[#14191e]">Need someone right now?</h3>
          <p className="text-xs text-[#0cbc87] font-semibold mt-0.5">Available 24/7</p>
        </div>
      </div>
      <Link
        to="/design/app/ava"
        className="flex items-center justify-center gap-1.5 w-full mt-4 py-2 rounded-md bg-[#e91e8c]/10 hover:bg-[#e91e8c] text-[#e91e8c] hover:text-white text-sm font-semibold transition-colors"
      >
        Talk with Ava
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

export function EncouragementPromptCard() {
  return (
    <div className="bg-white border border-[#e8eaed] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-lg bg-[#0cbc87]/12 text-[#0cbc87] flex items-center justify-center shrink-0">
          <HeartHandshake size={18} />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[#14191e]">Someone needs encouragement</h3>
          <p className="text-xs text-[#676a79] mt-0.5">5 members could use a kind word today.</p>
        </div>
      </div>
      <Link
        to="/design/app/post"
        className="flex items-center justify-center gap-1.5 w-full mt-4 py-2 rounded-md bg-[#0cbc87]/10 hover:bg-[#0cbc87] text-[#0cbc87] hover:text-white text-sm font-semibold transition-colors"
      >
        Respond
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
