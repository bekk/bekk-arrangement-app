import { Result, validate } from './validation';

export interface Email {
  email: string;
}

export const serializeEmail = ({ email }: Email) => email;

export const validateEmail = (email: string): Result<string, Email> => {
  const validator = validate<string, Email>(email, {
    'Email must consist of atleast 3 symbols': email.length < 3,
  });
  return validator.resolve({ email });
};
