'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
exports.refreshTokenKey = exports.accessTokenKey = exports.port = void 0;
const dotenv_1 = __importDefault(require('dotenv'));
dotenv_1.default.config();
const checkEnvVariables = (vars) => vars.forEach(variable => {
  if (!process.env[variable] ||
    process.env[variable] === '') {
    throw new Error(`${variable} must be provided in the ENV`);
  }
});
checkEnvVariables([
  'APP_PORT',
  'APP_ACCESS_TOKEN_KEY',
  'APP_REFRESH_TOKEN_KEY',
]);
exports.port = Number(process.env.APP_PORT);
exports.accessTokenKey = String(process.env.APP_ACCESS_TOKEN_KEY);
exports.refreshTokenKey = String(process.env.APP_REFRESH_TOKEN_KEY);
//# sourceMappingURL=config.js.map
