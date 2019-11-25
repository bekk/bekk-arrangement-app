import React from 'react';

import { Validate } from '../../../types/validation';
import { SectionWithValidation } from '../SectionWithValidation/SectionWithValidation';
import { IDate } from '../../../types/date';

interface IProps {
  label: string;
  value: Validate<string, IDate>;
  onChange: (value: string) => void;
}

export const DateInput = ({ label, value, onChange }: IProps): JSX.Element => {
  console.log(value.value);
  return (
    <SectionWithValidation validationResult={value.errors}>
      <label htmlFor={label}>{label}</label>
      <input
        type="date"
        id={label}
        onChange={v => onChange(v.target.value)}
        value={value.value}
      />
    </SectionWithValidation>
  );
};
