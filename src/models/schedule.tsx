
export enum ScheduleInterval {
  always = "always",
  daily = "daily",
  weekly = "weekly",
  monthly = "monthly",
};

export interface DateInterval {
  start: number
  stop: number
};

export interface TimeInterval {
  fromTime: number
  toTime: number
};

export interface Schedule {
  interval: ScheduleInterval
  includingDays: Array<number>
  exceptions: Array<DateInterval>
  timeRanges: Array<TimeInterval>
  start: number
  end: number
};


