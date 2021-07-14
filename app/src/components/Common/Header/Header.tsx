import React from 'react';
import logo from 'src/images/logo.svg';
import logoBlack from 'src/images/logoBlack.svg';
import style from './Header.module.scss';
import { eventsRoute } from 'src/routing';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';

export const Header = () => {
  const location = useLocation();

  const blackHeaderBackground =
    location.pathname === '/events/create' ||
    location.pathname.split('/')[3] === 'edit' ||
    location.pathname.split('/')[3] === 'preview';

  const headerStyle = classNames(style.logoContainer, {
    [style.coloredHeader]: !blackHeaderBackground,
  });

  return (
    <div className={headerStyle}>
      <Link to={eventsRoute}>
        {blackHeaderBackground ? (
          <img className={style.logo} src={logo} alt="logo" />
        ) : (
          <img className={style.logo} src={logoBlack} alt="logo" />
        )}
      </Link>
    </div>
  );
};
