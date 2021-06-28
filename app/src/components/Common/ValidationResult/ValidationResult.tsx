import React from 'react';
import style from './ValidationResult.module.scss';
import classNames from 'classnames';
import { IError, ErrorType } from 'src/types/validation';

interface IProps {
  validationResult?: IError[];
  backgroundColor?: 'White' | 'Black';
}

export const ValidationResult = ({
  validationResult,
  backgroundColor = 'Black',
}: IProps) => {
  const circleStyle = (type: ErrorType) =>
    classNames(style.circle, {
      [style.error]: type === 'Error',
      [style.warning]: type === 'Warning',
    });
  const textStyle = (backgroundColor: string) =>
    classNames(style.message, {
      [style.darkText]: backgroundColor === 'White',
    });

  return (
    <div className={style.validation}>
      {validationResult &&
        validationResult.map((v) => (
          <div key={v.message} className={style.errorMessage}>
            <div className={circleStyle(v.type)}></div>
            <span className={textStyle(backgroundColor)}>{v.message}</span>
          </div>
        ))}
    </div>
  );
};
