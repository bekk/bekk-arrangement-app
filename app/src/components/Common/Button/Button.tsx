import React from 'react';
import style from './Button.module.scss';

interface IProps {
    label: string;
    onClick: () => void;
}
export const Button = ({ label, onClick } : IProps) => {
    return (
        <button className={style.button} onClick={onClick}>
            <p className={style.buttonLabel}>Forhåndsvisning</p>
        </button>
    )
}