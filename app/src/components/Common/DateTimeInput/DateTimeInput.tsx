import React from 'react';
import { DateInput } from '../DateInput/DateInput';
import { TimeInput } from '../TimeInput/TimeInput';
import { EditDateTime } from 'src/types/date-time';
import style from './DateTimeInput.module.scss';

interface IProps {
  label: string;
  value: EditDateTime;
  onChange: (datetime: EditDateTime) => void;
}

export const DateTimeInput = ({ label, value, onChange }: IProps) => {
  return (
    <section>
      {label}
      <section className={style.grid}>
        <DateInput
          label={''}
          value={value.date}
          onChange={date => {
            onChange({ date, time: value.time });
          }}
        />
        <TimeInput
          label={''}
          value={value.time}
          onChange={time => onChange({ date: value.date, time })}
        />
      </section>
    </section>
  );
};