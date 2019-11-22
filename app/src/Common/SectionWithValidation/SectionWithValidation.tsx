import React from 'react';
import style from './SectionWithValidation.module.scss';

import { validationTypeAsIcon, IValidation } from '../../types/validation';

interface IProps {
  validationResult?: IValidation[];
  children: JSX.Element | JSX.Element[];
}

export const SectionWithValidation = ({
  validationResult,
  children,
}: IProps) => {
  return (
    <article className={style.textInput}>
      {children}
      {validationResult &&
        validationResult.map((v, index) => (
          <small key={index}>
            {validationTypeAsIcon(v.type)} {v.message}
          </small>
        ))}
    </article>
  );
};
