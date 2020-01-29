import React from 'react';
import { DateInput } from '../DateInput/DateInput';
import { TimeInput } from '../TimeInput/TimeInput';
import { EditDateTime } from 'src/types/date-time';
import style from './DateTimeInput.module.scss';
import { IError } from 'src/types/validation';
import classNames from 'classnames';

interface IProps {
  label: string;
  value: EditDateTime;
  error: IError[] | undefined;
  onChange: (datetime: EditDateTime) => void;
}

export const DateTimeInput = ({ label, value, error, onChange }: IProps) => {
  const containerStyle = classNames(style.container, {
    [style.error]: error,
  });
  return (
    <section className={style.grid}>
      <label className={style.label}>{label}</label>
      <div className={containerStyle}>
        <DateInput
          value={value.date}
          onChange={date => {
            onChange({ date, time: value.time });
          }}
        />
        <TimeInput
          value={value.time}
          onChange={time => onChange({ date: value.date, time })}
        />
      </div>
    </section>
  );
};
