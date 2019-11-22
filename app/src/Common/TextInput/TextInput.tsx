import React from 'react';

import { Validation } from '../../types/validation';
import { SectionWithValidation } from '../SectionWithValidation/SectionWithValidation';

interface IProps {
  label: string;
  value: Validation<string, string>;
  onChange: (value: string) => void;
  placeholder: string;
}

export const TextInput = ({
  label,
  value,
  onChange,
  placeholder,
}: IProps): JSX.Element => {
  return (
    <SectionWithValidation validationResult={value.validationResult}>
      <label htmlFor={label}>{label}</label>
      <input
        id={label}
        type="text"
        placeholder={placeholder}
        value={value.value}
        onChange={v => onChange(v.target.value)}
      />
    </SectionWithValidation>
  );
};
