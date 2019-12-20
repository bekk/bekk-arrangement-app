import { toDate, IDateTime } from 'src/types/date-time';

export interface ITimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  difference: number;
}

export const asString = ({ days, hours, minutes, seconds }: ITimeLeft) => {
  if (days > 0) {
    return `${days} days, ${hours} hours and ${minutes} minutes`;
  }
  if (hours > 0) {
    return `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
  }
  if (minutes > 0) {
    return `${minutes} minutes and ${seconds} seconds`;
  }
  if (seconds > 0) {
    return ` ${seconds} seconds`;
  }
};

export const calculateTimeLeft = (date: IDateTime): ITimeLeft => {
  const difference = new Date(toDate(date)).valueOf() - new Date().valueOf();

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      difference: difference,
    };
  }

  return {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    difference: 0,
  };
};
