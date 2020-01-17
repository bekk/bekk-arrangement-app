import React from 'react';
import logo from 'src/images/logo.svg';
import style from './Header.module.scss';
import { eventsRoute } from 'src/routing';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <div className={style.logoContainer}>
      <Link to={eventsRoute}>
        <img className={style.logo} src={logo} alt="logo" />
      </Link>
    </div>
  );
};
