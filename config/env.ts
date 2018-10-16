import paths from './paths';
import { IAppConfig } from './webpack';

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
  throw new Error(
    'The NODE_ENV environment variable is required but was not specified.'
  );
}

export const getEnv = (isServer: boolean, options: IAppConfig) => {
  const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || options.port || '3000',
    HOST: process.env.HOST || options.host || 'localhost',
    BUILD_TARGET: isServer ? 'server' : 'client',
    CLIENT_PUBLIC_PATH: process.env.CLIENT_PUBLIC_PATH,
    APP_PUBLIC_DIR:
      process.env.NODE_ENV === 'production'
        ? paths.appBuildPublic
        : paths.appPublic,
  };
  process.env = {
    ...process.env,
    ...env
  };
  return env;
};
