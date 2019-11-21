export interface Event {
  title: string;
  description: string;
  location: string;
  start: DateTime;
  end: DateTime;
  openForRegistration: DateTime;
}

export interface DateTime {
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
}
