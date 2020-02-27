import {
  Editable,
  validate,
  IError,
  isIErrorList,
  editable,
} from './validation';
import {
  Email,
  toEmailWriteModel,
  parseEmailViewModel,
  toEditEmail,
} from './email';
import { isErrorFree } from 'src/utils';

export interface IParticipantWriteModel {
  name: string;
  email: string;
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
  comment: string;
}

export interface IEditParticipant {
  name: Editable<string, string>;
  email: Editable<string, Email>;
  comment: Editable<string, string>;
}

export const toParticipantWriteModel = (
  participant: IParticipant
): IParticipantWriteModel => {
  return {
    ...participant,
    email: toEmailWriteModel(participant.email),
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

  if (!isErrorFree(participant)) {
    throw {
      status: 'ERROR',
      userMessage:
        'Participant kan ikke parses av følgende grunner: ' +
        Object.values(participant)
          .filter(isIErrorList)
          .flat()
          .map(x => x.message)
          .join(', '),
    };
  }

  return participant;
};

export const parseEditParticipant = ({
  name,
  email,
  comment,
}: IEditParticipant): IParticipant | IError[] => {
  const participant = {
    name: name.errors ?? name.validValue,
    email: email.errors ?? email.validValue,
    comment: comment.errors ?? comment.validValue,
  };

  if (!isErrorFree(participant)) {
    return Object.values(participant)
      .filter(isIErrorList)
      .flat();
  }

  return participant;
};

export const toEditParticipant = ({
  name,
  email,
  comment,
}: IParticipant): IEditParticipant => ({
  name: editable(name),
  email: editable(toEditEmail(email)),
  comment: editable(comment),
});

export const parseName = (value: string): string | IError[] => {
  const validator = validate<string, string>({
    'Navn må ha minst tre tegn': value.length < 3,
    'Navn kan ha maks 60 tegn': value.length > 60,
  });
  return validator.resolve(value);
};

export const parseComment = (value: string): string | IError[] => {
  const validator = validate<string, string>({
    'Kommentar kan ha maks 500 tegn': value.length > 500,
  });
  return validator.resolve(value);
};

export const initalParticipant: IParticipant = {
  email: { email: '' },
  name: '',
  comment: '',
};
