import type { Entity } from '../../types';

export type Priority = 'low' | 'medium' | 'high';

export type DeadlineFilter = 'all' | 'pending' | 'overdue' | 'completed';

export type DeadlineSort = 'nearest' | 'farthest';

export interface Deadline extends Entity<string> {
  subject: string;
  code?: string;
  title: string;
  detail?: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
}

export type CreateDeadlineDto = Omit<Deadline, 'id' | 'completed'>;

export type UpdateDeadlineDto = Partial<Omit<Deadline, 'id'>> & { id: string };

export type DeadlineFormValues = Pick<Deadline, 'subject' | 'title' | 'dueDate' | 'priority'> & {
  code?: string;
  detail?: string;
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
};

export const FILTER_LABEL: Record<DeadlineFilter, string> = {
  all: 'Tất cả',
  pending: 'Chưa hoàn thành',
  overdue: 'Quá hạn',
  completed: 'Đã hoàn thành',
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isPriority(value: unknown): value is Priority {
  return value === 'low' || value === 'medium' || value === 'high';
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === 'string';
}

export function isDeadline(value: unknown): value is Deadline {
  if (!isObject(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.subject === 'string' &&
    isOptionalString(value.code) &&
    typeof value.title === 'string' &&
    isOptionalString(value.detail) &&
    typeof value.dueDate === 'string' &&
    !Number.isNaN(Date.parse(value.dueDate)) &&
    isPriority(value.priority) &&
    typeof value.completed === 'boolean'
  );
}

export function isDeadlineArray(value: unknown): value is Deadline[] {
  return Array.isArray(value) && value.every(isDeadline);
}
