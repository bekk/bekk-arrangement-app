import React from 'react';
import { Menu } from '../../Common/Menu/Menu';
import style from './EventOverview.module.scss';

export const EventOverview = () => {
  return (
    <div className={style.container}>
      <Menu tab={'overview'} />
      <div className={style.overview}>Hello overview</div>
    </div>
  );
};
