import React from 'react';
import logo from 'src/images/logo.svg';
import commonStyle from 'src/style/Common.module.scss';
import style from './Header.module.scss';

export const Header = () => {
  return (
    <div className={style.logoContainer}>
      <img className={style.logo} src={logo} alt="logo" />
    </div>
  );
};
