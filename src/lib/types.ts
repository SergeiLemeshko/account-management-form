export type TypeRecord = 'LDAP' | 'Локальная';

export interface IAccount {
  id: number;
  labelArray?: { text: string }[];
  type: string;
  login: string;
  password: string | null;
}

export interface IAccountForm {
  login: string;
  password: string;
  labels: string | null;
  type: string | null;
}
