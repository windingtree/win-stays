export const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "API",
      version: "1.0.0",
      description: "",
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
        url: "http://localhost:5000/api",
        description: "local server"
      },
    ],
  },
  apis: ["./src/router/*.ts"],
};
