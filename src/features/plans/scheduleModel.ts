import type { UpdateItineraryItemRequest } from '@/src/api/itineraries/types';
import type { PlanPlaceViewModel } from '@/src/features/plans/viewModel';

export type ScheduleDay = {
  dateLabel: string;
  dayIndex: number;
  title: string;
};

export type ScheduleRow =
  | {
      id: string;
      dateLabel: string;
      dayIndex: number;
      title: string;
      type: 'day';
    }
  | {
      id: string;
      title: string;
      type: 'unassigned';
    }
  | {
      id: string;
      item: PlanPlaceViewModel;
      type: 'place';
    };

export type ScheduleItemPatch = {
  body: UpdateItineraryItemRequest;
  item: PlanPlaceViewModel;
};

export const DAY_START_MINUTES = 9 * 60;
export const GAP_MINUTES = 30;
export const DEFAULT_DURATION_MINUTES = 60;
export const DURATION_OPTIONS = [30, 60, 90, 120, 180] as const;
const MAX_SCHEDULE_DAYS = 31;
const MS_PER_DAY = 86_400_000;

function parseDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function formatDateLabel(date: Date) {
  return `${date.getMonth() + 1}.${date.getDate()}`;
}

function formatClock(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function formatTimeRange(startMinutes: number, durationMinutes: number) {
  return `${formatClock(startMinutes)} - ${formatClock(startMinutes + durationMinutes)}`;
}

export function getDurationMinutes(item: PlanPlaceViewModel) {
  return item.plannedDurationMinutes ?? DEFAULT_DURATION_MINUTES;
}

export function buildScheduleDays(startDateValue: string, endDateValue: string): ScheduleDay[] {
  const startDate = parseDate(startDateValue);
  const endDate = parseDate(endDateValue);

  if (!startDate || !endDate || startDate > endDate) {
    return [];
  }

  const dayCount = Math.min(
    Math.floor((endDate.getTime() - startDate.getTime()) / MS_PER_DAY) + 1,
    MAX_SCHEDULE_DAYS,
  );

  return Array.from({ length: dayCount }).map((_, index) => {
    const dayIndex = index + 1;
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    return {
      dateLabel: formatDateLabel(date),
      dayIndex,
      title: `Day ${dayIndex}`,
    };
  });
}

function sortScheduleItems(first: PlanPlaceViewModel, second: PlanPlaceViewModel) {
  return (
    (first.sortOrder ?? Number.MAX_SAFE_INTEGER) - (second.sortOrder ?? Number.MAX_SAFE_INTEGER)
  );
}

export function buildScheduleRows(
  startDateValue: string,
  endDateValue: string,
  items: PlanPlaceViewModel[],
): ScheduleRow[] {
  const rows: ScheduleRow[] = [];
  const scheduleDays = buildScheduleDays(startDateValue, endDateValue);

  scheduleDays.forEach((day) => {
    rows.push({
      dateLabel: day.dateLabel,
      dayIndex: day.dayIndex,
      id: `day-${day.dayIndex}`,
      title: day.title,
      type: 'day',
    });

    items
      .filter((item) => item.dayIndex === day.dayIndex)
      .sort(sortScheduleItems)
      .forEach((item) => {
        rows.push({ id: `place-${item.itemId}`, item, type: 'place' });
      });
  });

  rows.push({ id: 'unassigned', title: '미배치 장소', type: 'unassigned' });

  items
    .filter((item) => item.dayIndex === null)
    .sort(sortScheduleItems)
    .forEach((item) => {
      rows.push({ id: `place-${item.itemId}`, item, type: 'place' });
    });

  return rows;
}

function getItemById(rows: ScheduleRow[], itemId: string) {
  const row = rows.find(
    (candidate) => candidate.type === 'place' && candidate.item.itemId === itemId,
  );

  return row?.type === 'place' ? row.item : null;
}

export function getSchedulePatches(
  rows: ScheduleRow[],
  previousRows: ScheduleRow[],
): ScheduleItemPatch[] {
  const patches: ScheduleItemPatch[] = [];
  let currentDayIndex: number | null = null;
  let currentSortOrder = 1;

  rows.forEach((row) => {
    if (row.type === 'day') {
      currentDayIndex = row.dayIndex;
      currentSortOrder = 1;
      return;
    }

    if (row.type === 'unassigned') {
      currentDayIndex = null;
      currentSortOrder = 1;
      return;
    }

    const item = row.item;
    const nextDayIndex = currentDayIndex;
    const nextSortOrder = currentDayIndex ? currentSortOrder : null;
    const nextDuration = getDurationMinutes(item);
    const previousItem = getItemById(previousRows, item.itemId) ?? item;

    if (
      previousItem.dayIndex !== nextDayIndex ||
      previousItem.sortOrder !== nextSortOrder ||
      getDurationMinutes(previousItem) !== nextDuration
    ) {
      patches.push({
        body: {
          day_index: nextDayIndex,
          planned_duration_minutes: nextDuration,
          sort_order: nextSortOrder,
        },
        item,
      });
    }

    if (currentDayIndex) {
      currentSortOrder += 1;
    }
  });

  return patches;
}

export function applyScheduleToRows(rows: ScheduleRow[]): ScheduleRow[] {
  let currentDayIndex: number | null = null;
  let currentSortOrder = 1;

  return rows.map((row) => {
    if (row.type === 'day') {
      currentDayIndex = row.dayIndex;
      currentSortOrder = 1;
      return row;
    }

    if (row.type === 'unassigned') {
      currentDayIndex = null;
      currentSortOrder = 1;
      return row;
    }

    const nextDayIndex = currentDayIndex;
    const nextSortOrder = currentDayIndex ? currentSortOrder : null;

    if (currentDayIndex) {
      currentSortOrder += 1;
    }

    return {
      ...row,
      item: {
        ...row.item,
        dayIndex: nextDayIndex,
        dayLabel: nextDayIndex ? `Day ${nextDayIndex}` : '미배치',
        markerTone: nextDayIndex ? 'day' : 'unassigned',
        plannedDurationMinutes: getDurationMinutes(row.item),
        sortOrder: nextSortOrder,
      },
    };
  });
}

export function updateRowsDuration(
  rows: ScheduleRow[],
  itemId: string,
  minutes: number,
): ScheduleRow[] {
  return rows.map((row) => {
    if (row.type !== 'place' || row.item.itemId !== itemId) {
      return row;
    }

    return {
      ...row,
      item: {
        ...row.item,
        durationLabel: `예상 체류 ${minutes}분`,
        plannedDurationMinutes: minutes,
      },
    };
  });
}

export function getRowTimeLabels(rows: ScheduleRow[]) {
  const labels = new Map<string, string>();
  let currentDayIndex: number | null = null;
  let cursor = DAY_START_MINUTES;

  rows.forEach((row) => {
    if (row.type === 'day') {
      currentDayIndex = row.dayIndex;
      cursor = DAY_START_MINUTES;
      return;
    }

    if (row.type === 'unassigned') {
      currentDayIndex = null;
      return;
    }

    if (!currentDayIndex) {
      labels.set(row.item.itemId, '미배치');
      return;
    }

    const duration = getDurationMinutes(row.item);
    labels.set(row.item.itemId, formatTimeRange(cursor, duration));
    cursor += duration + GAP_MINUTES;
  });

  return labels;
}
