import { useState, useEffect } from 'react';
import { calculateTimeLeft } from 'src/utils/timeleft';

export const useTimeLeft = (time: Date | false) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
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
