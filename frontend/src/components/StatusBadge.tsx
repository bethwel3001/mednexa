import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const norm = status.toLowerCase();
  
  let styles = 'bg-[#F4F5F7] text-[#56616B] border-[#E9EBEF]';
  let dotColor = 'bg-[#8C94A0]';
  let label = status.charAt(0).toUpperCase() + status.slice(1);

  if (norm === 'accepted' || norm === 'completed' || norm === 'paid' || norm === 'verified' || norm === 'available') {
    styles = 'bg-emerald-50 text-emerald-800 border-emerald-200/60';
    dotColor = 'bg-emerald-500';
    if (norm === 'accepted') label = 'Confirmed';
  } else if (norm === 'requested' || norm === 'pending' || norm === 'unpaid') {
    styles = 'bg-amber-50 text-amber-800 border-amber-200/60';
    dotColor = 'bg-amber-500';
    if (norm === 'requested') label = 'Awaiting Approval';
  } else if (norm === 'declined' || norm === 'cancelled' || norm === 'failed' || norm === 'escalated') {
    styles = 'bg-rose-50 text-rose-800 border-rose-200/60';
    dotColor = 'bg-rose-500';
    if (norm === 'escalated') label = 'Attention Needed';
  }

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${styles} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  );
};
