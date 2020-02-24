import React from 'react';
import style from './ButtonLink.module.scss';

type ReactElement = JSX.Element | string | false | null | undefined;

interface IProps {
  onClick: () => void;
  children: ReactElement | ReactElement[];
}

export const ButtonLink = ({ onClick, children }: IProps) => (
  <button className={style.link} onClick={onClick}>
    {children}
  </button>
);
