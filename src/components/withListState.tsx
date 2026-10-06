import type { ComponentType } from 'react';

interface WithListStateProps {
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  onRetry?: () => void;
}

export function withListState<P extends object>(
  Wrapped: ComponentType<P>,
  emptyMessage = 'Chưa có bài tập nào.',
) {
  return function WithListState(props: P & WithListStateProps) {
    const { isLoading, error, isEmpty, onRetry, ...rest } = props;

    if (isLoading) {
      return (
        <div
          className="flex items-center justify-center gap-3 rounded-lg border border-border bg-card py-12 text-sm text-muted-foreground"
          role="status"
          aria-label="Đang tải danh sách deadline"
        >
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
          Đang tải…
        </div>
      );
    }

    if (error) {
      return (
        <div
          className="rounded-lg border border-border bg-card px-5 py-8 text-center"
          role="alert"
        >
          <p className="text-sm font-medium text-destructive">{error}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 cursor-pointer rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
            >
              Thử lại
            </button>
          )}
        </div>
      );
    }

    if (isEmpty) {
      return (
        <div className="rounded-lg border border-dashed border-border bg-card px-5 py-12 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      );
    }

    return <Wrapped {...(rest as P)} />;
  };
}
