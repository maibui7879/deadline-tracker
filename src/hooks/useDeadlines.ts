import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  addDeadline,
  deleteDeadline,
  fetchDeadlines,
  setFilter,
  setSearch,
  toggleDeadline,
} from '../features/deadlines/deadlineSlice';
import {
  selectDeadlineError,
  selectDeadlineFilter,
  selectDeadlineSearch,
  selectDeadlineStats,
  selectDeadlineStatus,
  selectFilteredDeadlines,
} from '../features/deadlines/deadlineSelectors';
import type {
  CreateDeadlineDto,
  DeadlineFilter,
  DeadlineSort,
} from '../features/deadlines/deadlineTypes';

export function useDeadlines() {
  const dispatch = useAppDispatch();
  const baseItems = useAppSelector(selectFilteredDeadlines);
  const stats = useAppSelector(selectDeadlineStats);
  const status = useAppSelector(selectDeadlineStatus);
  const error = useAppSelector(selectDeadlineError);
  const filter = useAppSelector(selectDeadlineFilter);
  const search = useAppSelector(selectDeadlineSearch);

  const [localSearch, setLocalSearch] = useState(search);
  const [sort, setSort] = useState<DeadlineSort>('nearest');

  useEffect(() => {
    if (status === 'idle') void dispatch(fetchDeadlines());
  }, [dispatch, status]);

  useEffect(() => {
    const t = setTimeout(() => dispatch(setSearch(localSearch)), 300);
    return () => clearTimeout(t);
  }, [localSearch, dispatch]);

  const add = useCallback(
    (dto: CreateDeadlineDto) => dispatch(addDeadline(dto)),
    [dispatch],
  );
  const toggle = useCallback((id: string) => dispatch(toggleDeadline(id)), [dispatch]);
  const remove = useCallback((id: string) => dispatch(deleteDeadline(id)), [dispatch]);
  const changeFilter = useCallback(
    (f: DeadlineFilter) => dispatch(setFilter(f)),
    [dispatch],
  );

  const items = useMemo(
    () => (sort === 'nearest' ? baseItems : [...baseItems].reverse()),
    [baseItems, sort],
  );

  return {
    items,
    stats,
    status,
    error,
    filter,
    search: localSearch,
    setSearch: setLocalSearch,
    changeFilter,
    sort,
    setSort,
    add,
    toggle,
    remove,
    reload: () => dispatch(fetchDeadlines()),
    isLoading: status === 'loading',
  };
}

export type UseDeadlinesReturn = ReturnType<typeof useDeadlines>;
