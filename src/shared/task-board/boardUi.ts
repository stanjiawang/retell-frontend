import { COUNT_BADGE } from '../ui/tokens';
import { COLUMN_CONFIG, type ColumnKey } from './taskBoardData';

export function getColumnAccent(columnKey: ColumnKey): string {
  if (columnKey === 'todo') {
    return 'from-sky-50 via-white to-white';
  }

  if (columnKey === 'inProgress') {
    return 'from-amber-50 via-white to-white';
  }

  return 'from-emerald-50 via-white to-white';
}

export function getColumnBadge(columnKey: ColumnKey): string {
  if (columnKey === 'todo') {
    return `${COUNT_BADGE} bg-sky-100 text-sky-700`;
  }

  if (columnKey === 'inProgress') {
    return `${COUNT_BADGE} bg-amber-100 text-amber-700`;
  }

  return `${COUNT_BADGE} bg-emerald-100 text-emerald-700`;
}

export function getColumnTitle(columnKey: ColumnKey): string {
  return COLUMN_CONFIG.find((column) => column.key === columnKey)?.title ?? columnKey;
}
