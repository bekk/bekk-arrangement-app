import React from 'react';

import { Validate } from '../../../types/validation';
import { SectionWithValidation } from '../SectionWithValidation/SectionWithValidation';

interface IProps {
  label: string;
  value: Validate<string, string>;
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
    <SectionWithValidation validationResult={value.errors}>
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
