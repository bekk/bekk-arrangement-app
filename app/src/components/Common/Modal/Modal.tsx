import React from 'react';
import style from './Modal.module.scss';
import { useOnClickOutside, useOnEscape } from 'src/hooks/navigation';

interface IProps {
  closeModal(): void;
  header: string;
  children?: JSX.Element | (JSX.Element | undefined | false)[];
}

export const Modal = ({ closeModal, header, children }: IProps) => {
  useOnEscape(closeModal);
  const modalRef = useOnClickOutside(closeModal);
  return (
    <div className={style.modalContainer}>
      <div className={style.modal} ref={modalRef}>
        <div className={style.headerContainer}>
          <h2 className={style.header}>{header}</h2>
        </div>
        <div className={style.modalContent}>{children}</div>
      </div>
    </div>
  );
};
