import React from 'react';
import style from './ValidationResult.module.scss';

import { validationTypeAsIcon, IError } from 'src/types/validation';

interface IProps {
  validationResult?: IError[];
}

export const ValidationResult = ({ validationResult }: IProps) => {
  return (
    <div className={style.validation}>
      {validationResult &&
        validationResult.map(v => (
          <div key={v.message}>
            {validationTypeAsIcon(v.type)} {v.message}
          </div>
        ))}
    </div>
  );
};
