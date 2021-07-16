import React from 'react';
import logo from 'src/images/logo.svg';
import logoBlack from 'src/images/logoBlack.svg';
import style from './Header.module.scss';
import { eventsRoute, useShouldHaveBlackHeaderBackground } from 'src/routing';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';

export const Header = () => {
  const location = useLocation();

  const shouldHaveBlackHeader = useShouldHaveBlackHeaderBackground();
  const headerStyle = classNames(style.logoContainer, {
    [style.coloredHeader]: !shouldHaveBlackHeader,
  });

  const headerLogo = shouldHaveBlackHeader ? logo : logoBlack;

  return (
    <div className={headerStyle}>
      <Link to={eventsRoute}>
        <img className={style.logo} src={headerLogo} alt="logo" />
      </Link>
    </div>
  );
};
