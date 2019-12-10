import { Service } from 'typedi';
import path from 'path';
import { createConnection } from 'typeorm';

import Env from './config/Env';

@Service()
class Database {
  constructor(private readonly configService: Env) {}

  public async connect() {
    await createConnection({
      type: 'mongodb',
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_DATABASE'),
      authSource: 'admin',
      useUnifiedTopology: true,
      synchronize: true,
      entities: [path.resolve(__dirname, 'entity', '**', '*.{js,ts}')],
      migrations: [path.resolve(__dirname, 'migration', '**', '*.{js,ts}')],
      cli: {
          entitiesDir: path.resolve(__dirname, 'entity'),
          migrationsDir: path.resolve(__dirname, 'migration'),
      },
    });
  }
}

export default Database;
