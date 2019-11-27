import React from 'react';
import { parseDate, EditDate } from '../../../types/date';

interface IProps {
  label: string;
  value: EditDate;
  onChange: (value: EditDate) => void;
}

export const DateInput = ({ label, value, onChange }: IProps): JSX.Element => {
  return (
    <>
      <label htmlFor={label}>{label}</label>
      <input
        type="date"
        id={label}
        onChange={v => onChange(parseDate(v.target.value))}
        value={value}
      />
    </>
  );
};
