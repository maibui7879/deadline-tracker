import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { filterAndSort } from '../../types';
import { getDaysRemaining, isOverdue } from '../../utils/date';

export const selectDeadlineItems = (s: RootState) => s.deadlines.items;
export const selectDeadlineStatus = (s: RootState) => s.deadlines.status;
export const selectDeadlineError = (s: RootState) => s.deadlines.error;
export const selectDeadlineFilter = (s: RootState) => s.deadlines.filter;
export const selectDeadlineSearch = (s: RootState) => s.deadlines.search;

export const selectFilteredDeadlines = createSelector(
  [selectDeadlineItems, selectDeadlineFilter, selectDeadlineSearch],
  (items, filter, search) => {
    const keyword = search.trim().toLowerCase();
    return filterAndSort(
      items,
      (d) => {
        const matchFilter =
          filter === 'all'
            ? true
            : filter === 'completed'
              ? d.completed
              : filter === 'overdue'
                ? !d.completed && isOverdue(d.dueDate, d.completed)
                : !d.completed;
        const matchSearch =
          keyword === '' ||
          d.title.toLowerCase().includes(keyword) ||
          d.subject.toLowerCase().includes(keyword) ||
          (d.code ?? '').toLowerCase().includes(keyword);
        return matchFilter && matchSearch;
      },
      (a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return +new Date(a.dueDate) - +new Date(b.dueDate);
      },
    );
  },
);

export const selectDeadlineStats = createSelector([selectDeadlineItems], (items) => {
  const pending = items.filter((d) => !d.completed);
  return {
    total: items.length,
    completed: items.filter((d) => d.completed).length,
    pending: pending.length,
    overdue: items.filter((d) => isOverdue(d.dueDate, d.completed)).length,
    dueSoon: pending.filter((d) => {
      const days = getDaysRemaining(d.dueDate);
      return days >= 0 && days <= 7;
    }).length,
  };
});
