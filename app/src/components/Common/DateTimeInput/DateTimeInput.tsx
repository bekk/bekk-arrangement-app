import React from 'react';
import { EditDateTime, parseEditDateTime } from 'src/types/date-time';
import style from './DateTimeInput.module.scss';
import classNames from 'classnames';
import { isValid } from 'src/types/validation';
import { DateInput } from 'src/components/Common/DateInput/DateInput';
import { TimeInput } from 'src/components/Common/TimeInput/TimeInput';
import { ValidationResult } from 'src/components/Common/ValidationResult/ValidationResult';

interface IProps {
  label: string;
  value: EditDateTime;
  onChange: (datetime: EditDateTime) => void;
}

export const DateTimeInput = ({ label, value, onChange }: IProps) => {
  const dateTime = parseEditDateTime(value);

  const containerStyle = classNames(style.container, {
    [style.error]: !isValid(dateTime),
  });

  return (
    <section className={style.grid}>
      <label className={style.label}>{label}</label>
      <div className={containerStyle}>
        <DateInput
          value={value.date}
          onChange={(date) => {
            onChange({ ...value, date });
          }}
        />
        <TimeInput
          value={value.time}
          onChange={(time) => onChange({ ...value, time })}
        />
      </div>
      {!isValid(dateTime) && <ValidationResult validationResult={dateTime} />}
    </section>
  );
};
