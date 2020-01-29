import React from 'react';
import style from './ValidationResult.module.scss';
import classNames from 'classnames';
import { IError, ErrorType } from 'src/types/validation';

interface IProps {
  validationResult?: IError[];
}

export const ValidationResult = ({ validationResult }: IProps) => {
  const circleStyle = (type: ErrorType) =>
    classNames(style.circle, {
      [style.error]: type === 'Error',
      [style.warning]: type === 'Warning',
    });
  return (
    <div className={style.validation}>
      {validationResult &&
        validationResult.map(v => (
          <div key={v.message} className={style.errorMessage}>
            <div className={circleStyle(v.type)}></div>
            {v.message}
          </div>
        ))}
    </div>
  );
};
