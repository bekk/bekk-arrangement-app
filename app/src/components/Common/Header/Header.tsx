import React from 'react';
import logo from 'src/images/logo.svg';
import style from './Header.module.scss';
import { eventsRoute, useShouldHaveWhiteHeaderBackground } from 'src/routing';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';

export const Header = () => {
  const location = useLocation();

  const shouldHaveWhiteHeader = useShouldHaveWhiteHeaderBackground();
  const headerStyle = classNames(style.header, {
    [style.coloredHeader]: !shouldHaveWhiteHeader,
  });

  return (
    <div className={headerStyle}>
      <Link to={eventsRoute}>
        <img className={style.logo} src={logo} alt="logo" />
      </Link>
    </div>
  );
};
