import { Result, validate } from './validation';

export interface Email {
  email: string;
}

export const serializeEmail = ({ email }: Email) => email;

export const parseEmail = (email: string): Result<string, Email> => {
  const validator = validate<string, Email>(email, {
    'E-post må inneholde minst tre tegn': email.length < 3,
  });
  return validator.resolve({ email });
};
