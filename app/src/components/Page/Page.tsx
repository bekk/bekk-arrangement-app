import React from 'react';
import style from './Page.module.scss';

interface Props {
  children: JSX.Element | (JSX.Element | false | null | undefined)[];
}

export const Page = ({ children }: Props) => (
  <div className={style.content}>{children}</div>
);
