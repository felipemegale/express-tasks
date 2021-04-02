const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFiles = ['./src/app.ts'];

swaggerAutogen(outputFile, endpointsFiles);
