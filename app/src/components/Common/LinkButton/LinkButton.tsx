import React from 'react';
import { Link } from 'react-router-dom';
import { ReactChild } from 'src/types';
import style from './LinkButton.module.scss';

export const LinkButton = (props: { to: string; children: ReactChild }) => {
  return (
    <Link to={props.to} className={style.linkButton}>
      {props.children}
    </Link>
  );
};
