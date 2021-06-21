import React, { useState } from 'react';
import style from './TextInput.module.scss';
import classNames from 'classnames';

interface IProps {
  label: string;
  value: string;
  placeholder?: string;
  isNumber?: boolean;
  onChange: (value: string) => void;
  isError?: boolean;
  onBlur?: () => void;
}

export const TextInput = ({
  label,
  value,
  onChange,
  placeholder = '',
  isNumber = false, 
  isError = false,
  onBlur = () => undefined,
}: IProps): JSX.Element => {
  const [hasVisited, setVisited] = useState(false);
  const inputStyle = classNames(style.textInput, {
    [style.visited]: hasVisited,
    [style.error]: hasVisited && isError,
  });
  return (
    <>
      <label className={style.textLabel} htmlFor={label}>
        {label}
      </label>
      <input
        type={isNumber ? "number" : "text"}
        className={inputStyle}
        placeholder={placeholder}
        value={value}
        onChange={v => onChange(v.target.value)}
        onFocus={() => setVisited(true)}
        onBlur={onBlur}
      />
    </>
  );
};
