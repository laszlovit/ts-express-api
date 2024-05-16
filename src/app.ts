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

const swaggerDefinition = yaml.load(path.resolve(__dirname, './swagger.yaml'));
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
