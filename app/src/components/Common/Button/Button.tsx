import React from 'react';
import style from './Button.module.scss';
import classNames from 'classnames';
import { ReactChild } from 'src/types';

interface IProps {
  onClick: () => void;
  disabled?: boolean;
  color?: 'Primary' | 'Secondary';
  displayAsLink?: boolean;
  children?: ReactChild;
}
export const Button = ({
  onClick,
  color = 'Primary',
  disabled = false,
  displayAsLink = false,
  children,
}: IProps) => {
  const buttonStyle = classNames({
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
