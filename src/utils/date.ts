export function getDaysRemaining(dueDateIso: string, now: Date = new Date()): number {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(dueDateIso);
  const startOfDue = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  return Math.round((startOfDue.getTime() - startOfToday.getTime()) / 86_400_000);
}

export function isOverdue(dueDateIso: string, completed: boolean, now?: Date): boolean {
  return !completed && getDaysRemaining(dueDateIso, now) < 0;
}

export function formatCountdown(dueDateIso: string, completed: boolean): string {
  if (completed) return 'Đã hoàn thành';
  const days = getDaysRemaining(dueDateIso);
  if (days < 0) return `Quá hạn ${Math.abs(days)} ngày`;
  if (days === 0) return 'Hết hạn hôm nay';
  if (days === 1) return 'Còn 1 ngày';
  return `Còn ${days} ngày`;
}
