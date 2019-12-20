import React from 'react';
import { parseDate } from 'src/types/date';
import style from './DateInput.module.scss';

interface IProps {
  value: string;
  onChange: (value: string) => void;
}

export const DateInput = ({ value, onChange }: IProps): JSX.Element => {
  return (
    <input
      className={style.dateInput}
      type="date"
      onChange={v => onChange(parseDate(v.target.value))}
      value={value}
    />
  );
};
