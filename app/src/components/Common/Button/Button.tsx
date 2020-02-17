import React from 'react';
import style from './Button.module.scss';
import classNames from 'classnames';

interface IProps {
  onClick: () => void;
  disabled?: boolean;
  color?: 'White' | 'Black';
  children?:
    | string
    | (JSX.Element | false)
    | (JSX.Element | undefined | false)[];
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
