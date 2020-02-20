import React, { useRef } from 'react';
import style from './TimeInput.module.scss';
import { EditTimeInstance } from 'src/types/time-instance';
import { range } from 'lodash';

interface IProps {
  value: EditTimeInstance;
  onChange: (value: EditTimeInstance) => void;
}

export const TimeInputWithTimezone = ({ value, onChange }: IProps) => {

  const {hour, minute, timezone} = value;

  const updateHour = (hour: string) => {
    onChange({...value, hour});
  };

  const updateMinute = (minute: string) => {
    onChange({...value, minute});
  };

  const updateTimezone = (timezone: number) => {
    onChange({...value, timezone});
  };

  const { focusMinuteRefWhenHourFull, minuteRef } = useHourMinuteFocus(hour);

  const selectText = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className={style.timeInputContainer}>
      <label className={style.label}>Tidssone(UTC):</label>
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
  return range(-12, 12).map(i =>{
    const displayValue = i > 0 ? `+${i}`: i;
    return <option key={i} value={i}>{displayValue}</option>  
  })
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
