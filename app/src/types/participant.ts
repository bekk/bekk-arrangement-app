import { Result, isOk, validate } from './validation';
import { parseEmail, serializeEmail, Email } from './email';
import { concatLists } from 'src/types';

export interface IParticipantWriteModel {
  name: string;
  email: string;
  eventId: string;
  comment: string;
}

export interface IParticipantViewModel {
  name: string;
  email: string;
  eventId: string;
  registrationTime: number;
  comment: string;
}

export interface INewParticipantViewModel {
  participant: IParticipantViewModel;
  cancellationToken: string;
}

export interface IParticipant {
  name: string;
  email: Email;
  eventId: string;
  comment: string;
}

export interface IEditParticipant {
  name: Result<string, string>;
  email: Result<string, Email>;
  eventId: string;
  comment: Result<string, string>;
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
  const name = parseName(participant.name);
  const comment = parseComment(participant.comment);
  return {
    ...participant,
    email,
    name,
    comment,
  };
};

export const parseParticipant = (
  participant: IEditParticipant
): Result<IEditParticipant, IParticipant> => {
  if (
    isOk(participant.email) &&
    isOk(participant.name) &&
    isOk(participant.comment)
  ) {
    return {
      editValue: participant,
      errors: undefined,
      validValue: {
        ...participant,
        email: participant.email.validValue,
        name: participant.name.validValue,
        comment: participant.comment.validValue,
      },
    };
  }

  const errors = concatLists(
    participant.name.errors,
    participant.comment.errors,
    participant.email.errors
  );

  return {
    editValue: participant,
    errors,
  };
};

export const maybeParseParticipant = (
  participantContract: IParticipantViewModel
): IParticipant => {
  const deserializedParticipant = deserializeParticipant(participantContract);
  const domainParticipant = parseParticipant(deserializedParticipant);
  if (isOk(domainParticipant)) {
    return domainParticipant.validValue;
  }

  throw {
    status: 'ERROR',
    userMessage:
      'Deltakeren kan ikke parses av følgende grunner: ' +
      domainParticipant.errors.map(x => x.message).join(', '),
  };
};

export const parseName = (value: string): Result<string, string> => {
  const validator = validate<string, string>(value, {
    'Navn må ha minst tre tegn': value.length < 3,
    'Navn kan ha maks 60 tegn': value.length > 60,
  });
  return validator.resolve(value);
};

export const parseComment = (value: string): Result<string, string> => {
  const validator = validate<string, string>(value, {
    'Kommentar kan ha maks 500 tegn': value.length > 500,
  });
  return validator.resolve(value);
};

export const initalParticipant: IEditParticipant = {
  eventId: '0',
  email: parseEmail(''),
  name: parseName(''),
  comment: parseComment(''),
};
