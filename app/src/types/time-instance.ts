import { Result, isOk } from './validation';
import { EditDate, parseDate } from './date';
import { EditTime, parseTime } from './time';
import { concatLists } from '.';

export const timezoneStart = -11;
export const timezoneEnd = 12;

export type TimeInstanceContract = string; // BigInt
export type TimeInstance = Date;
export type EditTimeInstance = {
  date: EditDate;
  time: EditTime;
  timezone: number;
};

export const deserializeTimeInstance = (
  time: TimeInstanceContract
): EditTimeInstance => {
  const timeDate = new Date(Number(time));

  const year = timeDate.getFullYear().toString();

  // Month range is 0-11. We need to '+1' to make the month readable for Date()
  const month = twoDigitValue(timeDate.getMonth() + 1);
  const day = twoDigitValue(timeDate.getDate());
  const hour = twoDigitValue(timeDate.getHours());
  const minute = twoDigitValue(timeDate.getMinutes());

  // If the timezoneOffset is negative, timezone must be positive.
  // Therefore we must divide by -60
  // (TimezoneOffset is also time difference in minutes)
  const timezone = timeDate.getTimezoneOffset() / -60;

  return {
    date: `${year}-${month}-${day}`,
    time: [hour, minute],
    timezone,
  };
};

const twoDigitValue = (value: number): string =>
  value.toString().padStart(2, '0');

export const parseTimeInstanceToDate = (t: EditTimeInstance): Date => {
  const timeDateString = `${t.date}T${t.time[0]}:${
    t.time[1]
  }${getTimezoneInISOFormat(t.timezone)}`;
  return new Date(timeDateString);
};

const getTimezoneInISOFormat = (timezone: number): string => {
  const positiveTimezone = twoDigitValue(Math.abs(timezone));
  if (timezone > 0) {
    return `+${positiveTimezone}:00`;
  }
  return `-${positiveTimezone}:00`;
};

export const parseTimeInstance = (
  timeInstance: EditTimeInstance
): Result<EditTimeInstance, TimeInstance> => {
  const date = parseDate(timeInstance.date);
  const time = parseTime(timeInstance.time);

  if (isOk(date) && isOk(time)) {
    return {
      errors: undefined,
      editValue: timeInstance,
      validValue: parseTimeInstanceToDate(timeInstance),
    };
  }

  const errors = concatLists(date.errors, time.errors);
  return {
    errors,
    editValue: timeInstance,
  };
};

export const serializeTimeInstance = (
  time: TimeInstance
): TimeInstanceContract => time.getTime().toString();

export const stringifyTimeInstanceDate = (date: TimeInstance): string =>
  `${twoDigitValue(date.getDay())}.${twoDigitValue(
    date.getMonth() + 1
  )}.${date.getFullYear()}`;

export const stringifyTimeInstanceTime = (date: TimeInstance): string =>
  `${twoDigitValue(date.getHours())}:${twoDigitValue(date.getMinutes())}`;
