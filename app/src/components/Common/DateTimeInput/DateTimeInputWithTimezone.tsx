import React from 'react';
import { DateInput } from 'src/components/Common/DateInput/DateInput';
import style from './DateTimeInput.module.scss';
import classNames from 'classnames';
import { ValidationResult } from 'src/components/Common/ValidationResult/ValidationResult';
import {
  TimeInstanceEdit,
  parseEditTimeInstance,
} from 'src/types/time-instance';
import { TimezoneDropdown } from 'src/components/Common/TimeInput/TimezoneDropdown';
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

  const containerStyle = classNames(style.container, {
    [style.error]: !isValid(timeInstance),
  });

  return (
    <section className={style.grid}>
      <label className={style.dateTimeInput}>{label}</label>
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
        <div className={style.timeWithTimezone}>
          <TimeInput
            value={value.time}
            onChange={time => {
              onChange({
                ...value,
                time,
              });
            }}
          />
          <TimezoneDropdown
            value={value.timezone}
            onChange={timezone => {
              onChange({
                ...value,
                timezone,
              });
            }}
          />
        </div>
      </div>
      {!isValid(timeInstance) && (
        <ValidationResult validationResult={timeInstance} />
      )}
    </section>
  );
};
