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
  answers: string[];
  cancelUrlTemplate: string;
}

export interface IParticipantViewModel {
  name: string;
  email?: string;
  eventId: string;
  registrationTime: number;
  answers: string[];
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
  answers: string[];
}

export interface IEditParticipant {
  name: string;
  email: string;
  answers: string[];
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
  const email = participantView.email
    ? parseEmailViewModel(participantView.email)
    : { email: '' };
  const name = parseName(participantView.name);
  const answers = parseAnswers(participantView.answers);

  const participant = {
    ...participantView,
    email,
    name,
    answers,
  };

  assertIsValid(participant);

  return participant;
};

export const parseEditParticipant = ({
  name,
  email,
  answers,
}: IEditParticipant): IParticipant | IError[] => {
  const participant = {
    name: parseName(name),
    email: parseEditEmail(email),
    answers: parseAnswers(answers),
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
  answers,
}: IParticipant): IEditParticipant => ({
  name,
  email: toEditEmail(email),
  answers,
});

export const parseName = (value: string): string | IError[] => {
  const validator = validate<string>({
    'Navn må ha minst tre tegn': value.length < 3,
    'Navn kan ha maks 60 tegn': value.length > 60,
  });
  return validator.resolve(value);
};

export const parseAnswers = (value: string[]): string[] | IError[] => {
  const validator = validate<string[]>({
    'Svar kan ha maks 500 tegn': value.every((s) => s.length > 500),
  });
  return validator.resolve(value);
};

export function initalParticipant(): IParticipant {
  const { name, email } = getEmailAndNameFromJWT();
  return {
    email: { email: email ?? '' },
    name: name ?? '',
    answers: [],
  };
}
