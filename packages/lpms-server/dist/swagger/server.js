'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const morgan_1 = __importDefault(require('morgan'));
const swagger_ui_express_1 = __importDefault(require('swagger-ui-express'));
const swagger_jsdoc_1 = __importDefault(require('swagger-jsdoc'));
const swagger_options_1 = require('./swagger-options');
const router_1 = __importDefault(require('../src/router'));
const PORT = process.env.SWAGGER_PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)('tiny'));
app.use(express_1.default.static('public'));
const specs = (0, swagger_jsdoc_1.default)(swagger_options_1.options);
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
app.use(router_1.default);
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
//# sourceMappingURL=server.js.map
