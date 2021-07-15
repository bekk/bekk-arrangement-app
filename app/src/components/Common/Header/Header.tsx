import React from 'react';
import logo from 'src/images/logo.svg';
import logoBlack from 'src/images/logoBlack.svg';
import style from './Header.module.scss';
import { eventsRoute, shouldHaveBlackHeaderBackground } from 'src/routing';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';

export const Header = () => {
  const location = useLocation();

  const blackHeader = shouldHaveBlackHeaderBackground(location)

  const headerStyle = classNames(style.logoContainer, {
    [style.coloredHeader]: !blackHeader,
  });

  const headerLogo = blackHeader ? logo : logoBlack

  return (
    <div className={headerStyle}>
      <Link to={eventsRoute}>
          <img className={style.logo} src={headerLogo} alt="logo" />
      </Link>
    </div>
  );
};
