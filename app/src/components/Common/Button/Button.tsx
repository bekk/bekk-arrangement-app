import React from 'react';
import style from './Button.module.scss';

interface IProps {
  label: string;
  onClick: () => void;
  disabled: boolean;
}
export const Button = ({ label, onClick, disabled }: IProps) => {
  return (
    <div className={style.buttonContainer}>
      <button className={style.button} onClick={onClick} disabled={disabled}>
        <p className={style.buttonLabel}>{label}</p>
      </button>
    </div>
  );
};
