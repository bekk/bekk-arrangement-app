import React from 'react';
import style from './Button.module.scss';
import classNames from 'classnames';
import { ReactChild } from 'src/types';

interface IProps {
  onClick: () => void;
  disabled?: boolean;
  color?: 'White' | 'Black';
  displayAsLink?: boolean;
  children?: ReactChild;
}
export const Button = ({
  onClick,
  color = 'Black',
  disabled = false,
  displayAsLink = false,
  children,
}: IProps) => {
  const buttonStyle = classNames({
    [style.button]: !displayAsLink,
    [style.whiteButton]: color === 'White' && !displayAsLink,
    [style.link]: displayAsLink,
  });
  return (
    <button className={buttonStyle} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
