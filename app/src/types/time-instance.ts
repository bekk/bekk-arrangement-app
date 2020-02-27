import { IError, validate } from './validation';
import { EditDate } from './date';
import { EditTime } from './time';

export const timezoneStart = -11;
export const timezoneEnd = 12;

export type TimeInstanceContract = string; // BigInt
export type TimeInstanceViewModel = TimeInstanceContract;
export type TimeInstanceWriteModel = TimeInstanceContract;

export type TimeInstance = Date;

export type TimeInstanceEdit = {
  date: EditDate;
  time: EditTime;
  timezone: number;
};

export const parseEditTimeInstance = (t: TimeInstanceEdit): Date | IError[] => {
  const timeDateString = `${t.date}T${t.time[0]}:${
    t.time[1]
  }${getTimezoneInISOFormat(t.timezone)}`;

  const dateTimeStamp = Date.parse(timeDateString);

  const validator = validate<TimeInstanceEdit, Date>({
    'Tiden er ugyldig': isNaN(dateTimeStamp),
  });
  return validator.resolve(new Date(dateTimeStamp));
};

export const toTimeInstanceWriteModel = (
  time: TimeInstance
): TimeInstanceWriteModel => time.getTime().toString();

export const parseTimeInstanceViewModel = (
  time: TimeInstanceViewModel
): TimeInstance => new Date(Number(time));

export const toEditTimeInstance = (date: TimeInstance): TimeInstanceEdit => {
  const year = date.getFullYear().toString();

  // Month range is 0-11. We need to '+1' to make the month readable for Date()
  const month = twoDigitValue(date.getMonth() + 1);
  const day = twoDigitValue(date.getDate());
  const hour = twoDigitValue(date.getHours());
  const minute = twoDigitValue(date.getMinutes());

  // If the timezoneOffset is negative, timezone must be positive.
  // Therefore we must divide by -60
  // (TimezoneOffset is also time difference in minutes)
  const timezone = date.getTimezoneOffset() / -60;

  return {
    date: `${year}-${month}-${day}`,
    time: [hour, minute],
    timezone,
  };
};

// Util functions

const twoDigitValue = (value: number): string =>
  value.toString().padStart(2, '0');

const getTimezoneInISOFormat = (timezone: number): string => {
  const positiveTimezone = twoDigitValue(Math.abs(timezone));
  if (timezone > 0) {
    return `+${positiveTimezone}:00`;
  }
  return `-${positiveTimezone}:00`;
};

export const stringifyTimeInstanceDate = (date: TimeInstance): string =>
  `${twoDigitValue(date.getDay())}.${twoDigitValue(
    date.getMonth() + 1
  )}.${date.getFullYear()}`;

export const stringifyTimeInstanceTime = (date: TimeInstance): string =>
  `${twoDigitValue(date.getHours())}:${twoDigitValue(date.getMinutes())}`;
