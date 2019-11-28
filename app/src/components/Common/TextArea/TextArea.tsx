import React from 'react';

interface IProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const TextArea = ({
  label,
  value,
  onChange,
  placeholder,
}: IProps): JSX.Element => {
  return (
    <>
      <label htmlFor={label}>{label}</label>
      <textarea
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
