import React from 'react';
import style from './Button.module.scss';

interface IProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  children?: string;
}
export const Button = ({
  label,
  onClick,
  disabled = false,
  children,
}: IProps) => {
  return (
    <button className={style.button} onClick={onClick} disabled={disabled}>
      <label className={style.buttonLabel}>{children || label || ''}</label>
    </button>
  );
};
