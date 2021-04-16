export interface RawEvent {
  date: string;
  name: string;
}
export interface Event extends RawEvent {
  date: string;
  name: string;
  passed: boolean;
}

export interface EventGroup {
  name: string;
  events: Event[];
}

export enum Resolution {
  Week,
  Month,
  Year,
}
