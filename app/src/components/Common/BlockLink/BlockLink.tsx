import React from 'react';
import { Link } from 'react-router-dom';
import style from './BlockLink.module.scss';
import { ReactChild } from 'src/types';

interface IProps {
  to: string;
  children: ReactChild | ReactChild[];
}

export const BlockLink = ({ to, children }: IProps) => (
  <Link to={to} className={style.link}>
    {children}
  </Link>
);
