import 'reflect-metadata';
import * as express from 'express';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as helmet from 'helmet';
import * as dotenv from 'dotenv';
import * as swaggerUi from 'swagger-ui-express';
const swaggerDocument = require('../swagger.json');
import { MORGAN_FORMAT } from './utils/constants';
import { bgBlue } from 'chalk';
import { createConnection, ConnectionOptions } from 'typeorm';
import AuthMiddleware from './middlewares/auth';
import AccountMiddleware from './middlewares/account';
import TaskMiddleware from './middlewares/task';

dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const app = express();
const connectionOptions: ConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/entity/*.ts'],
    synchronize: true,
    logging: true,
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(morgan(MORGAN_FORMAT));
app.use(helmet());

createConnection(connectionOptions)
    .then((conn) => {
        console.log(bgBlue(`CONNECTION NAME: ${conn.name}`));
        app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        app.use('/api/account', AccountMiddleware());
        app.use('/api/task', AuthMiddleware, TaskMiddleware());
    })
    .catch((err) => console.log(err));

export default app;
