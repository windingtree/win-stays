'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator['throw'](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const config_1 = require('../config');
const DBService_1 = __importDefault(require('./DBService'));

class TokenService {
  constructor() {
    this.dbService = DBService_1.default.getInstance();
    this.db = this.dbService.getTokenDB();
  }

  generateTokens(payload) {
    const accessToken = jsonwebtoken_1.default.sign(payload, config_1.accessTokenKey, { expiresIn: '30m' });
    const refreshToken = jsonwebtoken_1.default.sign(payload, config_1.refreshTokenKey, { expiresIn: '30d' });
    return {
      accessToken,
      refreshToken,
    };
  }

  saveToken(refreshToken, userId) {
    return __awaiter(this, void 0, void 0, function* () {
      const tokens = yield this.getUserTokens(userId);
      const verifiedTokens = this.getVerifiedUserTokens(tokens);
      verifiedTokens.push(refreshToken);
      return yield this.db.put(String(userId), verifiedTokens);
    });
  }

  getUserTokens(userId) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        return yield this.db.get(String(userId));
      } catch (e) {
        if (e.status === 404) {
          return [];
        }
        throw e;
      }
    });
  }

  getVerifiedUserTokens(tokens) {
    const verifiedTokens = [];
    tokens.forEach((token) => {
      jsonwebtoken_1.default.verify(token, config_1.refreshTokenKey, (err) => {
        if (!err) {
          verifiedTokens.push(token);
        }
      });
    });
    return verifiedTokens;
  }

  revokeToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
      const data = jsonwebtoken_1.default.verify(token, config_1.refreshTokenKey);
      const userId = data.id;
      const tokens = yield this.getUserTokens(userId);
      const neededTokens = tokens.filter((i) => {
        return i !== token;
      });
      return yield this.db.put(String(userId), neededTokens);
    });
  }

  validateRefreshToken(refreshToken) {
    try {
      return jsonwebtoken_1.default.verify(refreshToken, config_1.refreshTokenKey);
    } catch (e) {
      return null;
    }
  }

  validateAccessToken(accessToken) {
    try {
      return jsonwebtoken_1.default.verify(accessToken, config_1.accessTokenKey);
    } catch (e) {
      return null;
    }
  }

  checkRefreshInDB(token) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = jsonwebtoken_1.default.verify(token, config_1.refreshTokenKey);
        const userId = data.id;
        const tokens = yield this.getUserTokens(userId);
        return tokens.includes(token);
      } catch (e) {
        return false;
      }
    });
  }
}

exports.default = TokenService;
//# sourceMappingURL=TokenService.js.map
