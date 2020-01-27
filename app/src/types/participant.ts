import { Result, isOk } from './validation';
import { validateEmail, serializeEmail, Email } from './email';

export interface IParticipantContract {
  email: string;
  eventId: string;
}

export interface IParticipant {
  email: Email;
  eventId: string;
}

export interface IEditParticipant {
  email: string;
  eventId: string;
}

export const serializeParticipant = (
  participant: IParticipant
): IParticipantContract => {
  return {
    ...participant,
    email: serializeEmail(participant.email),
  };
};

export const deserializeParticpant = (
  participant: IParticipantContract
): IEditParticipant => {
  return {
    ...participant,
    email: participant.email,
  };
};

export const parseParticipant = (
  participant: IEditParticipant
): Result<IEditParticipant, IParticipant> => {
  const parsedParticipant = validateEmail(participant.email);
  if (isOk(parsedParticipant)) {
    return {
      editValue: participant,
      errors: undefined,
      validValue: {
        ...participant,
        email: parsedParticipant.validValue,
      },
    };
  }

  return {
    editValue: participant,
    errors: [...parsedParticipant.errors],
  };
};

export const initalParticipant: IEditParticipant = {
  eventId: '0',
  email: '',
};
