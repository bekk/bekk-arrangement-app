import React from 'react';
import { Link } from 'react-router-dom';
import { rootRoute, overviewRoute } from '../../../routing';
import style from './Menu.module.scss';
import classNames from 'classnames';

type SelectedTab = 'create' | 'edit' | 'overview';

interface IProps {
  tab: SelectedTab;
}

export const Menu = ({ tab }: IProps) => {
  const menuStyle = (thisTab: SelectedTab) =>
    classNames({
      [style.menuItem]: true,
      [style.selected]: tab === thisTab,
    });

  return (
    <div className={style.container}>
      <Link to={rootRoute} className={menuStyle('create')}>
        Create event
      </Link>
      <Link to={overviewRoute} className={menuStyle('edit')}>
        Edit event
      </Link>
      <Link to={overviewRoute} className={menuStyle('overview')}>
        Event Overview
      </Link>
    </div>
  );
};
