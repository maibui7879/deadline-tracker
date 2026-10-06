import type { Deadline, DeadlineFilter, DeadlineSort } from '../deadlineTypes';
import { FILTER_LABEL } from '../deadlineTypes';
import { TaskRow } from './TaskRow';
import { withListState } from '../../../components/withListState';
import { IconChevronDown, IconFilter, IconHelp, IconSearch } from '../../../components/icons';

interface Props {
  items: Deadline[];
  totalCount: number;
  filter: DeadlineFilter;
  onFilter: (f: DeadlineFilter) => void;
  counts: { total: number; pending: number; overdue: number; completed: number };
  search: string;
  onSearch: (v: string) => void;
  sort: DeadlineSort;
  onSort: (s: DeadlineSort) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TABS: DeadlineFilter[] = ['all', 'pending', 'overdue', 'completed'];

function BaseTable({
  items,
  totalCount,
  filter,
  onFilter,
  counts,
  search,
  onSearch,
  sort,
  onSort,
  onToggle,
  onDelete,
}: Props) {
  const countOf = (f: DeadlineFilter) =>
    f === 'all' ? counts.total : f === 'pending' ? counts.pending : f === 'overdue' ? counts.overdue : counts.completed;

  return (
    <section aria-label="Danh sách bài tập" className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-4">
        <h2 className="text-[15px] font-bold text-foreground">
          Danh sách bài tập{' '}
          <span className="ml-1 text-[13px] font-medium text-muted-foreground">{totalCount} bài tập</span>
        </h2>
        <label className="relative inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
          <IconFilter width={14} height={14} aria-hidden="true" />
          <span className="sr-only">Sắp xếp</span>
          <span className="relative inline-flex items-center">
            <select
              value={sort}
              onChange={(e) => onSort(e.target.value as DeadlineSort)}
              aria-label="Sắp xếp bài tập"
              className="cursor-pointer appearance-none bg-transparent py-1 pl-1 pr-6 outline-none hover:text-foreground"
            >
              <option value="nearest">Hạn gần nhất trước</option>
              <option value="farthest">Hạn xa nhất trước</option>
            </select>
            <IconChevronDown width={14} height={14} className="pointer-events-none absolute right-1" />
          </span>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-3">
        <div className="flex flex-wrap gap-1" role="tablist" aria-label="Lọc theo trạng thái">
          {TABS.map((t) => {
            const isActive = filter === t;
            return (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onFilter(t)}
                className={`cursor-pointer rounded-md px-2.5 py-1.5 text-[13px] transition-colors duration-200 ${
                  isActive
                    ? 'bg-indigo-50 font-semibold text-primary'
                    : 'font-medium text-muted-foreground hover:text-foreground'
                }`}
              >
                {FILTER_LABEL[t]}{' '}
                <span
                  className={`ml-0.5 rounded px-1 text-xs tabular-nums ${
                    isActive ? 'bg-indigo-100 text-primary' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {countOf(t)}
                </span>
              </button>
            );
          })}
        </div>
        <span className="relative block w-full sm:w-64">
          <IconSearch
            width={15}
            height={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Tìm tên bài tập, môn học…"
            aria-label="Tìm kiếm bài tập"
            className="w-full rounded-lg border border-border bg-card py-1.5 pl-9 pr-3 text-[13px] outline-none transition-colors duration-200 placeholder:text-muted-foreground/70 focus:border-primary"
          />
        </span>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse">
          <thead>
            <tr className="border-y border-border bg-slate-50/70 text-left">
              <th className="w-12 py-2.5 pl-4 pr-2">
                <span className="sr-only">Chọn</span>
                <span aria-hidden="true" className="text-xs text-muted-foreground">✓</span>
              </th>
              {['Môn học', 'Tên bài tập', 'Hạn nộp', 'Độ ưu tiên', 'Trạng thái'].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {h}
                </th>
              ))}
              <th scope="col" className="py-2.5 pl-2 pr-4 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Xóa
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((d) => (
              <TaskRow.Root key={d.id} item={d} onToggle={onToggle} onDelete={onDelete}>
                <TaskRow.Select />
                <TaskRow.Subject />
                <TaskRow.Title />
                <TaskRow.Due />
                <TaskRow.Priority />
                <TaskRow.Status />
                <TaskRow.Delete />
              </TaskRow.Root>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-5 py-3 text-xs text-muted-foreground">
        <p className="inline-flex items-center gap-1.5">
          <IconHelp width={14} height={14} aria-hidden="true" />
          Chọn ô để hoàn thành · Bỏ chọn để mở lại bài tập
        </p>
        <p className="tabular-nums">
          Hiển thị {items.length} / {totalCount} bài tập
        </p>
      </div>
    </section>
  );
}

export const TaskTable = withListState(BaseTable, 'Chưa có bài tập nào khớp bộ lọc.');
