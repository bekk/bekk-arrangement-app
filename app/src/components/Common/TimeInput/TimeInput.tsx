import React, { useRef } from 'react';
import { EditTime } from 'src/types/time';
import style from './TimeInput.module.scss';

interface IProps {
  value: EditTime;
  onChange: (value: EditTime) => void;
}

export const TimeInput = ({ value, onChange }: IProps) => {
  const hour = value[0];
  const minute = value[1];

  const updateHour = (newHour: string) => {
    onChange([newHour, minute]);
  };

  const updateMinute = (newMinute: string) => {
    onChange([hour, newMinute]);
  };

  const { focusMinuteRefWhenHourFull, minuteRef } = useHourMinuteFocus(hour);

  const selectText = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className={style.timeInputContainer}>
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
