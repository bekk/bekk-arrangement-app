import { Result, isOk } from './validation';
import { parseEmail, serializeEmail, Email } from './email';

export interface IParticipantWriteModel {
  email: string;
  eventId: string;
}

export interface IParticipantViewModel {
  email: string;
  eventId: string;
  registrationTime: number;
}

export interface INewParticipantViewModel {
  participant: IParticipantViewModel;
  cancellationToken: string;
}

export interface IParticipant {
  email: Email;
  eventId: string;
}

export interface IEditParticipant {
  email: Result<string, Email>;
  eventId: string;
}

export const serializeParticipant = (
  participant: IParticipant
): IParticipantWriteModel => {
  return {
    ...participant,
    email: serializeEmail(participant.email),
  };
};

export const deserializeParticipant = (
  participant: IParticipantViewModel
): IEditParticipant => {
  const email = parseEmail(participant.email);
  return {
    ...participant,
    email,
  };
};

export const parseParticipant = (
  participant: IEditParticipant
): Result<IEditParticipant, IParticipant> => {
  const parsedParticipant = parseEmail(participant.email.editValue);
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
  email: parseEmail(''),
};
