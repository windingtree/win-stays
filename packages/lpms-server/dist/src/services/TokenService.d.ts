import { Tokens } from '../types';

export default class TokenService {
  private dbService;
  private db;

  constructor();

  generateTokens(payload: any): Tokens;

  saveToken(refreshToken: string, userId: number): Promise<any>;

  getUserTokens(userId: number): Promise<string[]>;

  getVerifiedUserTokens(tokens: Array<string>): string[];

  revokeToken(token: string): Promise<any>;

  validateRefreshToken(refreshToken: any): any;

  validateAccessToken(accessToken: any): any;

  checkRefreshInDB(token: any): Promise<boolean>;
}
