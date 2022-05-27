import jwt from 'jsonwebtoken';
import { accessTokenKey, accessTokenMaxAge, refreshTokenKey, refreshTokenMaxAge } from '../config';
import DBService from './DBService';
import { Tokens } from '../types';

export class TokenService {
  private dbService: DBService;
  private db;

  constructor() {
    this.dbService = DBService.getInstance();
    this.db = this.dbService.getTokenDB();
  }

  public generateTokens(payload): Tokens {
    const accessToken = jwt.sign(payload, accessTokenKey, { expiresIn: accessTokenMaxAge });
    const refreshToken = jwt.sign(payload, refreshTokenKey, { expiresIn: refreshTokenMaxAge });

    return {
      accessToken,
      refreshToken,
    };
  }

  public async saveToken(refreshToken: string, userId: number) {
    const tokens = await this.getUserTokens(userId);
    const verifiedTokens = this.getVerifiedUserTokens(tokens);

    verifiedTokens.push(refreshToken);

    return await this.db.put(String(userId), verifiedTokens);
  }

  public async getUserTokens(userId: number): Promise<string[]> {
    try {
      return await this.db.get(String(userId));
    } catch (e) {
      if (e.status === 404) {
        return [];
      }
      throw e;
    }
  }

  public getVerifiedUserTokens(tokens: Array<string>): string[] {
    const verifiedTokens: string[] = [];

    tokens.forEach((token) => {
      jwt.verify(token, refreshTokenKey, (err) => {
        if (!err) {
          verifiedTokens.push(token);
        }
      });
    });

    return verifiedTokens;
  }

  public async revokeToken(token: string) {
    const data = jwt.verify(token, refreshTokenKey);
    const userId = data.id;
    const tokens = await this.getUserTokens(userId);
    const neededTokens = tokens.filter((i) => {
      return i !== token;
    });
    return await this.db.put(String(userId), neededTokens);
  }

  public async revokeAllUserTokens(userId: number) {
    return await this.db.del(String(userId));
  }

  public validateRefreshToken(refreshToken) {
    try {
      return jwt.verify(refreshToken, refreshTokenKey);
    } catch (e) {
      return null;
    }
  }

  public validateAccessToken(accessToken) {
    try {
      return jwt.verify(accessToken, accessTokenKey);
    } catch (e) {
      return null;
    }
  }

  public async checkRefreshInDB(token): Promise<boolean> {
    try {
      const data = jwt.verify(token, refreshTokenKey);
      const userId = data.id;
      const tokens = await this.getUserTokens(userId);
      return tokens.includes(token);
    } catch (e) {
      return false;
    }
  }
}

export default new TokenService();
