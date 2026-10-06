import { IconHome } from './icons';

interface Props {
  crumb: string;
}

export function Topbar({ crumb }: Props) {
  return (
    <div className="flex items-center gap-2 border-b border-border bg-card px-6 py-3.5 text-sm">
      <IconHome width={16} height={16} className="shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="truncate font-semibold text-foreground" aria-current="page">
        {crumb}
      </span>
    </div>
  );
}
