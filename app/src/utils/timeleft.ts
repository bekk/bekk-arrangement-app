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
  if (seconds > 0) {
    return ` ${seconds} sekunder`;
  }
};

export const calculateTimeLeft = (date: Date): ITimeLeft => {
  const difference = date.valueOf() - new Date().valueOf();

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
