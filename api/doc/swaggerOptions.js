const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Restaurant',
      version: '1.0.0',
      description: 'Endpoints de l\'API restaurant',
    },
  },
  apis: [path.join(__dirname, '../http/routes/*.js')],
};

module.exports = swaggerJSDoc(options);
