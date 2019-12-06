import {
  IDate,
  parseDate,
  stringifyDate,
  EditDate,
  validateDate,
  toEditDate,
} from './date';
import {
  ITime,
  validateTime,
  stringifyTime,
  parseTime,
  EditTime,
  toEditTime,
} from './time';
import { Validate } from './validation';

export interface IDateTime {
  date: IDate;
  time: ITime;
}

export type EditDateTime = {
  date: EditDate;
  time: EditTime;
};

export const parseDateTime = (datetime: string) => {
  const date = parseDate(datetime);
  const time = parseTime(datetime);

  return { date, time };
};

export const validateDateTime = (
  datetime: EditDateTime
): Validate<EditDateTime, IDateTime> => {
  const { data: date, errors: dataErrors = [] } = validateDate(datetime.date);
  const { data: time, errors: timeErrors = [] } = validateTime(datetime.time);

  if (!date || !time) {
    return {
      value: datetime,
      errors: [...dataErrors, ...timeErrors],
    };
  }

  return { value: datetime, data: { date, time } };
};

export const stringifyDateTime = ({ date, time }: IDateTime) =>
  `${stringifyDate(date)}T${stringifyTime(time)}`;

export const toEditDateTime = ({ date, time }: IDateTime): EditDateTime => {
  const editDate = toEditDate(date);
  const editTime = toEditTime(time);
  return { date: editDate, time: editTime };
};

//Bør nok flyttes ut i en date utils
export const getNow = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() +
    1}-${today.getDate()}T00:00`;
};
