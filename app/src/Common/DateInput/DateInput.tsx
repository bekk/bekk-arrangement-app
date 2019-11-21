import React from 'react';

import { Validation } from '../../types/validation';
import { SectionWithValidation } from '../SectionWithValidation/SectionWithValidation';
import { IDate } from '../../utils/date';

interface IProps {
  label: string;
  value: Validation<IDate>;
  onChange: (value: string) => void;
}

export const DateInput = ({ label, value, onChange }: IProps): JSX.Element => {
  return (
    <SectionWithValidation validationResult={value.validationResult}>
      <label htmlFor={label}>{label}</label>
      <input
        type='date'
        id={label}
        onChange={v => onChange(v.target.value)}
        value={value.value}
      />
    </SectionWithValidation>
  );
};
