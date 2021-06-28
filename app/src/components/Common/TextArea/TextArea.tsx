import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import style from './TextArea.module.scss';
import classNames from 'classnames';

interface IProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isError?: boolean;
  onBlur?: () => void;
  backgroundColor?: 'White' | 'Black';
  minRow?: number;
}

export const TextArea = ({
  label,
  placeholder = '',
  value,
  onChange,
  isError = false,
  onBlur = () => undefined,
  backgroundColor = 'Black',
  minRow = 2,
}: IProps): JSX.Element => {
  const [hasVisited, setVisited] = useState(false);
  const inputStyle = classNames(style.textArea, {
    [style.visited]: hasVisited,
    [style.error]: hasVisited && isError,
    [style.whiteTextArea]: backgroundColor === 'White',
    [style.darkBackground]: backgroundColor === 'Black',
  });
  return (
    <>
      {label && (
        <label className={style.textLabel} htmlFor={label}>
          {label}
        </label>
      )}
      <TextareaAutosize
        className={inputStyle}
        minRows={minRow}
        id={label}
        placeholder={placeholder}
        value={value}
        onChange={(v) => onChange(v.target.value)}
        onFocus={() => setVisited(true)}
        onBlur={onBlur}
      />
    </>
  );
};
