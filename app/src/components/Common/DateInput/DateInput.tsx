import React from 'react';
import { parseDate } from '../../../types/date';

interface IProps {
  value: string;
  onChange: (value: string) => void;
}

export const DateInput = ({ value, onChange }: IProps): JSX.Element => {
  return (
    <input
      type="date"
      onChange={v => onChange(parseDate(v.target.value))}
      value={value}
    />
  );
};
