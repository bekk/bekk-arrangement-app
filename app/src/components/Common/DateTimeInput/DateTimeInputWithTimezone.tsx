import React from 'react';
import { DateInput } from 'src/components/Common/DateInput/DateInput';
import style from './DateTimeInput.module.scss';
import { Editable } from 'src/types/validation';
import classNames from 'classnames';
import { ValidationResult } from 'src/components/Common/ValidationResult/ValidationResult';
import { parseTimeInstance, TimeInstanceEdit } from 'src/types/time-instance';
import { TimezoneDropdown } from 'src/components/Common/TimeInput/TimezoneDropdown';
import { TimeInput } from '../TimeInput/TimeInput';

interface IProps {
  label: string;
  value: Editable<TimeInstanceEdit, Date>;
  onChange: (datetime: Editable<TimeInstanceEdit, Date>) => void;
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
    <section className={style.grid}>
      <label className={style.dateTimeInput}>{label}</label>
      <div className={containerStyle}>
        <DateInput
          value={value.editValue.date}
          onChange={openForRegistrationDate => {
            const newRegistrationTimeInstance = {
              ...value.editValue,
              date: openForRegistrationDate,
            };
            onChange(parseTimeInstance(newRegistrationTimeInstance));
          }}
        />
        <div className={style.timeWithTimezone}>
          <TimeInput
            value={value.editValue.time}
            onChange={openForRegistrationTime => {
              const newRegistrationTimeInstance = {
                ...value.editValue,
                time: openForRegistrationTime,
              };
              onChange(parseTimeInstance(newRegistrationTimeInstance));
            }}
          />
          <TimezoneDropdown
            value={value.editValue.timezone}
            onChange={timezone => {
              const newRegistrationTimeInstance = {
                ...value.editValue,
                timezone,
              };
              onChange(parseTimeInstance(newRegistrationTimeInstance));
            }}
          />
        </div>
      </div>
      <ValidationResult validationResult={value.errors} />
    </section>
  );
};
