const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Support Ticket System API',
      version: '1.0.0',
      description: 'API documentation for the Support Ticket System',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            id: {
              type: 'string',
              description: 'The auto-generated id of the user',
            },
            name: {
              type: 'string',
              description: 'The name of the user',
            },
            email: {
              type: 'string',
              description: 'The email of the user',
            },
            password: {
              type: 'string',
              description: 'The password of the user',
            },
            role: {
              type: 'string',
              description: 'The role of the user',
              enum: ['customer', 'support', 'admin'],
            },
          },
        },
        Ticket: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            id: {
              type: 'string',
              description: 'The auto-generated id of the ticket',
            },
            title: {
              type: 'string',
              description: 'The title of the ticket',
            },
            description: {
              type: 'string',
              description: 'The description of the ticket',
            },
            status: {
              type: 'string',
              description: 'The status of the ticket',
              enum: ['open', 'in_progress', 'closed'],
            },
            assignedTo: {
              type: 'string',
              description: 'The user assigned to the ticket',
            },
            createdBy: {
              type: 'string',
              description: 'The user who created the ticket',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time when the ticket was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time when the ticket was last updated',
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = app => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
