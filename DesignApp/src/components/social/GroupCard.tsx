import { Link } from 'react-router-dom';
import type { CircleGroup } from '@/data/mock';

export function GroupCard({ circle }: { circle: CircleGroup }) {
  return (
    <Link
      to="/design/app/circles/detail"
      className="block bg-white border border-[#e8eaed] rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-md transition-all group"
    >
      <div className="relative h-36">
        <img src={circle.cover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <img
          src={circle.thumb}
          alt=""
          className="absolute bottom-3 left-4 w-14 h-14 rounded-lg border-2 border-white object-cover shadow-lg"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-[#14191e] group-hover:text-[#0f6fec] transition-colors">{circle.name}</h3>
        <p className="text-xs text-[#676a79] mt-1 line-clamp-2">{circle.identityLine}</p>
        <p className="text-xs text-[#a1a5b3] mt-2">
          {circle.activeToday} people active today
        </p>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase px-2 py-1 bg-[#f5f6f8] text-[#676a79] rounded-md">{circle.access}</span>
          <span
            className={`text-xs font-bold px-4 py-1.5 rounded-md ${
              circle.joined ? 'bg-[#f5f6f8] text-[#676a79]' : 'bg-[#0f6fec] text-white'
            }`}
          >
            {circle.joined ? 'Joined' : 'Join'}
          </span>
        </div>
      </div>
    </Link>
  );
}
