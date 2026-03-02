import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { TASK_CARD, TASK_CARD_DEFAULT, TASK_TIME, TASK_TITLE } from '../ui/tokens';

type TaskCardProps = {
  badge?: ReactNode;
  className?: string;
  footer?: ReactNode;
  title: string;
  timestamp: number;
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
};

function TaskCardContent({
  badge,
  footer,
  timestamp,
  title,
}: Omit<TaskCardProps, 'buttonProps' | 'className'>) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className={TASK_TITLE}>{title}</span>
        {badge}
      </div>
      <span className={TASK_TIME}>{new Date(timestamp).toLocaleTimeString()}</span>
      {footer ? <div className="grid gap-3">{footer}</div> : null}
    </>
  );
}

export function TaskCard({
  badge,
  buttonProps,
  className,
  footer,
  timestamp,
  title,
}: TaskCardProps) {
  const rootClassName = `${TASK_CARD} ${className ?? TASK_CARD_DEFAULT}`;

  if (buttonProps) {
    return (
      <button type="button" className={rootClassName} {...buttonProps}>
        <TaskCardContent badge={badge} footer={footer} timestamp={timestamp} title={title} />
      </button>
    );
  }

  return (
    <div className={rootClassName}>
      <TaskCardContent badge={badge} footer={footer} timestamp={timestamp} title={title} />
    </div>
  );
}
