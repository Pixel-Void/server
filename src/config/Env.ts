import Joi from '@hapi/joi';
import dotenv from 'dotenv';
import fs from 'fs';
import { Service } from 'typedi';

export interface EnvConfig {
  [key: string]: any;
}

const env = {
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(27017),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
};

type EnvGet = keyof typeof env;
type NodeEnv = 'development' | 'production' | 'test';

@Service()
class EnvService {
  private readonly envConfig: EnvConfig;
  private readonly config: NodeJS.ProcessEnv;

  constructor() {
    this.config = this.getEnvConfig();
    this.envConfig = this.validateInput(this.config);
  }

  get(key: EnvGet): any {
    return this.envConfig[key];
  }

  public get getCloudinaryConfig() {
    return {
      cloud_name: this.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.get('CLOUDINARY_API_KEY'),
      api_secret: this.get('CLOUDINARY_API_SECRET'),
    };
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object(env);

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
      {
        allowUnknown: true,
      },
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  private envFile(envApp: NodeEnv) {
    return {
      development: '.env',
      production: '.env.production',
      test: '.env.test',
    }[envApp];
  }

  private getEnvConfig() {
    const usesDotEnv = fs.existsSync('.env');
    const envFile = this.envFile(process.env.NODE_ENV as NodeEnv || 'development');
    return usesDotEnv ? dotenv.parse(fs.readFileSync(envFile)) : process.env;
  }
}

export default EnvService;
