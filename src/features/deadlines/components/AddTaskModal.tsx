import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import type { DeadlineFormValues, Priority } from '../deadlineTypes';
import { PRIORITY_LABEL } from '../deadlineTypes';
import { formatCountdown } from '../../../utils/date';
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconPlus,
} from '../../../components/icons';

export interface SubjectOption {
  name: string;
  code: string;
}

interface Props {
  subjects: SubjectOption[];
  onAdd: (dto: DeadlineFormValues) => void;
  onClose: () => void;
}

const PRIORITY_META: ReadonlyArray<{ value: Priority; hint: string }> = [
  { value: 'low', hint: 'Có thể làm sau' },
  { value: 'medium', hint: 'Theo kế hoạch' },
  { value: 'high', hint: 'Cần tập trung sớm' },
];

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

function toInputDate(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function DueDateCalendar({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (isoDate: string) => void;
}) {
  const parsed = Number.isNaN(Date.parse(selected)) ? new Date() : new Date(`${selected}T12:00:00`);
  const [year, setYear] = useState(parsed.getFullYear());
  const [month, setMonth] = useState(parsed.getMonth());
  const todayKey = toInputDate(new Date());

  const cells = useMemo(() => {
    const firstOffset = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const list: (number | null)[] = Array<null>(firstOffset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) list.push(d);
    while (list.length % 7 !== 0) list.push(null);
    return list;
  }, [year, month]);

  const goMonth = (delta: number) => {
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  };

  const pick = (day: number) => {
    onSelect(toInputDate(new Date(year, month, day)));
  };

  return (
    <div className="rounded-xl border border-border bg-slate-50/60 p-3.5" role="group" aria-label="Chọn ngày hết hạn">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold tabular-nums text-foreground">
          Tháng {month + 1}, {year}
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => goMonth(-1)}
            aria-label="Tháng trước"
            className="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors duration-200 hover:bg-white hover:text-foreground"
          >
            <IconChevronLeft width={15} height={15} />
          </button>
          <button
            type="button"
            onClick={() => goMonth(1)}
            aria-label="Tháng sau"
            className="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors duration-200 hover:bg-white hover:text-foreground"
          >
            <IconChevronRight width={15} height={15} />
          </button>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-0.5 text-center" role="grid" aria-label="Lịch chọn ngày">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-1 text-[11px] font-semibold uppercase text-muted-foreground">
            {d}
          </span>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <span key={`e-${i}`} />;
          const key = toInputDate(new Date(year, month, day));
          const isSelected = key === selected;
          const isToday = key === todayKey;
          return (
            <button
              key={day}
              type="button"
              onClick={() => pick(day)}
              aria-pressed={isSelected}
              aria-label={`Chọn ngày ${day} tháng ${month + 1}`}
              className={`inline-flex h-8 cursor-pointer items-center justify-center rounded-lg text-[13px] tabular-nums transition-colors duration-150 ${
                isSelected
                  ? 'bg-primary font-bold text-white'
                  : isToday
                    ? 'font-bold text-primary ring-1 ring-primary hover:bg-indigo-50'
                    : 'font-medium text-foreground hover:bg-indigo-50 hover:text-primary-dark'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function AddTaskModal({ subjects, onAdd, onClose }: Props) {
  const [subject, setSubject] = useState(subjects[0]?.name ?? '');
  const [customSubject, setCustomSubject] = useState(false);
  const [code, setCode] = useState(subjects[0]?.code ?? '');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => toInputDate(new Date(Date.now() + 7 * 86_400_000)));
  const [time, setTime] = useState('23:59');
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState('');
  const firstFieldRef = useRef<HTMLInputElement | HTMLSelectElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstFieldRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const dueIso = useMemo(() => {
    const parsed = Date.parse(`${date}T${time || '23:59'}:00`);
    return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
  }, [date, time]);

  const countdown = dueIso ? formatCountdown(dueIso, false) : '—';
  const previewCode = subjects.find((s) => s.name === subject)?.code ?? code;
  const filledCount =
    [subject.trim() !== '', title.trim() !== '', date !== ''].filter(Boolean).length + 1;

  const handleSubjectChange = (value: string) => {
    if (value === '__custom__') {
      setCustomSubject(true);
      setSubject('');
      setCode('');
      return;
    }
    setCustomSubject(false);
    setSubject(value);
    setCode(subjects.find((s) => s.name === value)?.code ?? '');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !title.trim() || !date || !dueIso) {
      setError('Vui lòng điền đầy đủ Môn học, Tên bài tập và Hạn nộp.');
      return;
    }
    setError('');
    onAdd({
      subject: subject.trim(),
      code: previewCode.trim(),
      title: title.trim(),
      dueDate: dueIso,
      priority,
    });
  };

  const inputCls =
    'w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground/70 focus:border-primary';
  const labelCls = 'mb-1.5 block text-sm font-bold text-foreground';

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Thêm bài tập mới"
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-card"
      >
        <div className="flex items-start justify-between gap-2 border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-foreground">Thêm bài tập mới</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="cursor-pointer rounded-lg p-1.5 text-xl leading-none text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="add-subject" className={labelCls}>
                  Môn học *
                </label>
                {customSubject ? (
                  <div className="grid gap-2">
                    <input
                      id="add-subject"
                      ref={firstFieldRef as React.RefObject<HTMLInputElement>}
                      className={inputCls}
                      placeholder="Nhập tên môn học mới"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                    <input
                      className={inputCls}
                      placeholder="Mã môn (VD: IT999)"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      aria-label="Mã môn học"
                    />
                  </div>
                ) : (
                  <select
                    id="add-subject"
                    ref={firstFieldRef as React.RefObject<HTMLSelectElement>}
                    className={`${inputCls} cursor-pointer appearance-none`}
                    value={subject}
                    onChange={(e) => handleSubjectChange(e.target.value)}
                  >
                    {subjects.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                    <option value="__custom__">＋ Môn học khác…</option>
                  </select>
                )}
                {!customSubject && previewCode && (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {previewCode} · Học kỳ I, năm học 2026–2027
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="add-title" className={labelCls}>
                  Tên bài tập *
                </label>
                <input
                  id="add-title"
                  className={inputCls}
                  placeholder="Báo cáo tiến độ đồ án giữa kỳ"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  aria-required="true"
                />
              </div>

              <div>
                <label htmlFor="add-time" className="mb-1.5 block text-sm font-semibold text-muted-foreground">
                  Giờ nộp
                </label>
                <input
                  id="add-time"
                  type="time"
                  className={inputCls}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <span className={labelCls} id="due-calendar-label">
                Hạn nộp *
              </span>
              <DueDateCalendar selected={date} onSelect={setDate} />
              {dueIso && (
                <p className="mt-2 flex items-center gap-2 rounded-lg bg-indigo-50/70 px-3 py-2 text-[13px] font-medium text-primary-dark" role="status">
                  <IconCalendar width={15} height={15} />
                  {countdown} · Giờ Việt Nam (UTC+7)
                </p>
              )}
            </div>

            <fieldset className="sm:col-span-2">
              <legend className={labelCls}>Độ ưu tiên *</legend>
              <div className="grid gap-2.5 sm:grid-cols-3" role="radiogroup" aria-label="Độ ưu tiên">
                {PRIORITY_META.map((p) => {
                  const selected = priority === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setPriority(p.value)}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-lg border p-3 text-left transition-colors duration-200 ${
                        selected ? 'border-primary bg-indigo-50/60' : 'border-border hover:border-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          selected ? 'border-primary' : 'border-slate-300'
                        }`}
                        aria-hidden="true"
                      >
                        {selected && <span className="h-2 w-2 rounded-full bg-primary" />}
                      </span>
                      <span>
                        <span className={`block text-sm font-bold ${selected ? 'text-primary-dark' : 'text-foreground'}`}>
                          {PRIORITY_LABEL[p.value]}
                        </span>
                        <span className="block text-xs text-muted-foreground">{p.hint}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <p className="flex items-center gap-2 text-[13px] text-muted-foreground sm:col-span-2">
              <IconClock width={15} height={15} className="shrink-0" />
              Bài tập mới sẽ có trạng thái Chưa hoàn thành. Bạn có thể đánh dấu sau.
            </p>

            {error && (
              <p className="text-sm font-medium text-red-600 sm:col-span-2" role="alert">
                {error}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-slate-50/60 px-6 py-4">
            <p className="text-xs text-muted-foreground tabular-nums">
              {filledCount}/4 thông tin bắt buộc đã được điền
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-lg border border-border bg-card px-5 py-2 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-muted"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
              >
                <IconPlus width={15} height={15} />
                Lưu bài tập
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
