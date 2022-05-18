import express, { Application } from "express";
import morgan from "morgan";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { options } from "./swagger-options";

import Router from "../src/router";

const PORT = process.env.SWAGGER_PORT || 3000;

const app: Application = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));

const specs = swaggerJsDoc(options);

app.use(
  "/docs",
  swaggerUI.serve,
  swaggerUI.setup(specs)
);

app.use(Router);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
