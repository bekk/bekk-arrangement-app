import { IEvent } from 'src/types/event';
import { useState, useEffect } from 'react';
import { calculateTimeLeft } from 'src/utils/timeleft';

export const useTimeLeft = (event: IEvent | undefined) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 365,
    hours: 0,
    minutes: 0,
    seconds: 0,
    difference: 1,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (event) {
        setTimeLeft(calculateTimeLeft(event.openForRegistration));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [event]);
  return timeLeft;
};
