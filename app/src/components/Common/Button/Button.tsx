import React from 'react';
import style from './Button.module.scss';
import classNames from 'classnames';
import { ReactChild } from 'src/types';

interface IProps {
  onClick: () => void;
  disabled?: boolean;
  color?: 'White' | 'Black';
  children?: ReactChild;
}
export const Button = ({
  onClick,
  color = 'Black',
  disabled = false,
  children,
}: IProps) => {
  const buttonStyle = classNames(style.button, {
    [style.whiteButton]: color === 'White',
  });
  return (
    <button className={buttonStyle} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
