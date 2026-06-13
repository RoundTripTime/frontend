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

const MAX_SCHEDULE_DAYS = 31;
const MS_PER_DAY = 86_400_000;
const DAY_START_MINUTES = 9 * 60;
const GAP_MINUTES = 30;
const PLANNED_DURATION_MINUTES = 30;

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
    const previousItem = getItemById(previousRows, item.itemId) ?? item;

    if (
      previousItem.dayIndex !== nextDayIndex ||
      previousItem.sortOrder !== nextSortOrder ||
      previousItem.startTime !== item.startTime ||
      previousItem.endTime !== item.endTime
    ) {
      patches.push({
        body: {
          day_index: nextDayIndex,
          end_time: item.endTime,
          sort_order: nextSortOrder,
          start_time: item.startTime,
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
  let currentStartMinutes = DAY_START_MINUTES;

  return rows.map((row) => {
    if (row.type === 'day') {
      currentDayIndex = row.dayIndex;
      currentSortOrder = 1;
      currentStartMinutes = DAY_START_MINUTES;
      return row;
    }

    if (row.type === 'unassigned') {
      currentDayIndex = null;
      currentSortOrder = 1;
      currentStartMinutes = DAY_START_MINUTES;
      return row;
    }

    const nextStartTime = currentDayIndex ? formatClock(currentStartMinutes) : null;
    const nextEndTime = currentDayIndex
      ? formatClock(currentStartMinutes + PLANNED_DURATION_MINUTES)
      : null;
    const nextSortOrder = currentDayIndex ? currentSortOrder : null;
    const nextMarkerTone: PlanPlaceViewModel['markerTone'] = currentDayIndex ? 'day' : 'unassigned';

    if (currentDayIndex) {
      currentSortOrder += 1;
      currentStartMinutes += PLANNED_DURATION_MINUTES + GAP_MINUTES;
    }

    const nextItem = {
      ...row.item,
      dayIndex: currentDayIndex,
      dayLabel: currentDayIndex ? `Day ${currentDayIndex}` : '미배치',
      endTime: nextEndTime,
      markerTone: nextMarkerTone,
      plannedDurationMinutes: currentDayIndex ? PLANNED_DURATION_MINUTES : null,
      sortOrder: nextSortOrder,
      startTime: nextStartTime,
      timeLabel: currentDayIndex ? `${nextStartTime} - ${nextEndTime}` : '미배치',
    };

    if (
      row.item.dayIndex === nextItem.dayIndex &&
      row.item.dayLabel === nextItem.dayLabel &&
      row.item.endTime === nextItem.endTime &&
      row.item.markerTone === nextItem.markerTone &&
      row.item.plannedDurationMinutes === nextItem.plannedDurationMinutes &&
      row.item.sortOrder === nextItem.sortOrder &&
      row.item.startTime === nextItem.startTime &&
      row.item.timeLabel === nextItem.timeLabel
    ) {
      return row;
    }

    return { ...row, item: nextItem };
  });
}

export function getRowTimeLabels(rows: ScheduleRow[]) {
  const labels = new Map<string, string>();

  rows.forEach((row) => {
    if (row.type === 'place') {
      labels.set(row.item.itemId, row.item.timeLabel);
    }
  });

  return labels;
}
