export interface IParticipantApi {
  email: string;
  eventId: string;
}

export interface IParticipant {
  email: string;
  eventId: string;
}

export const parseParticipant = (participant: IParticipantApi) => {
  return {
    ...participant,
  };
};
