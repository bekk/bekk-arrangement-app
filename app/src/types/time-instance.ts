import { validate, Result } from './validation';

export type TimeInstanceContract = string; // BigInt
export type EditTimeInstance = string; // human readable format
export type TimeInstance = Date;

export const deserializeTimeInstance = (
  time: TimeInstanceContract
): EditTimeInstance => new Date(Number(time)).toJSON();

export const parseTimeInstance = (
  time: EditTimeInstance
): Result<EditTimeInstance, TimeInstance> => {
  const unixTimeStamp = Date.parse(time);
  const timestamp = new Date(unixTimeStamp);
  const validator = validate<EditTimeInstance, TimeInstance>(time, {
    'Feil format på streng. Prøv noe som: 2020-02-05 10:07': isNaN(unixTimeStamp)
  })
  return validator.resolve(timestamp);
};

export const serializeTimeInstance = (
  time: TimeInstance
): TimeInstanceContract => time.getTime().toString();

export const stringifyTimeInstance = (time: TimeInstance): string =>
  time.toLocaleDateString();
