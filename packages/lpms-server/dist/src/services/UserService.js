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
const DBService_1 = __importDefault(require('./DBService'));
const bcrypt_1 = __importDefault(require('bcrypt'));
const TokenService_1 = __importDefault(require('./TokenService'));
const ApiError_1 = __importDefault(require('../exceptions/ApiError'));

class UserService {
  constructor() {
    this.dbService = DBService_1.default.getInstance();
    this.db = this.dbService.getUserDB();
    this.mainDB = this.dbService.getDB();
    this.loginDB = this.dbService.getLoginDB();
  }

  getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
      const users = new Set();
      const dbUsers = yield this.db.values().all();
      dbUsers.map((i) => {
        const userDTO = this.getUserDTO(i);
        users.add(userDTO);
      });
      return Array.from(users);
    });
  }

  createUser(login, password, roles) {
    return __awaiter(this, void 0, void 0, function* () {
      const userExists = yield this.getUserIdByLogin(login);
      if (userExists) {
        throw ApiError_1.default.BadRequest('User already exists');
      }
      const id = yield this.getId();
      const rounds = 2;
      const hashedPassword = yield bcrypt_1.default.hash(String(password), rounds);
      yield this.db.put(String(id), {
        id,
        login,
        password: hashedPassword,
        roles
      });
      yield this.loginDB.put(login, String(id));
      yield this.mainDB.put('user_db_increment', id);
    });
  }

  getId() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        return (yield this.mainDB.get('user_db_increment')) + 1;
      } catch (e) {
        if (e.status === 404) {
          return 1;
        }
        throw e;
      }
    });
  }

  getUserIdByLogin(login) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const userId = yield this.loginDB.get(login);
        return Number(userId);
      } catch (e) {
        if (e.status === 404) {
          return null;
        }
        throw e;
      }
    });
  }

  getUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.db.get(String(id));
    });
  }

  getUserByLogin(login) {
    return __awaiter(this, void 0, void 0, function* () {
      const id = yield this.getUserIdByLogin(login);
      if (!id) {
        return null;
      }
      return yield this.getUserById(id);
    });
  }

  getUserDTO(user) {
    return {
      id: user.id,
      login: user.login,
      roles: user.roles
    };
  }

  deleteUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield this.getUserById(id);
      const login = user.login;
      yield this.db.del(String(id));
      yield this.loginDB.del(login);
    });
  }

  checkCredentials(user, password) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield bcrypt_1.default.compare(password, user.password);
    });
  }

  login(login, password) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield this.getUserByLogin(login);
      if (!user) {
        throw ApiError_1.default.BadRequest('Incorrect login');
      }
      const passwordCorrect = yield this.checkCredentials(user, password);
      if (!passwordCorrect) {
        throw ApiError_1.default.BadRequest('Incorrect password');
      }
      const userDTO = this.getUserDTO(user);
      const tokenService = new TokenService_1.default();
      const tokens = tokenService.generateTokens(userDTO);
      yield tokenService.saveToken(tokens.refreshToken, userDTO.id);
      return Object.assign(Object.assign({}, userDTO), tokens);
    });
  }

  logout(token) {
    return __awaiter(this, void 0, void 0, function* () {
      const tokenService = new TokenService_1.default();
      yield tokenService.revokeToken(token);
    });
  }

  refresh(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!refreshToken) {
        throw ApiError_1.default.UnauthorizedError();
      }
      const tokenService = new TokenService_1.default();
      const data = tokenService.validateRefreshToken(refreshToken);
      const tokenInDB = yield tokenService.checkRefreshInDB(refreshToken);
      if (!data || !tokenInDB) {
        throw ApiError_1.default.UnauthorizedError();
      }
      const user = yield this.getUserById(data.id);
      const userDTO = this.getUserDTO(user);
      const tokens = tokenService.generateTokens(userDTO);
      yield tokenService.revokeToken(refreshToken);
      yield tokenService.saveToken(tokens.refreshToken, userDTO.id);
      return Object.assign(Object.assign({}, userDTO), tokens);
    });
  }
}

exports.default = UserService;
//# sourceMappingURL=UserService.js.map
