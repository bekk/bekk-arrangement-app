import React from 'react';
import style from './Button.module.scss';

interface IProps {
  onClick: () => void;
  disabled?: boolean;
  children?: string;
}
export const Button = ({ onClick, disabled = false, children }: IProps) => {
  return (
    <button className={style.button} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
