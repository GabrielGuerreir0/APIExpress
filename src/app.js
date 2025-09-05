const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const publicRoutes = require("./routes/public");
const adminArticles = require("./routes/admin.articles");
const authRoutes = require("./routes/auth");
require("./jobs/scheduler");

const app = express();

// --- Middlewares ---
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(rateLimit({ windowMs: 60_000, max: 100 }));
app.use(express.json());

// --- Swagger ---
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Portal de Artigos",
      version: "1.0.0",
      description: "Documentação da API",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // ← aqui ele vai ler os comentários JSDoc
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

console.log("Swagger UI disponível em /api-docs");

// --- Rotas ---
app.use("/api", publicRoutes);
app.use("/api", authRoutes);
app.use("/api/admin", adminArticles);

module.exports = app;
