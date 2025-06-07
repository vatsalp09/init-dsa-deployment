const options = {
  openapi: "OpenAPI 3",
  language: "en-US",
  disableLogs: false,
  autoHeaders: false,
  autoQuery: false,
  autoBody: false,
};
import generateSwagger from "swagger-autogen";

const swaggerFile= "./docs/swagger.json";
const apiRouteFile= ["./index.js"];
generateSwagger(swaggerFile, apiRouteFile);