import React from 'react';
import style from './DateInput.module.scss';
import { EditDate } from 'src/types/date';
import classNames from 'classnames';

interface IProps {
  value: EditDate;
  onChange: (value: EditDate) => void;
}

export const DateInput = ({ value, onChange }: IProps): JSX.Element => {
  const isIPhone = window.navigator.userAgent.includes('iPhone');
  const dateStyle = classNames(style.dateInput, {
    [style.iPhone]: isIPhone,
  });

  return (
    <input
      className={dateStyle}
      type="date"
      onChange={v => onChange(v.target.value)}
      value={value}
      required
    />
  );
};
