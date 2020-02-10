import { Result, validate } from './validation';

export interface Email {
  email: string;
}

export const serializeEmail = ({ email }: Email) => email;
export const stringifyEmail = ({ email }: Email) => email;

export const parseEmail = (email: string): Result<string, Email> => {
  const validator = validate<string, Email>(email, {
    'E-post må inneholde minst tre tegn': email.length < 3,
    'E-post må inneholde et @-tegn': !email.includes('@'),
  });
  return validator.resolve({ email });
};
