import React, { useState } from 'react';
import style from './DateInput.module.scss';
import { EditDate } from 'src/types/date';
import {
  CalendarDate,
  monthNumber,
  parseIso8601String,
  serializeIso8601String,
  addMonths,
  CalendarMonth,
  startOfWeek,
  lastDateInMonth,
  addDays,
  periodOfDates,
  datesEqual,
} from 'typescript-calendar-date';
import classNames from 'classnames';
import { useOnClickOutside } from 'src/hooks/navigation';

interface IProps {
  value: EditDate;
  onChange: (value: EditDate) => void;
}

export const DateInput = ({ value, onChange }: IProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useOnClickOutside(() => setIsOpen(false));

  const date = parseIso8601String(value);
  const setDate = (date: CalendarDate) =>
    onChange(serializeIso8601String(date));

  const [displayMonth, setDisplayMonth] = useState<CalendarMonth>(date);
  const decDisplayMonth = () => setDisplayMonth(addMonths(displayMonth, -1));
  const incDisplayMonth = () => setDisplayMonth(addMonths(displayMonth, 1));

  const firstDayOfDisplayMonth: CalendarDate = { ...displayMonth, day: 1 };
  const startOfFirstDisplayWeek = startOfWeek(firstDayOfDisplayMonth);

  const lastDayOfDisplayMonth: CalendarDate = lastDateInMonth(displayMonth);
  const endOfLastDisplayWeek = addDays(startOfWeek(lastDayOfDisplayMonth), 6);

  const daysInPrevMonth = periodOfDates(
    startOfFirstDisplayWeek,
    addDays(firstDayOfDisplayMonth, -1)
  );

  const daysInDisplayMonth = periodOfDates(
    firstDayOfDisplayMonth,
    lastDayOfDisplayMonth
  );

  const daysInNextMonth = periodOfDates(
    addDays(lastDayOfDisplayMonth, 1),
    endOfLastDisplayWeek
  );

  return (
    <div className={style.datePickerContainer}>
      <div onClick={() => setIsOpen(true)}>
        {date.day}. {formatMonthYear(date)}
      </div>
      {isOpen && (
        <div ref={ref} className={style.datepicker}>
          <div className={style.header}>
            <div className={style.button} onClick={decDisplayMonth}>
              -
            </div>
            <div className={style.displayMonth}>
              {formatMonthYear(displayMonth)}
            </div>
            <div className={style.button} onClick={incDisplayMonth}>
              +
            </div>
          </div>
          <div className={style.grid}>
            {daysInPrevMonth.map((d) => (
              <div
                className={classNames(style.date, style.inactiveDate, {
                  [style.selectedInactiveDate]: datesEqual(d, date),
                })}
              >
                <div>{d.day}</div>
              </div>
            ))}
            {daysInDisplayMonth.map((d) => (
              <div
                className={classNames(style.date, style.activeDate, {
                  [style.selectedActiveDate]: datesEqual(d, date),
                })}
                onClick={() => {
                  setDate(d);
                  setIsOpen(false);
                }}
              >
                <div>{d.day}</div>
              </div>
            ))}
            {daysInNextMonth.map((d) => (
              <div
                className={classNames(style.date, style.inactiveDate, {
                  [style.selectedInactiveDate]: datesEqual(d, date),
                })}
              >
                <div>{d.day}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const formatMonthYear = ({ month, year }: CalendarMonth) => {
  const månedsNavn = [
    'januar',
    'februar',
    'mars',
    'april',
    'mai',
    'juni',
    'juli',
    'august',
    'september',
    'oktober',
    'november',
    'desember',
  ];
  const monthName = månedsNavn[monthNumber(month) - 1];
  return `${monthName} ${year}`;
};
