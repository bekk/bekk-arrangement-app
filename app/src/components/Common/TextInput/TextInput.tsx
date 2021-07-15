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
  color?: 'White' | 'Gray' | 'Black';
}

export const TextInput = ({
  label,
  value,
  onChange,
  placeholder = '',
  isNumber = false,
  isError = false,
  onBlur = () => undefined,
  color = 'Black',
}: IProps): JSX.Element => {
  const [hasVisited, setVisited] = useState(false);
  const inputStyle = classNames(style.textInput, {
    [style.visited]: hasVisited,
    [style.error]: hasVisited && isError,
    [style.blackTextInput]: color === 'Black',
    [style.whiteTextInput]: color === 'White',
  });
  return (
    <>
      <label className={style.textLabel} htmlFor={label}>
        {label}
      </label>
      <input
        id={label}
        type={isNumber ? 'number' : 'text'}
        className={inputStyle}
        placeholder={placeholder}
        value={value}
        onChange={(v) => onChange(v.target.value)}
        onFocus={() => setVisited(true)}
        onBlur={onBlur}
      />
    </>
  );
};
