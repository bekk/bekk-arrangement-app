import React from 'react';
import { Menu } from '../../Common/Menu/Menu';
import style from './EventOverview.module.scss';
import { Event } from './Event';

export const EventOverview = () => {
  return (
    <div className={style.container}>
      <Menu tab={'overview'} />
      <div className={style.overview}>
        <Event />
        <Event />
        <Event />
      </div>
    </div>
  );
};
