import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { COLUMN_PANEL, COLUMN_TITLE, PANEL_HEADER, PANEL_HEADER_TITLE_WRAP } from '../ui/tokens';

type BoardColumnProps = {
  accentClassName: string;
  badge: ReactNode;
  children: ReactNode;
  headerAction?: ReactNode;
  title: string;
} & Omit<ComponentPropsWithoutRef<'section'>, 'children' | 'title'>;

export function BoardColumn({
  accentClassName,
  badge,
  children,
  className,
  headerAction,
  title,
  ...rest
}: BoardColumnProps) {
  return (
    <section
      className={`${COLUMN_PANEL} ${accentClassName} ${className ?? 'border-white/80'}`}
      {...rest}
    >
      <div className={PANEL_HEADER}>
        <div className={PANEL_HEADER_TITLE_WRAP}>
          <h2 className={COLUMN_TITLE}>{title}</h2>
          {badge}
        </div>
        {headerAction}
      </div>
      {children}
    </section>
  );
}
