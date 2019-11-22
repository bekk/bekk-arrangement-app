import React from 'react';

import { Validation } from '../../types/validation';
import { SectionWithValidation } from '../SectionWithValidation/SectionWithValidation';
import { ITime } from '../../types';

interface IProps {
  label: string;
  value: Validation<ITime>;
  onChange: (value: string) => void;
}

export const TimeInput = ({ label, value, onChange }: IProps): JSX.Element => {
  return (
    <SectionWithValidation validationResult={value.validationResult}>
      <label htmlFor={label}>{label}</label>
      <input
        type='text'
        id={label}
        onChange={v => onChange(v.target.value)}
        value={value.value}
      />
    </SectionWithValidation>
  );
};
