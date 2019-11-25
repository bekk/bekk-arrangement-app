import React, { Children } from 'react';

import { Validate } from '../../../types/validation';
import { SectionWithValidation } from '../SectionWithValidation/SectionWithValidation';

interface IProps {
  label: string;
  value: Validate<string, string>;
  onChange: (value: string) => void;
  placeholder: string;
}

export const TextArea = ({
  label,
  value,
  onChange,
  placeholder,
}: IProps): JSX.Element => {
  return (
    <SectionWithValidation validationResult={value.errors}>
      <label htmlFor={label}>{label}</label>
      <textarea
        id={label}
        rows={5}
        cols={33}
        placeholder={placeholder}
        onChange={v => onChange(v.target.value)}
      ></textarea>
    </SectionWithValidation>
  );
};
