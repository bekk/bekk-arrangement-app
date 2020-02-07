import { Result } from './validation';

export type TimeInstanceContract = string; // BigInt
export type EditTimeInstance = string; // human readable format
export type TimeInstance = Date;

export const deserializeTimeInstance = (
  time: TimeInstanceContract
): EditTimeInstance => new Date(Number(time)).toJSON();

export const parseTimeInstance = (
  time: EditTimeInstance
): Result<EditTimeInstance, TimeInstance> => {
  const timestamp = Date.parse(time);

  if (isNaN(timestamp)) {
    return {
      editValue: time,
      errors: [
        {
          type: 'Error',
          message: 'Feil format på streng. Prøv noe som: 2020-02-05 10:07',
        },
      ],
    };
  }

  return {
    editValue: time,
    validValue: new Date(timestamp),
    errors: undefined,
  };
};

export const serializeTimeInstance = (
  time: TimeInstance
): TimeInstanceContract => time.getTime().toString();

export const stringifyTimeInstance = (time: TimeInstance): string =>
  time.toLocaleDateString();
