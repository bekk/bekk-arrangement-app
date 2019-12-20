import React from 'react';
import style from './TextArea.module.scss';

interface IProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TextArea = ({
  label,
  value,
  onChange,
  placeholder = '',
}: IProps): JSX.Element => {
  return (
    <>
      <label className={style.textLabel} htmlFor={label}>
        {label}
      </label>
      <textarea
        className={style.textArea}
        id={label}
        rows={5}
        cols={33}
        placeholder={placeholder}
        value={value}
        onChange={v => onChange(v.target.value)}
      ></textarea>
    </>
  );
};
