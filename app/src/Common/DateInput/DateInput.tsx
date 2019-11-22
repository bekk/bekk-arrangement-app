import React from 'react';

import { Validation } from '../../types/validation';
import { IDate } from '../../types/date';

interface IProps {
  label: string;
  value: Validation<string, IDate>;
  onChange: (value: string) => void;
}

export const DateInput = ({ label, value, onChange }: IProps): JSX.Element => {
  return (
    <section>
      <label htmlFor={label}>{label}</label>
      <div>
        <input
          type="date"
          id={label}
          onChange={v => onChange(v.target.value)}
          value={value.value}
        />
      </div>
    </section>
  );
};
