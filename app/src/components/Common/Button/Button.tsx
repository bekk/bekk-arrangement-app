import React, { MouseEventHandler } from 'react';
import style from './Button.module.scss';
import classNames from 'classnames';
import { ReactChild } from 'src/types';

interface IProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  color?: 'Primary' | 'Secondary';
  displayAsLink?: boolean;
  children?: ReactChild;
  className?: string;
}
export const Button = ({
  onClick,
  color = 'Primary',
  disabled = false,
  displayAsLink = false,
  children,
  className,
}: IProps) => {
  const buttonStyle = classNames(className, {
    [style.button]: !displayAsLink,
    [style.secondaryButton]: color === 'Secondary' && !displayAsLink,
    [style.primaryButton]: color === 'Primary' && !displayAsLink,
    [style.link]: displayAsLink,
  });
  return (
    <button className={buttonStyle} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
