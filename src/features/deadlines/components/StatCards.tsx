import { IconAlert, IconCalendarDays, IconCheckCircle, IconClipboard } from '../../../components/icons';

interface Props {
  pending: number;
  dueSoon: number;
  overdue: number;
  completed: number;
}

export function StatCards({ pending, dueSoon, overdue, completed }: Props) {
  const cards = [
    {
      label: 'Chưa hoàn thành',
      value: pending,
      icon: IconClipboard,
      valueCls: 'text-primary',
      tileCls: 'bg-indigo-50 text-primary',
    },
    {
      label: 'Đến hạn trong 7 ngày',
      value: dueSoon,
      icon: IconCalendarDays,
      valueCls: 'text-amber-700',
      tileCls: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Đã quá hạn',
      value: overdue,
      icon: IconAlert,
      valueCls: 'text-red-600',
      tileCls: 'bg-red-50 text-red-500',
    },
    {
      label: 'Đã hoàn thành',
      value: completed,
      icon: IconCheckCircle,
      valueCls: 'text-green-700',
      tileCls: 'bg-green-50 text-green-600',
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4" role="status" aria-label="Tổng quan bài tập">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[13px] font-medium text-muted-foreground">{c.label}</p>
              <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${c.tileCls}`}>
                <Icon width={18} height={18} />
              </span>
            </div>
            <p className={`mt-1 text-3xl font-extrabold tabular-nums ${c.valueCls}`}>{c.value}</p>
          </div>
        );
      })}
    </div>
  );
}
