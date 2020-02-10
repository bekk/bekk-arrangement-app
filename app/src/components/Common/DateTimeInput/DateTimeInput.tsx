import React from 'react';
import { DateInput } from '../DateInput/DateInput';
import { TimeInput } from '../TimeInput/TimeInput';
import { EditDateTime, IDateTime, parseDateTime } from 'src/types/date-time';
import style from './DateTimeInput.module.scss';
import { Result } from 'src/types/validation';
import classNames from 'classnames';
import { ValidationResult } from '../ValidationResult/ValidationResult';

interface IProps {
  label: string;
  value: Result<EditDateTime, IDateTime>;
  onChange: (datetime: Result<EditDateTime, IDateTime>) => void;
}

export const DateTimeInput = ({ label, value, onChange }: IProps) => {
  const containerStyle = classNames(style.container, {
    [style.error]: Boolean(value.errors),
  });
  return (
    <section className={style.grid}>
      <label className={style.label}>{label}</label>
      <div className={containerStyle}>
        <DateInput
          value={value.editValue.date}
          onChange={date => {
            onChange(parseDateTime({ ...value.editValue, date }));
          }}
        />
        <TimeInput
          value={value.editValue.time}
          onChange={time =>
            onChange(parseDateTime({ ...value.editValue, time }))
          }
        />
      </div>
      <ValidationResult validationResult={value.errors} />
    </section>
  );
};
