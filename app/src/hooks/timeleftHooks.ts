import { useState, useEffect } from 'react';
import { calculateTimeLeft } from 'src/utils/timeleft';

export const useTimeLeft = (time: Date | false) => {
  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft(time || new Date())
  );

  const isOpenForRegistration = timeLeft.difference <= 0
  const registrationIsWithinAnHour = timeLeft.difference < (60 * 60000)

  useEffect(() => {
    if (isOpenForRegistration)
      return;

    if (time && registrationIsWithinAnHour) {
      setTimeLeft(calculateTimeLeft(time));
      const interval = setInterval(() => {
        setTimeLeft(calculateTimeLeft(time));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [time, isOpenForRegistration, registrationIsWithinAnHour]);

  return timeLeft;
};
