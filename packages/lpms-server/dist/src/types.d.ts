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

export declare enum ServiceRole {
  ADMIN = "admin",
  API = "api"
}

export declare enum AppRole {
  MANAGER = "manager",
  STAFF = "staff"
}

export interface Token {
  refresh: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
