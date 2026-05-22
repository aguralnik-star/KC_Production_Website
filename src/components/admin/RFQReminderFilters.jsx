import { Search } from 'lucide-react';

const BUCKET_OPTIONS = [
  { value: 'all', label: 'All buckets' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'due_today', label: 'Due Today' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'no_follow_up', label: 'No Follow-Up' },
];

const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All priorities' },
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export default function RFQReminderFilters({
  searchQuery,
  onSearchChange,
  bucketFilter,
  onBucketChange,
  priorityFilter,
  onPriorityChange,
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-metallic" aria-hidden="true" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search company, contact, project…"
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>
      <select
        value={bucketFilter}
        onChange={(e) => onBucketChange(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-charcoal focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        aria-label="Filter by queue bucket"
      >
        {BUCKET_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <select
        value={priorityFilter}
        onChange={(e) => onPriorityChange(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-charcoal focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        aria-label="Filter by priority"
      >
        {PRIORITY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}
