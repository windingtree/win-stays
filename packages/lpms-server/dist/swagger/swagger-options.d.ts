export declare const options: {
  definition: {
    openapi: string;
    info: {
      title: string;
      version: string;
      description: string;
    };
    components: {
      securitySchemes: {
        bearerAuth: {
          type: string;
          scheme: string;
          bearerFormat: string;
        };
      };
    };
    security: {
      bearerAuth: never[];
    }[];
    servers: {
      url: string;
      description: string;
    }[];
  };
  apis: string[];
};
