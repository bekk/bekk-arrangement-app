import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
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
      <TextareaAutosize
        className={style.textArea}
        minRows={3}
        id={label}
        placeholder={placeholder}
        value={value}
        onChange={v => onChange(v.target.value)}
      />
    </>
  );
};
