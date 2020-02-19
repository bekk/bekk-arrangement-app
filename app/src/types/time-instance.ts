import { validate, Result } from './validation';

export const timezoneStart = -11;
export const timezoneEnd = 12;

export type TimeInstanceContract = string; // BigInt
export type TimeInstance = Date;
export type EditTimeInstance = {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  timezone: number;
};

export const deserializeTimeInstance = (
  time: TimeInstanceContract
): EditTimeInstance => {
  const timeDate = new Date(Number(time));
  return dateToTimeInstance(timeDate);
};

export const getDateString = (date: EditTimeInstance): string => {
  return `${date.year}-${date.month}-${date.day}`;
};

export const dateToTimeInstance = (timeDate: Date) => {
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

  return { year, month, day, hour, minute, timezone };
};

const twoDigitValue = (value: number): string => {
  return value < 10 ? '0' + value : value.toString();
};

export const editTimeInstanceToDate = (t: EditTimeInstance): Date => {
  const timeDateString = `${t.year}-${t.month}-${t.day}T${t.hour}:${
    t.minute
  }${getTimezoneInISOFormat(t.timezone)}`;

  return new Date(timeDateString);
};

const getTimezoneInISOFormat = (timezone: number): string => {
  const positiveTimezone = Math.abs(timezone);
  if (timezone > 0) {
    if (timezone >= 10) return `+${positiveTimezone}:00`;
    return `+0${positiveTimezone}:00`;
  }
  if (timezone <= -10) return `-${positiveTimezone}:00`;
  return `-0${positiveTimezone}:00`;
};

export const parseDateStringToTimeInstance = (
  dateString: string
): EditTimeInstance => {
  const dateList = dateString.split('-');

  return {
    year: dateList[0],
    month: dateList[1],
    day: dateList[2],
    hour: '0',
    minute: '0',
    timezone: 0,
  };
};

export const parseTimeInstance = (
  timeInstance: EditTimeInstance
): Result<EditTimeInstance, TimeInstance> => {
  const newTimeInstance = {
    ...timeInstance,
    hour: twoDigitValue(Number(timeInstance.hour)),
    minute: twoDigitValue(Number(timeInstance.minute)),
  };

  const timestamp = editTimeInstanceToDate(newTimeInstance);
  const validator = validate<EditTimeInstance, TimeInstance>(timeInstance, {
    "Can't have more than 60 minutes in an hour":
      Number(timeInstance.minute) > 59,
    "Can't have negative number of minutes": Number(timeInstance.minute) < 0,
    'There are not more than 23 hours in a day': Number(timeInstance.hour) > 23,
    "Can't have a negative amount of hours in a day":
      Number(timeInstance.hour) < 0,
    'Date not valid': isNaN(timestamp.getTime()),
  });
  return validator.resolve(timestamp);
};

export const serializeTimeInstance = (
  time: TimeInstance
): TimeInstanceContract => time.getTime().toString();

export const stringifyTimeInstance = (time: TimeInstance): string =>
  time.toLocaleDateString();
