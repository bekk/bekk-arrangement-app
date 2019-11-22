import { IDate } from './date';
import { Validation } from './validation';
import { ITime } from '.';

export interface IDateTime {
  date: Validation<IDate>;
  time: Validation<ITime>;
}

// export createDateTime = ()
