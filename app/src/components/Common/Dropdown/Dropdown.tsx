import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
//import { createUseStyles } from 'react-jss';
import { Arrow } from 'src/components/Common/Arrow/Arrow';
//import { useAmplitudeClient } from 'src/hooks/amplitude';
//import { useOnClickOutside } from 'src/hooks/eventListener';
import style from './Dropdown.module.scss';
// import { hvit, overskyet, svart, gul } from 'src/style/colors';
// import { buttonDesktop, buttonMobile, desktop } from 'src/style/constants';
// import { fontLight } from 'src/style/fonts';
//import { AmplitudeTrackEvent } from 'src/types/amplitude';

export interface IDropdownItem<T> {
  name: string;
  id: T;
}

interface IProps<T> {
  items: IDropdownItem<T>[];
  onChange(id: T): void;
  selectedId: T;
  //trackEventSelected?: AmplitudeTrackEvent;
  isDark?: boolean;
  className?: string;
}

export const Dropdown = <T extends number | string>({
  items,
  onChange,
  selectedId,
  //trackEventSelected,
  isDark = false,
  className,
}: IProps<T>) => {
  //const { logEvent } = useAmplitudeClient();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  //const styles = useStyles();
  const selectedItem = items.find((x) => x.id === selectedId);

  /*const closeWhenClickOutsideRef = useOnClickOutside<HTMLDivElement>(
    useCallback(() => {
      setDropdownOpen(false);
    }, [])
  );*/

  const handleSelect = (id: T) => {
    //logEvent(trackEventSelected);
    setDropdownOpen(false);
    onChange(id);
  };

  const dropdownStyle = classNames(style.dropdown, className, {
    [style.dropdownBackground]: dropdownOpen,
    [style.dropdownWhite]: !isDark,
    [style.dropdownDark]: isDark,
  });

  const selectedElementStyle = classNames(style.selectedElement, {
    [style.selectedElementOpen]: dropdownOpen,
  });

  const arrowStyle = classNames(style.arrow, {
    [style.upSideDown]: dropdownOpen,
  });

  const dropdownElementStyle = (element: IDropdownItem<T>) =>
    classNames(style.dropdownElement, {
      [style.dropdownElementSelected]: selectedItem === element,
    });

  return (
    <div
      className={dropdownStyle}
      //ref={closeWhenClickOutsideRef}
      onClick={() => setDropdownOpen(!dropdownOpen)}
    >
      <div className={selectedElementStyle}>
        <p className={style.text}>{selectedItem?.name}</p>
        <Arrow className={arrowStyle} direction={'down'} />
      </div>
      {dropdownOpen && (
        <div className={style.elementsWrapper}>
          {items.map((x) => (
            <div
              className={dropdownElementStyle(x)}
              key={x.id}
              onClick={() => handleSelect(x.id)}
            >
              <p>{x.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// const useStyles = createUseStyles({
//   dropdown: {
//     position: 'relative',
//     display: 'block',
//     borderRadius: 20,
//     width: 210,
//     '&:hover': {
//       cursor: 'pointer',
//       backgroundColor: hvit,
//       color: svart,
//       border: `1px solid ${svart}`,
//       '& svg': {
//         fill: svart,
//       },
//     },
//   },
//   dropdownWhite: {
//     color: hvit,
//     border: `1px solid ${hvit}`,
//     '& svg': {
//       fill: hvit,
//     },
//   },
//   dropdownDark: {
//     color: svart,
//     border: `1px solid ${svart}`,
//     '& svg': {
//       fill: svart,
//     },
//   },
//   dropdownBackground: {
//     paddingBottom: 20,
//     color: svart,
//     backgroundColor: hvit,
//     border: `1px solid ${svart}`,
//     '& svg': {
//       fill: svart,
//     },
//   },
//   selectedElement: {
//     display: 'flex',
//     color: 'inherit',
//     height: '100%',
//     width: '100%',
//     padding: [0, 25],
//     fontFamily: fontLight,
//     fontSize: buttonMobile,
//     [`@media ${desktop}`]: {
//       fontSize: buttonDesktop,
//     },
//     '-webkit-appearance': 'none',
//     '& > p': {
//       margin: [10, 0],
//     },
//   },
//   selectedElementOpen: {
//     borderBottomColor: svart,
//     borderBottomStyle: 'solid',
//     borderBottomWidth: 1,
//   },
//   elementsWrapper: {
//     maxHeight: 280,
//     overflowY: 'auto',
//   },
//   dropdownElement: {
//     minHeight: '1.25em',
//     lineHeight: '1.25',
//     padding: 5,
//     width: '100%',
//     overflowX: 'hidden',
//     textOverflow: 'ellipsis',
//     '&:hover': {
//       backgroundColor: overskyet,
//       color: svart,
//     },
//     '&:active': {
//       backgroundColor: gul,
//     },
//     '& > p': {
//       margin: 5,
//       marginLeft: 10,
//     },
//   },
//   dropdownElementSelected: {
//     backgroundColor: gul,
//   },
//   arrow: {
//     position: 'absolute',
//     right: 20,
//     transition: '0.2s ease-out',
//     cursor: 'pointer',
//     placeSelf: 'center',
//   },
//   upSideDown: {
//     transform: 'rotate(180deg)',
//     transition: '0.2s ease-out',
//   },
//   text: {
//     whiteSpace: 'nowrap',
//     paddingRight: 10,
//   },
// });
