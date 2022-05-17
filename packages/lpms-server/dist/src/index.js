'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
const ServerService_1 = __importDefault(require('./services/ServerService'));
const config_1 = require('./config');
new ServerService_1.default(config_1.port).start();
//# sourceMappingURL=index.js.map
