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
const express_1 = __importDefault(require('express'));
const cors_1 = __importDefault(require('cors'));
const cookie_parser_1 = __importDefault(require('cookie-parser'));
const index_1 = __importDefault(require('../router/index'));
const ErrorMiddleware_1 = __importDefault(require('../middlewares/ErrorMiddleware'));

class ServerService {
  constructor(port) {
    this.PORT = port;
    this.app = (0, express_1.default)();
    this.bootstrap();
  }

  bootstrap() {
    this.app.use(express_1.default.json());
    this.app.use((0, cookie_parser_1.default)());
    this.app.use((0, cors_1.default)({
      credentials: true,
      origin: process.env.CLIENT_URL
    }));
    this.app.use('/api', index_1.default);
    this.app.use(ErrorMiddleware_1.default);
  }

  get getApp() {
    return this.app;
  }

  start() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        this.server = yield this.app.listen(this.PORT, () => console.log(`Server started on PORT = ${this.PORT}`));
      } catch (e) {
        console.error(e);
      }
    });
  }
}

exports.default = ServerService;
//# sourceMappingURL=ServerService.js.map
