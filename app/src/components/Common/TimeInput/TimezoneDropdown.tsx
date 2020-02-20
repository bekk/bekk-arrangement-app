import React from 'react';
import style from './TimeInput.module.scss';
import { range } from 'lodash';

interface IProps {
  value: number;
  onChange: (value: number) => void;
}

export const TimezoneDropdown = ({ value, onChange }: IProps) => {
  const updateTimezone = (timezone: number) => onChange(timezone);
  return (
    <div className={style.timeInputContainer}>
      <label className={style.label}>Tidssone(UTC):</label>
      <select
        className={style.dropdown}
        name="tidssone"
        value={value}
        onChange={v => {
          console.log();
          updateTimezone(Number(v.target.value));
        }}
      >
        {range(-12, 12).map(i => {
          const displayValue = i > 0 ? `+${i}` : i;
          return (
            <option key={i} value={i}>
              {displayValue}
            </option>
          );
        })}
      </select>
    </div>
  );
};
