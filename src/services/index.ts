import { groupBy } from "lodash";
import { Event, RawEvent, Resolution } from "./../domain";
import differenceInWeeks from "date-fns/differenceInWeeks";
import add from "date-fns/add";
import format from "date-fns/format";
import differenceInMonths from "date-fns/differenceInMonths";
import differenceInDays from "date-fns/differenceInDays";

export const groupEvents = (events: Event[], resolution: Resolution) => {
  switch (resolution) {
    case Resolution.Week:
      return groupByWeek(events);
    case Resolution.Month:
      return groupByMonth(events);
    case Resolution.Year:
      return groupByYear(events);

    default:
      return events.map((event) => ({
        name: event.date,
        events: [event],
      }));
  }
};

type GroupByFn = (firstEvent: Event, event: Event) => number;

const createGroupBy = (groupByFn: GroupByFn) => (events: Event[]) => {
  const groupped = groupBy(events, (event: Event) =>
    groupByFn(events[0], event)
  );

  return Object.keys(groupped).map((key) => ({
    name: key,
    events: groupped[key],
  }));
};

export const groupByWeek = createGroupBy((firstEvent: Event, event: Event) =>
  Math.abs(differenceInWeeks(new Date(firstEvent.date), new Date(event.date)))
);

export const groupByMonth = createGroupBy((firstEvent: Event, event: Event) =>
  Math.abs(differenceInMonths(new Date(firstEvent.date), new Date(event.date)))
);

export const groupByYear = createGroupBy((firstEvent: Event, event: Event) =>
  new Date(event.date).getFullYear()
);

const sortEvents = (events: Event[] | RawEvent[]) =>
  [...events].sort(
    (eventA, eventB) => +new Date(eventA.date) - +new Date(eventB.date)
  );

export const applyEvents = (events: RawEvent[]): Event[] => {
  const sorted = sortEvents(events);

  const start = sorted[0];
  const end = sorted[sorted.length - 1];

  const all: Event[] = [...events.map((e) => ({ ...e, passed: false }))];

  const diff = differenceInDays(new Date(end.date), new Date(start.date));
  const startDate = new Date(start.date);
  const now = new Date();

  for (let i = 1; i < diff; i++) {
    const nextDay = add(startDate, { days: i });

    all.push({
      name: "",
      date: format(nextDay, "yyyy-MM-dd"),
      passed: nextDay <= now,
    });
  }

  const allSorted = sortEvents(all);

  return allSorted as Event[];
};
