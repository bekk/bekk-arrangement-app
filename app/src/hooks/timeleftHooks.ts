import { useState, useEffect } from 'react';
import { calculateTimeLeft } from 'src/utils/timeleft';
import { IDateTime } from 'src/types/date-time';

export const useTimeLeft = (time: IDateTime | undefined) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 365,
    hours: 0,
    minutes: 0,
    seconds: 0,
    difference: 1,
  });

  useEffect(() => {
    if (time) {
      const interval = setInterval(() => {
        setTimeLeft(calculateTimeLeft(time));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [time]);
  return timeLeft;
};
