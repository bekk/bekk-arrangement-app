import { useState, useEffect } from 'react';
import { calculateTimeLeft } from 'src/utils/timeleft';

export const useTimeLeft = (time: Date | false) => {
  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft(time || new Date())
  );

  const isOpenForRegistration = timeLeft.difference <= 0
  const registrationIsWithin12Hours = timeLeft.difference < (60 * 60000 * 12)

  useEffect(() => {
    if (isOpenForRegistration)
      return;

    if (time && registrationIsWithin12Hours) {
      setTimeLeft(calculateTimeLeft(time));
      const interval = setInterval(() => {
        setTimeLeft(calculateTimeLeft(time));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [time, isOpenForRegistration, registrationIsWithin12Hours]);

  return timeLeft;
};
