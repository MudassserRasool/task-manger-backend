import swaggerAutogen from 'swagger-autogen';
import { PORT } from '../constants/index.js';

const doc = {
  info: {
    title: 'API Documentation',
    description: 'User management API',
  },
  servers: [
    {
      url: `http://localhost:${PORT}/api`, // Define your base API URL here
      description: 'Local server',
    },
  ],
  host: `localhost:${PORT}`,
  schemes: ['http'],
};

const outputFile = './swagger-output.json';

const endpointsFiles = [
  './routes/user.js',
  './routes/profile.js',
  './routes/order.js',
];

// Generate Swagger documentation
swaggerAutogen()(outputFile, endpointsFiles, doc); // Pass the 'doc' object as the third parameter
