import { validate, IError, assertIsValid, listOfErrors } from './validation';
import {
  Email,
  parseEmailViewModel,
  toEditEmail,
  parseEditEmail,
} from './email';
import { getEmailAndNameFromJWT } from 'src/auth';

export interface IParticipantWriteModel {
  name: string;
  comment: string;
  cancelUrlTemplate: string;
}

export interface IParticipantViewModel {
  name: string;
  email: string;
  eventId: string;
  registrationTime: number;
  comment: string;
}

export interface IParticipantsWithWaitingList {
  attendees: IParticipant[];
  waitingList?: IParticipant[];
}

export interface IParticipantViewModelsWithWaitingList {
  attendees: IParticipantViewModel[];
  waitingList?: IParticipantViewModel[];
}

export interface INewParticipantViewModel {
  participant: IParticipantViewModel;
  cancellationToken: string;
}

export interface IParticipant {
  name: string;
  email: Email;
  comment: string;
}

export interface IEditParticipant {
  name: string;
  email: string;
  comment: string;
}

export const toParticipantWriteModel = (
  participant: IParticipant,
  cancelUrlTemplate: string = ''
): IParticipantWriteModel => {
  return {
    ...participant,
    cancelUrlTemplate,
  };
};

export const parseParticipantViewModel = (
  participantView: IParticipantViewModel
): IParticipant => {
  const email = parseEmailViewModel(participantView.email);
  const name = parseName(participantView.name);
  const comment = parseComment(participantView.comment);

  const participant = {
    ...participantView,
    email,
    name,
    comment,
  };

  assertIsValid(participant);

  return participant;
};

export const parseEditParticipant = ({
  name,
  email,
  comment,
}: IEditParticipant): IParticipant | IError[] => {
  const participant = {
    name: parseName(name),
    email: parseEditEmail(email),
    comment: parseComment(comment),
  };

  try {
    assertIsValid(participant);
  } catch {
    return listOfErrors(participant);
  }

  return participant;
};

export const toEditParticipant = ({
  name,
  email,
  comment,
}: IParticipant): IEditParticipant => ({
  name,
  email: toEditEmail(email),
  comment,
});

export const parseName = (value: string): string | IError[] => {
  const validator = validate<string>({
    'Navn må ha minst tre tegn': value.length < 3,
    'Navn kan ha maks 60 tegn': value.length > 60,
  });
  return validator.resolve(value);
};

export const parseComment = (value: string): string | IError[] => {
  const validator = validate<string>({
    'Kommentar kan ha maks 500 tegn': value.length > 500,
  });
  return validator.resolve(value);
};

export function initalParticipant(): IParticipant {
  const { name, email } = getEmailAndNameFromJWT();
  return {
    email: { email:email ?? '' },
    name: name ?? '',
    comment: '',
  };
}
