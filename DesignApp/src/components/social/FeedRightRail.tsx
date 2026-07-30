import { Calendar, ChevronRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { circles, suggestedConnections, upcomingEvents } from '@/data/mock';

export function FeedRightRail() {
  return (
    <aside className="hidden xl:block w-[300px] shrink-0 space-y-4 sticky top-20 self-start">
      {/* Your circles quick list */}
      <div className="bg-background-100 rounded-2xl border border-background-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-mono text-xs uppercase tracking-widest text-foreground-600">Your circles</h3>
          <Link to="/design/app/circles" className="font-mono text-[10px] text-primary-600 hover:underline">See all</Link>
        </div>
        <div className="space-y-2">
          {circles.filter((c) => c.joined).map((circle) => (
            <Link key={circle.id} to="/design/app/circles/detail" className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-background-200 transition-colors group">
              <img src={circle.thumb} alt="" className="w-10 h-10 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs text-foreground-900 truncate group-hover:text-primary-700">{circle.name}</p>
                <p className="font-mono text-[10px] text-foreground-500">{circle.posts24h} posts today</p>
              </div>
              <ChevronRight size={14} className="text-foreground-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>

      {/* Suggested connections */}
      <div className="bg-background-100 rounded-2xl border border-background-200 shadow-sm p-4">
        <h3 className="font-mono text-xs uppercase tracking-widest text-foreground-600 mb-3">People you may know</h3>
        <div className="space-y-3">
          {suggestedConnections.map((person) => (
            <div key={person.username} className="flex items-center gap-3">
              <img src={person.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs text-foreground-900 truncate">{person.name}</p>
                <p className="font-mono text-[10px] text-foreground-500">{person.mutual} mutual connections</p>
              </div>
              <button type="button" className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors">
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming events */}
      <div className="bg-background-100 rounded-2xl border border-background-200 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={14} className="text-primary-600" />
          <h3 className="font-mono text-xs uppercase tracking-widest text-foreground-600">Upcoming events</h3>
        </div>
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <Link key={event.title} to="/design/app/events" className="block p-2 -mx-2 rounded-xl hover:bg-background-200 transition-colors">
              <p className="font-mono text-xs text-foreground-900">{event.title}</p>
              <p className="font-mono text-[10px] text-foreground-500">{event.date} · {event.time} · {event.attendees} going</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer links */}
      <p className="font-mono text-[10px] text-foreground-400 px-2 leading-relaxed">
        <Link to="/design" className="hover:underline">Help</Link> · <Link to="/design" className="hover:underline">Crisis resources</Link> · <Link to="/design" className="hover:underline">Privacy</Link>
      </p>
    </aside>
  );
}

export function GroupCard({ circle }: { circle: (typeof circles)[0] }) {
  return (
    <Link to="/design/app/circles/detail" className="block bg-background-100 rounded-2xl border border-background-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative h-28 overflow-hidden">
        <img src={circle.cover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <img src={circle.thumb} alt="" className="absolute bottom-3 left-4 w-14 h-14 rounded-xl border-2 border-background-100 object-cover shadow-lg" />
      </div>
      <div className="p-4 pt-3">
        <h3 className="font-mono text-sm font-medium text-foreground-900 group-hover:text-primary-700 transition-colors">{circle.name}</h3>
        <div className="flex items-center gap-3 mt-1 font-mono text-[11px] text-foreground-500">
          <span className="flex items-center gap-1"><Users size={12} /> {circle.members.toLocaleString()} members</span>
          <span>{circle.posts24h} posts/day</span>
        </div>
        <p className="font-mono text-xs text-foreground-600 mt-2 line-clamp-2">{circle.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 bg-background-200 text-foreground-600 rounded-full">{circle.access}</span>
          <span className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg ${circle.joined ? 'bg-background-200 text-foreground-700' : 'bg-primary-500 text-background-50'}`}>
            {circle.joined ? 'Joined' : 'Join'}
          </span>
        </div>
      </div>
    </Link>
  );
}
