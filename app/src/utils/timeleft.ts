export interface ITimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  difference: number;
}

export const asString = ({ days, hours, minutes, seconds }: ITimeLeft) => {
  if (days > 0) {
    return `${days} dager, ${hours} timer og ${minutes} minutter`;
  }
  if (hours > 0) {
    return `${hours} timer, ${minutes} minutter ${seconds} sekunder`;
  }
  if (minutes > 0) {
    return `${minutes} minutter og ${seconds} sekunder`;
  }
  if (seconds >= 0) {
    return ` ${seconds} sekunder`;
  }
};

export const calculateTimeLeft = (date: Date): ITimeLeft => {
  const differenceInMs = date.valueOf() - new Date().valueOf();

  if (differenceInMs > 0) {
    return {
      days: Math.floor(differenceInMs / (1000 * 60 * 60 * 24)),
      hours: Math.floor((differenceInMs / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((differenceInMs / 1000 / 60) % 60),
      seconds: Math.ceil((differenceInMs / 1000) % 60),
      difference: differenceInMs,
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
