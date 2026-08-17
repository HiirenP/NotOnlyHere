import { useState } from 'react';
import { Check, Copy, Mail, MessageCircle, Send, Share2, UserPlus, Users } from 'lucide-react';
import { MemberShell } from '@/layouts/Shells';
import { PageHeader, TCard } from '@/components/template';
import { currentUser, referralStats } from '@/data/mock';

const inviteLink = currentUser.inviteLink;

export function InviteScreen() {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
    } catch {
      // Clipboard may be unavailable in an embedded design preview.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <MemberShell>
      <PageHeader title="Invite people" subtitle="Make it easier for someone you care about to find their Circle" />

      <TCard className="p-0 overflow-hidden mb-4">
        <div className="p-6 sm:p-8 bg-gradient-to-br from-[#0f6fec] to-[#6610f2] text-white">
          <span className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-5">
            <UserPlus size={22} />
          </span>
          <h2 className="text-2xl font-bold">Belonging grows when it&apos;s shared.</h2>
          <p className="text-sm text-white/75 mt-2 max-w-lg leading-relaxed">
            Invite someone who could use a kind, moderated space. They&apos;ll choose their own Circles and what they want to share.
          </p>
        </div>
        <div className="p-5 sm:p-6">
          <label className="block text-xs font-bold text-[#676a79] uppercase tracking-wide mb-2">Your personal invite link</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 px-4 py-3 rounded-lg bg-[#f5f6f8] border border-[#e8eaed] text-sm text-[#14191e] truncate">
              {inviteLink}
            </div>
            <button
              type="button"
              onClick={copyLink}
              className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-bold transition-colors ${
                copied ? 'bg-[#0cbc87] text-white' : 'bg-[#0f6fec] hover:bg-[#0d5ed4] text-white'
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy link'}
            </button>
          </div>
          <p className="text-xs text-[#a1a5b3] mt-3">
            Your link helps us understand which invitations lead to new members. It never reveals private activity.
          </p>
        </div>
      </TCard>

      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Email', icon: Mail, color: 'bg-[#0f6fec]/10 text-[#0f6fec]' },
          { label: 'Message', icon: MessageCircle, color: 'bg-[#0cbc87]/10 text-[#0cbc87]' },
          { label: 'More ways', icon: Share2, color: 'bg-[#6610f2]/10 text-[#6610f2]' },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            className="flex items-center gap-3 p-4 bg-white border border-[#e8eaed] rounded-lg hover:border-[#0f6fec]/30 hover:shadow-sm transition-all text-left"
          >
            <span className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
              <item.icon size={18} />
            </span>
            <span className="text-sm font-bold text-[#14191e]">{item.label}</span>
          </button>
        ))}
      </div>

      <TCard className="!rounded-lg">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-sm font-bold text-[#14191e]">Your invitations</h3>
            <p className="text-xs text-[#676a79] mt-1">A simple view of who has joined through your link.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0cbc87] bg-[#0cbc87]/10 px-3 py-1.5 rounded-full">
            <Users size={13} /> {referralStats.joined} joined
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { value: String(referralStats.sent), label: 'Invites sent' },
            { value: String(referralStats.opened), label: 'Links opened' },
            { value: String(referralStats.joined), label: 'People joined' },
          ].map((stat) => (
            <div key={stat.label} className="p-3 rounded-lg bg-[#f5f6f8] text-center">
              <p className="text-lg font-bold text-[#14191e]">{stat.value}</p>
              <p className="text-[10px] font-semibold text-[#676a79] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
        <button type="button" className="inline-flex items-center gap-2 text-sm font-bold text-[#0f6fec] hover:underline">
          <Send size={15} />
          Send another invitation
        </button>
      </TCard>
    </MemberShell>
  );
}
