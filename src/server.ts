import express from 'express';
import http from 'http';
import path from 'path';

import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import { Container, Service } from 'typedi';

import jwt from 'express-jwt';

import Env from './config/Env';
import { AuthContext } from './auth/auth-context';
import { customAuthChecker } from './auth/auth-checker';
import Database from './database';

@Service()
class App {
  private server: http.Server;
  private app: express.Application;

  constructor(private readonly configService: Env, private readonly database: Database) {
    this.app = express();

    this.middlewares();
    this.apolloServer();

    this.server = new http.Server(this.app);
  }

  private middlewares() {
    this.app.use(
      '/graphql',
      jwt({
        secret: this.configService.get('JWT_SECRET'),
        credentialsRequired: false,
      }),
    );
    // @ts-ignore
    this.app.use((err, req, res, next) => {
      req.user = null;
      return next();
    });
  }

  private async apolloServer(): Promise<ApolloServer> {
    const schema = await buildSchema({
      resolvers: [
        path.resolve(__dirname, 'graphql', '**', '*-resolver.{js,ts}'),
      ],
      authChecker: customAuthChecker,
      container: Container,
    });

    const apollo = new ApolloServer({
      schema,
      context: ({ req }: any) => {
        const ctx: AuthContext = {
          ...req.user,
        };
        return ctx;
      },
      playground: this.configService.get('NODE_ENV') === 'development',
    });

    apollo.applyMiddleware({ app: this.app });

    return apollo;
  }

  public async bootstrap() {
    try {
      await this.database.connect();
      this.server.listen(this.configService.get('PORT'), () => {
        console.log(`Server running on port ${this.configService.get('PORT')}`);
      });
    } catch (error) {
      console.log('Failed to start server');
      console.error(error);
    }
  }
}

export default App;
