import { Request } from 'express';

export interface User {
  id: number;
  login: string;
  password: string;
  roles: AppRole[];
}

export interface UserDTO {
  id: number;
  login: string;
  roles: AppRole[];
}

export enum ServiceRole {
  ADMIN = 'admin',
  BIDDER = 'bidder',
  API = 'api'
}

export enum AppRole {
  MANAGER = 'manager',
  STAFF = 'staff'
}

export interface Token {
  refresh: string;
}

export interface Tokens {
  accessToken: string,
  refreshToken: string
}

export const walletAccounts = [
  ServiceRole.API,
  ServiceRole.BIDDER,
  AppRole.MANAGER,
  AppRole.STAFF,
];

export interface walletAccount {
  id: number,
  address: string,
  role: string
}

export interface AuthRequest extends Request {
  user: UserDTO;
}
