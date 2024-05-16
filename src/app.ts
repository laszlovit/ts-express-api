import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
const path = require('path');

require('dotenv').config();

import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';

const app = express();


app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

// Custom JavaScript URLs
const customJsUrls = [
  'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3/swagger-ui-bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3/swagger-ui-standalone-preset.min.js',
];

// Custom CSS URLs
const customCssUrls = [
  'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3/swagger-ui.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3/swagger-ui-standalone-preset.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3/swagger-ui.css',
];


const swaggerDefinition = yaml.load(path.resolve(__dirname, './swagger.yaml'));

// Pass customJs and customCssUrl options with the CDN URLs
const swaggerUiOptions = {
  customJs: customJsUrls,
  customCssUrl: customCssUrls,
};

app.use(
  '/api/v1/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDefinition, swaggerUiOptions),
);


app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
