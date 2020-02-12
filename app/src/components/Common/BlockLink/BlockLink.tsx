import React from 'react';
import { Link } from 'react-router-dom';
import style from './BlockLink.module.scss';

type ReactElement = JSX.Element | string | false | null | undefined;

interface IProps {
  to: string;
  children: ReactElement | ReactElement[];
}

export const BlockLink = ({ to, children }: IProps) => (
  <Link to={to} className={style.link}>
    {children}
  </Link>
);
