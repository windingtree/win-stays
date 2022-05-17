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
Object.defineProperty(exports, '__esModule', { value: true });
const level_1 = require('level');

class DBService {
  constructor() {
    if (DBService._instance) {
      throw new Error('Error: Instantiation failed: Use DBService.getInstance() instead of new.');
    }
    DBService._instance = this;
    this.db = new level_1.Level('./database', { valueEncoding: 'json', createIfMissing: true, errorIfExists: false });
    this.userDB = this.db.sublevel('User', { valueEncoding: 'json' });
    this.loginDB = this.db.sublevel('Login', { valueEncoding: 'json' });
    this.tokenDB = this.db.sublevel('Token', { valueEncoding: 'json' });
  }

  static getInstance() {
    return DBService._instance;
  }

  open() {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.db.open();
    });
  }

  close() {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.db.close();
    });
  }

  getUserDB() {
    return this.userDB;
  }

  getLoginDB() {
    return this.loginDB;
  }

  getTokenDB() {
    return this.tokenDB;
  }

  getDB() {
    return this.db;
  }
}

exports.default = DBService;
DBService._instance = new DBService();
//# sourceMappingURL=DBService.js.map
