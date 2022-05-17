'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.options = void 0;
exports.options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'API',
      version: '1.0.0',
      description: '',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }],
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'local server'
      },
    ],
  },
  apis: ['./src/router/*.ts'],
};
//# sourceMappingURL=swagger-options.js.map
