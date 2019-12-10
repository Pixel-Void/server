import 'reflect-metadata';
import { useContainer } from 'typeorm';

import server from './server';
import Container from 'typedi';

useContainer(Container);
const app = Container.get(server);
app.bootstrap();
