import React from 'react';
import style from './DateInput.module.scss';
import { EditDate } from 'src/types/date';

interface IProps {
  value: EditDate;
  onChange: (value: EditDate) => void;
}

export const DateInput = ({ value, onChange }: IProps): JSX.Element => {
  return (
    <input
      className={style.dateInput}
      type="date"
      onChange={v => onChange(v.target.value)}
      value={value}
    />
  );
};
