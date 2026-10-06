import { useMemo, useState } from 'react';
import { useAppSelector } from './app/hooks';
import { selectDeadlineItems } from './features/deadlines/deadlineSelectors';
import { useDeadlines } from './hooks/useDeadlines';
import { Sidebar, type NavKey } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { StatCards } from './features/deadlines/components/StatCards';
import { TaskTable } from './features/deadlines/components/TaskTable';
import { AddTaskModal, type SubjectOption } from './features/deadlines/components/AddTaskModal';
import { SubjectsView } from './features/deadlines/components/SubjectsView';
import { IconCalendar, IconPlus } from './components/icons';

type Route = 'tasks' | 'subjects';

function todayLabel(): string {
  return new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function App() {
  const {
    items,
    stats,
    status,
    error,
    filter,
    search,
    setSearch,
    changeFilter,
    sort,
    setSort,
    add,
    toggle,
    remove,
    reload,
    isLoading,
  } = useDeadlines();
  const allItems = useAppSelector(selectDeadlineItems);

  const [route, setRoute] = useState<Route>('tasks');
  const [nav, setNav] = useState<NavKey>('tasks');
  const [addOpen, setAddOpen] = useState(false);

  const subjects: SubjectOption[] = useMemo(() => {
    const map = new Map<string, string>();
    for (const d of allItems) {
      if (!map.has(d.subject)) map.set(d.subject, d.code ?? '');
    }
    return [...map.entries()].map(([name, code]) => ({ name, code }));
  }, [allItems]);

  const goTasks = (navKey: NavKey = 'tasks') => {
    setNav(navKey);
    setRoute('tasks');
  };

  const handleNavigate = (key: NavKey) => {
    if (key === 'subjects') {
      setNav('subjects');
      setRoute('subjects');
      return;
    }
    changeFilter('all');
    goTasks(key);
  };

  const crumb = route === 'subjects' ? 'Môn học' : 'Bài tập của tôi';
  const reference = todayLabel();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
      >
        Bỏ qua tới nội dung chính
      </a>

      <Sidebar active={nav} onNavigate={handleNavigate} completed={stats.completed} total={stats.total} subjectCount={subjects.length} />

      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        <Topbar crumb={crumb} />

        <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
          {route === 'subjects' ? (
            <SubjectsView
              onSelect={(subject) => {
                setSearch(subject);
                changeFilter('all');
                goTasks('tasks');
              }}
            />
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="mt-1 text-[28px] font-extrabold tracking-tight">Bài tập của tôi</h1>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    type="button"
                    onClick={() => setAddOpen(true)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
                  >
                    <IconPlus width={16} height={16} />
                    Thêm bài tập
                  </button>
                  <p className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
                    <IconCalendar width={14} height={14} />
                    Ngày tham chiếu: {reference}
                  </p>
                </div>
              </div>

              <StatCards
                pending={stats.pending}
                dueSoon={stats.dueSoon}
                overdue={stats.overdue}
                completed={stats.completed}
              />

              <TaskTable
                items={items}
                totalCount={stats.total}
                filter={filter}
                onFilter={changeFilter}
                counts={stats}
                search={search}
                onSearch={setSearch}
                sort={sort}
                onSort={setSort}
                onToggle={toggle}
                onDelete={remove}
                isLoading={isLoading && items.length === 0}
                error={error}
                isEmpty={status === 'succeeded' && items.length === 0}
                onRetry={reload}
              />
            </div>
          )}
        </main>
      </div>

      {addOpen && (
        <AddTaskModal
          subjects={subjects}
          onAdd={(dto) => {
            add(dto);
            changeFilter('all');
            setAddOpen(false);
          }}
          onClose={() => setAddOpen(false)}
        />
      )}
    </div>
  );
}
