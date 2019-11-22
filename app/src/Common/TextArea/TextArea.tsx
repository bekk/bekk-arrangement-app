import React, { Children } from 'react';

import { Validation } from '../../types/validation';
import { SectionWithValidation } from '../SectionWithValidation/SectionWithValidation';

interface IProps {
  label: string;
  value: Validation<string, string>;
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
    <SectionWithValidation validationResult={value.validationResult}>
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
