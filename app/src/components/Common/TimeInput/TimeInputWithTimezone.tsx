import React, { useRef } from 'react';
import style from './TimeInput.module.scss';
import { EditTimeInstance, timezoneStart, timezoneEnd } from 'src/types/time-instance';

interface IProps {
  value: EditTimeInstance;
  onChange: (value: EditTimeInstance) => void;
}

export const TimeInputWithTimezone = ({ value, onChange }: IProps) => {
  const hour = value.hour;
  const minute = value.minute;
  const timezone = value.timezone;

  const updateHour = (newHour: string) => {
    onChange({...value, hour: newHour});
  };

  const updateMinute = (newMinute: string) => {
    onChange({...value, minute: newMinute});
  };

  const updateTimezone = (newTimezone: number) => {
    onChange({...value, timezone: newTimezone});
  };

  const { focusMinuteRefWhenHourFull, minuteRef } = useHourMinuteFocus(hour);

  const selectText = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className={style.timeInputContainer}>
      <label className={style.label}>Tidssone:</label>
      <select
      className={style.dropdown}
        name="tidssone"
        value={timezone}
        onChange={v => updateTimezone(Number(v.target.value))}
        children={timezoneList()}
      />
      <input
        className={style.timeInput}
        type="number"
        value={hour}
        onChange={v => updateHour(v.target.value)}
        onKeyDown={focusMinuteRefWhenHourFull}
        onFocus={selectText}
      />
      <div className={style.text}>:</div>
      <input
        className={style.timeInput}
        ref={minuteRef}
        type="number"
        value={minute}
        onChange={v => updateMinute(v.target.value)}
        onFocus={selectText}
      />
    </div>
  );
};

const timezoneList = () => {
  const listus = []
  for (let index = timezoneStart; index <= timezoneEnd; index++) {
        listus.push(<option key={index} value={index}>{index}</option>)    
  }
  return listus;
}

const useHourMinuteFocus = (hour: string) => {
  const minuteRef = useRef<HTMLInputElement>(null);
  const focusMinute = () => {
    if (minuteRef.current) {
      minuteRef.current.focus();
    }
  };
  return {
    minuteRef,
    focusMinuteRefWhenHourFull: (e: React.KeyboardEvent<HTMLInputElement>) => {
      const selection = window.getSelection()?.toString();
      const notSelected = selection !== hour;

      const hasEnteredNumber = /[0-9]/.test(e.key);
      if (hour.length === 2 && notSelected && hasEnteredNumber) {
        focusMinute();
      }
    },
  };
};
