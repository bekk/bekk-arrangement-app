import { WithId } from '.';
import { IRegistrationContract } from './contract-types';

export interface IRegistration {
  participantEmail: string;
}

export type IWriteModel = IRegistrationContract;
export type IViewModel = WithId<IWriteModel>;

export const serializeRegistration = (reg: IRegistration): IWriteModel => ({
  participantEmail: reg.participantEmail,
});
