import { IconBook, IconClipboard, IconGrid } from './icons';

export type NavKey = 'tasks' | 'subjects';

interface Props {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  completed: number;
  total: number;
  subjectCount: number;
}

const NAV: ReadonlyArray<{ key: NavKey; label: string; icon: typeof IconGrid }> = [
  { key: 'tasks', label: 'Bài tập của tôi', icon: IconGrid },
  { key: 'subjects', label: 'Môn học', icon: IconBook },
];

export function Sidebar({ active, onNavigate, completed, total, subjectCount }: Props) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <aside className="fixed left-0 top-0 z-20 hidden h-screen w-60 shrink-0 flex-col overflow-y-auto border-r border-border bg-card px-4 py-5 lg:flex">
      <div className="flex items-center gap-2.5 px-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
          <IconClipboard width={20} height={20} />
        </span>
        <div>
          <p className="text-[17px] font-extrabold leading-tight text-foreground">Deadline Tracker</p>
        </div>
      </div>

      <p className="mb-2 mt-7 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Menu
      </p>
      <nav className="flex flex-col gap-1" aria-label="Điều hướng chính">
        {NAV.map((n) => {
          const Icon = n.icon;
          const isActive = active === n.key;
          return (
            <button
              key={n.key}
              type="button"
              onClick={() => onNavigate(n.key)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${
                isActive
                  ? 'bg-indigo-50 font-semibold text-primary'
                  : 'font-medium text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon width={18} height={18} />
              {n.label}
            </button>
          );
        })}
      </nav>

      <p className="mb-2 mt-7 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Học kỳ hiện tại
      </p>
      <div className="px-2">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          Học kỳ I · 2026–2027
        </p>
        <p className="mt-1 text-[13px] text-muted-foreground tabular-nums">{subjectCount} môn học đang theo dõi</p>
      </div>

      <div className="mt-auto">
        <div className="rounded-xl bg-indigo-50/70 p-4">
          <p className="text-[13px] leading-snug text-muted-foreground tabular-nums" role="status">
            Đã hoàn thành {completed}/{total} bài tập.
          </p>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white" aria-hidden="true">
            <div className="h-full rounded-full bg-primary transition-[width] duration-200" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </aside>
  );
}
