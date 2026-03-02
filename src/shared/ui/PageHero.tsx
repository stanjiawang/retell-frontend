import type { ReactNode } from 'react';
import {
  HERO_BODY,
  HERO_CONTENT,
  HERO_COPY_WRAP,
  HERO_EYEBROW,
  HERO_ROW,
  HERO_SHELL,
  HERO_TITLE,
} from './tokens';

type PageHeroProps = {
  action?: ReactNode;
  backgroundClassName: string;
  body: string;
  bodyClassName?: string;
  contentClassName?: string;
  eyebrow: string;
  eyebrowClassName?: string;
  title: string;
  titleClassName?: string;
};

export function PageHero({
  action,
  backgroundClassName,
  body,
  bodyClassName,
  contentClassName,
  eyebrow,
  eyebrowClassName,
  title,
  titleClassName,
}: PageHeroProps) {
  const layoutClassName = action ? HERO_ROW : undefined;

  return (
    <header className={HERO_SHELL}>
      <div className={backgroundClassName}>
        <div className={`${HERO_CONTENT} ${contentClassName ?? ''}`.trim()}>
          <div className={layoutClassName}>
            <div className={HERO_COPY_WRAP}>
              <span className={eyebrowClassName ?? HERO_EYEBROW}>{eyebrow}</span>
              <h1 className={titleClassName ?? HERO_TITLE}>{title}</h1>
              <p className={bodyClassName ?? HERO_BODY}>{body}</p>
            </div>
            {action}
          </div>
        </div>
      </div>
    </header>
  );
}
