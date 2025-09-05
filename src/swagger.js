const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Portal de Artigos",
      version: "1.0.0",
      description: "Documentação da API",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: [
    "./src/routes/public.js",
    "./src/routes/admin.articles.js",
    "./src/routes/auth.js",
  ],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
