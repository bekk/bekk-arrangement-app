import { IDateTime } from './date-time';

export interface IEventContract {
  title: string;
  description: string;
  location: string;
  startDate: IDateTime;
  endDate: IDateTime;
  openForRegistrationDate: IDateTime;
  organizerEmail: string;
  participants: string;
}
