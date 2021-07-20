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
  disabledResaon?: string | JSX.Element;
}
export const Button = ({
  onClick,
  color = 'Primary',
  disabled = false,
  displayAsLink = false,
  children,
  disabledResaon,
}: IProps) => {
  const buttonStyle = classNames(style.tooltipHover, {
    [style.button]: !displayAsLink,
    [style.secondaryButton]: color === 'Secondary' && !displayAsLink,
    [style.primaryButton]: color === 'Primary' && !displayAsLink,
    [style.link]: displayAsLink,
  });
  return (
    <button className={buttonStyle} onClick={onClick} disabled={disabled}>
      {disabled && disabledResaon && (
        <div className={style.tooltip}>{disabledResaon}</div>
      )}
      {children}
    </button>
  );
};
