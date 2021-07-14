import React, { ReactChild, useState } from 'react';
import style from './Header.module.scss';
import { SineCurve } from 'src/components/Common/SineCurve/SineCurve';
import classNames from 'classnames';
import { getColor } from 'src/components/ViewEventsCards/EventCardElement';
import { soloppgang } from 'src/style/colors';

interface IProps {
  children: ReactChild[] | ReactChild;
  eventId?: string;
}

export const WavySubHeader = ({ children, eventId }: IProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const color = eventId && getColor(eventId, style);
  const colorStyle = color ? color.style : style.soloppgang;
  const colorCode = color ? color.colorCode : soloppgang;

  return (
    <div
      className={style.subHeaderContainer}
      onMouseMove={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={classNames(style.contentContainer, colorStyle)}>
        {children}
      </div>
      <div className={style.sineCurve}>
        <SineCurve
          width={window.innerWidth}
          height={100}
          frequency={25}
          amplitude={8}
          speed={2}
          animate={isHovered}
          color={colorCode}
          className={style.sineCurveContent}
        />
      </div>
    </div>
  );
};
