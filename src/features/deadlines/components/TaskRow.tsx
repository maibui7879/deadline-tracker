import { createContext, useContext } from 'react';
import type { Deadline } from '../deadlineTypes';
import { PRIORITY_LABEL } from '../deadlineTypes';
import { formatCountdown, getDaysRemaining } from '../../../utils/date';
import { IconCheck, IconCheckCircle, IconTrash } from '../../../components/icons';

interface RowContextValue {
  item: Deadline;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const RowContext = createContext<RowContextValue | null>(null);

function useRowContext(): RowContextValue {
  const ctx = useContext(RowContext);
  if (!ctx) throw new Error('TaskRow.* phải nằm trong <TaskRow.Root>');
  return ctx;
}

const priorityPill: Record<Deadline['priority'], string> = {
  high: 'bg-red-50 text-red-700',
  medium: 'bg-amber-50 text-amber-700',
  low: 'bg-slate-100 text-slate-500',
};

function Root({
  item,
  onToggle,
  onDelete,
  children,
}: RowContextValue & { children: React.ReactNode }) {
  return (
    <RowContext.Provider value={{ item, onToggle, onDelete }}>
      <tr
        className={`border-t border-border transition-colors duration-200 hover:bg-slate-50/70 ${
          item.completed ? 'text-muted-foreground' : ''
        }`}
      >
        {children}
      </tr>
    </RowContext.Provider>
  );
}

function Select() {
  const { item, onToggle } = useRowContext();
  return (
    <td className="py-3.5 pl-4 pr-2">
      <button
        type="button"
        role="checkbox"
        aria-checked={item.completed}
        aria-label={item.completed ? `Bỏ đánh dấu: ${item.title}` : `Đánh dấu hoàn thành: ${item.title}`}
        onClick={() => onToggle(item.id)}
        className={`inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border transition-colors duration-200 ${
          item.completed
            ? 'border-green-600 bg-green-600 text-white'
            : 'border-slate-300 bg-white text-transparent hover:border-primary'
        }`}
      >
        <IconCheck width={13} height={13} />
      </button>
    </td>
  );
}

function Subject() {
  const { item } = useRowContext();
  return (
    <td className="px-3 py-3.5">
      <p className={`text-sm font-semibold ${item.completed ? '' : 'text-foreground'}`}>{item.subject}</p>
      {item.code && <p className="mt-0.5 text-xs text-muted-foreground">{item.code}</p>}
    </td>
  );
}

function Title() {
  const { item } = useRowContext();
  return (
    <td className="px-3 py-3.5">
      <p
        className={`text-sm font-semibold ${item.completed ? 'line-through' : 'text-foreground'}`}
      >
        {item.title}
      </p>
      {item.detail && <p className="mt-0.5 text-xs text-muted-foreground">{item.detail}</p>}
    </td>
  );
}

function Due() {
  const { item } = useRowContext();
  const due = new Date(item.dueDate);
  const date = due.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const days = getDaysRemaining(item.dueDate);
  const overdue = !item.completed && days < 0;
  return (
    <td className="whitespace-nowrap px-3 py-3.5">
      <p className={`text-sm font-bold tabular-nums ${item.completed ? '' : 'text-foreground'}`}>{date}</p>
      <p
        className={`mt-0.5 text-xs font-medium ${
          item.completed ? '' : overdue ? 'text-red-600' : 'text-amber-700'
        }`}
      >
        {formatCountdown(item.dueDate, item.completed)}
      </p>
    </td>
  );
}

function Priority() {
  const { item } = useRowContext();
  return (
    <td className="whitespace-nowrap px-3 py-3.5">
      <span
        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold ${priorityPill[item.priority]}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
        {PRIORITY_LABEL[item.priority]}
      </span>
    </td>
  );
}

function Status() {
  const { item } = useRowContext();
  if (item.completed) {
    return (
      <td className="whitespace-nowrap px-3 py-3.5">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-green-700">
          <IconCheckCircle width={15} height={15} />
          Đã hoàn thành
        </span>
      </td>
    );
  }
  return (
    <td className="whitespace-nowrap px-3 py-3.5">
      <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-300" aria-hidden="true" />
        Chưa hoàn thành
      </span>
    </td>
  );
}

function Delete() {
  const { item, onDelete } = useRowContext();
  return (
    <td className="py-3.5 pl-2 pr-4 text-right">
      <button
        type="button"
        onClick={() => {
          if (confirm(`Xoá bài tập "${item.title}"?`)) onDelete(item.id);
        }}
        aria-label={`Xoá bài tập: ${item.title}`}
        className="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
      >
        <IconTrash width={17} height={17} />
      </button>
    </td>
  );
}

export const TaskRow = { Root, Select, Subject, Title, Due, Priority, Status, Delete };
