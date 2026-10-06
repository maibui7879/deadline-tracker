import { useMemo } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectDeadlineItems } from '../deadlineSelectors';
import { groupBy } from '../../../types';
import { isOverdue } from '../../../utils/date';
import { IconBook } from '../../../components/icons';

interface Props {
  onSelect: (subject: string) => void;
}

export function SubjectsView({ onSelect }: Props) {
  const items = useAppSelector(selectDeadlineItems);

  const groups = useMemo(() => {
    const by = groupBy(items, (d) => d.subject);
    return Object.entries(by)
      .map(([subject, list]) => ({
        subject,
        code: list.find((d) => d.code)?.code ?? '',
        total: list.length,
        pending: list.filter((d) => !d.completed).length,
        overdue: list.filter((d) => isOverdue(d.dueDate, d.completed)).length,
      }))
      .sort((a, b) => b.overdue - a.overdue || b.pending - a.pending);
  }, [items]);

  return (
    <div>
      <h1 className="text-[28px] font-extrabold tracking-tight text-foreground">Môn học</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {groups.length} môn học đang theo dõi. Chọn một môn để xem các bài tập của môn đó.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {groups.map((g) => (
          <button
            key={g.subject}
            type="button"
            onClick={() => onSelect(g.subject)}
            className="cursor-pointer rounded-xl border border-border bg-card p-4 text-left transition-colors duration-200 hover:border-primary/50"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-primary">
              <IconBook width={18} height={18} />
            </span>
            <span className="mt-2.5 block text-[15px] font-bold text-foreground">{g.subject}</span>
            {g.code && <span className="mt-0.5 block text-xs text-muted-foreground">{g.code}</span>}
            <span className="mt-2 block text-[13px] text-muted-foreground tabular-nums">
              {g.total} bài tập · {g.pending} chưa xong
              {g.overdue > 0 && <span className="font-semibold text-red-600"> · {g.overdue} quá hạn</span>}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
