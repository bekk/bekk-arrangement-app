import React from 'react';
import { parseDate } from '../../../types/date';

interface IProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const DateInput = ({ label, value, onChange }: IProps): JSX.Element => {
  return (
    <input
      type="date"
      id={label}
      onChange={v => onChange(parseDate(v.target.value))}
      value={value}
    />
  );
};
