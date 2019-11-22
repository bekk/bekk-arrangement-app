import React from 'react';
import { useKeyDown } from '../../hooks/eventListener';
import { Validation } from '../../types/validation';
import { SectionWithValidation } from '../SectionWithValidation/SectionWithValidation';
import { ITime } from '../../types';

interface IProps {
  label: string;
  value: Validation<[string, string], ITime>;
  onChange: (value: [string, string]) => void;
}

export const TimeInput = ({ label, value, onChange }: IProps): JSX.Element => {
  const hour = value.value[0];
  const minute = value.value[1];

  const updateHour = (value: string) => {
    const valueAsNumber = Number(value);
    if (valueAsNumber > 23) {
      onChange(['0', minute]);
    } else if (valueAsNumber < 0) {
      onChange(['23', minute]);
    } else {
      onChange([value, minute]);
    }
  };

  const updateMinute = (value: string) => {
    const valueAsNumber = Number(value);
    if (valueAsNumber > 59) {
      onChange([hour, '0']);
    } else if (valueAsNumber < 0) {
      onChange([hour, '59']);
    } else {
      onChange([hour, value]);
    }
  };

  return (
    <SectionWithValidation validationResult={value.validationResult}>
      <label htmlFor={label}>{label}</label>
      <input
        type="number"
        id={label}
        onChange={v => updateHour(v.target.value)}
        value={hour}
      />
      <input
        type="number"
        id={label}
        onChange={v => updateMinute(v.target.value)}
        value={minute}
      />
    </SectionWithValidation>
  );
};