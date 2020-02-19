import React from 'react';
import { DateInput } from '../DateInput/DateInput';
import style from './DateTimeInput.module.scss';
import { Result } from 'src/types/validation';
import classNames from 'classnames';
import { ValidationResult } from '../ValidationResult/ValidationResult';
import {
  parseTimeInstance,
  EditTimeInstance,
  getDateString,
  parseDateStringToTimeInstance,
} from 'src/types/time-instance';
import { TimeInputWithTimezone } from '../TimeInput/TimeInputWithTimezone';

interface IProps {
  label: string;
  value: Result<EditTimeInstance, Date>;
  onChange: (datetime: Result<EditTimeInstance, Date>) => void;
}

export const DateTimeInputWithTimezone = ({
  label,
  value,
  onChange,
}: IProps) => {
  const containerStyle = classNames(style.container, {
    [style.error]: Boolean(value.errors),
  });
  return (
    <>
      <label className={style.dateTimeInput}>{label}</label>
      <section>
        <div className={containerStyle}>
          <DateInput
            value={getDateString(value.editValue)}
            onChange={openForRegistration => {
              const newDateTimeInstance = parseDateStringToTimeInstance(
                openForRegistration
              );
              const newRegistrationTimeInstance = {
                ...value.editValue,
                year: newDateTimeInstance.year,
                month: newDateTimeInstance.month,
                day: newDateTimeInstance.day,
              };
              onChange(parseTimeInstance(newRegistrationTimeInstance));
            }}
          />
          <TimeInputWithTimezone
            value={value.editValue}
            onChange={newOpenForRegistrationTime => {
              onChange(parseTimeInstance(newOpenForRegistrationTime));
            }}
          />
        </div>
        <ValidationResult validationResult={value.errors} />
      </section>
    </>
  );
};
