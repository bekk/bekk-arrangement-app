import React from 'react';
import { DateInput } from 'src/components/Common/DateInput/DateInput';
import style from './DateTimeInput.module.scss';
import classNames from 'classnames';
import { ValidationResult } from 'src/components/Common/ValidationResult/ValidationResult';
import {
  TimeInstanceEdit,
  parseEditTimeInstance,
} from 'src/types/time-instance';
import { TimeInput } from '../TimeInput/TimeInput';
import { isValid } from 'src/types/validation';

interface IProps {
  label: string;
  value: TimeInstanceEdit;
  onChange: (datetime: TimeInstanceEdit) => void;
}

export const DateTimeInputWithTimezone = ({
  label,
  value,
  onChange,
}: IProps) => {
  const timeInstance = parseEditTimeInstance(value);
  const timezoneOffsetUTC = new Date().getTimezoneOffset()/(-60)

  const containerStyle = classNames(style.container, {
    [style.error]: !isValid(timeInstance),
  });

  return (
    <section className={style.grid}>
      <label className={style.label}>{label}</label>
      <div className={containerStyle}>
        <DateInput
          value={value.date}
          onChange={date => {
            onChange({
              ...value,
              date,
            });
          }}
        />

        <TimeInput
          value={value.time}
          onChange={time => {
            onChange({
              ...value,
              time,
              timezone: timezoneOffsetUTC,
            });
          }}
        />
      </div>

      {!isValid(timeInstance) && (
        <ValidationResult validationResult={timeInstance} />
      )}
    </section>
  );
};
