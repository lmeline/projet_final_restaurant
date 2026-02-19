const path = require("path");
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Restaurant",
      version: "1.0.0",
      description: "Endpoints de l'API restaurant",
    },
    components: {
      schemas: {
        Menu: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            name: {
              type: "string",
            },
            price: {
              type: "number",
            },
            category: {
              type: "string",
              example: "entree",
            },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, "../http/routes/*.js")],
};

module.exports = swaggerJSDoc(options);
