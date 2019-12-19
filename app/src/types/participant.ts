import { Result, isOk } from './validation';
import { validateEmail, serializeEmail } from './email';

export interface Email {
  email: string;
}

export interface IParticipantContract {
  email: Email;
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

export const serializeParticipan = (
  participant: IParticipant
): IParticipantContract => {
  return {
    ...participant,
  };
};

export const deserializeParticpant = (
  participant: IParticipantContract
): IEditParticipant => {
  return {
    ...participant,
    email: serializeEmail(participant.email),
  };
};

export const parseParticipant = (
  participant: IEditParticipant
): Result<IEditParticipant, IParticipant> => {
  const parsedParticipant = validateEmail(participant.email);
  if (isOk(parsedParticipant)) {
    return {
      from: participant,
      errors: undefined,
      validated: {
        ...participant,
        email: parsedParticipant.validated,
      },
    };
  }

  return {
    from: participant,
    errors: [...parsedParticipant.errors],
  };
};
