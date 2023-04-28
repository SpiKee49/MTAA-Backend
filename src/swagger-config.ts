import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'APIs',
      version: '1.0.0',
      description: 'API documentation',
    },
  },
  apis: ['./routes/*.routes.ts'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;