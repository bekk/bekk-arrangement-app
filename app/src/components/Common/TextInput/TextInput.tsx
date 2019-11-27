import React from 'react';

interface IProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const TextInput = ({
  label,
  value,
  onChange,
  placeholder,
}: IProps): JSX.Element => {
  return (
    <>
      <label htmlFor={label}>{label}</label>
      <input
        id={label}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={v => onChange(v.target.value)}
      />
    </>
  );
};
