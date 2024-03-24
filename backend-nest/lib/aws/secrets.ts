import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

export const getDbUrl = async () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  try {
    const client = new SecretsManagerClient({
      region: process.env.REGION,
    });

    const params = {
      SecretId: process.env.DB_URL_ID,
    };
    const command = new GetSecretValueCommand(params);
    const response = await client.send(command);
    return JSON.parse(response.SecretString).DATABASE_URL;
  } catch (err) {
    console.log(err);
    return JSON.stringify({ err }, null, 2);
  }
};

export const gerPostgreDbClient = async () => {
  if (
    process.env.POSTGRE_DBUSER &&
    process.env.POSTGRE_DBHOST &&
    process.env.POSTGRE_DBNAME &&
    process.env.POSTGRE_DBPASSWORD &&
    process.env.POSTGRE_DBPORT
  ) {
    return {
      user: process.env.POSTGRE_DBUSER,
      host: process.env.POSTGRE_DBHOST,
      database: process.env.POSTGRE_DBNAME,
      password: process.env.POSTGRE_DBPASSWORD,
      port: +process.env.POSTGRE_DBPORT,
    };
  }

  try {
    const client = new SecretsManagerClient({
      region: process.env.REGION,
    });

    const params = {
      SecretId: process.env.DB_URL_ID,
    };
    const command = new GetSecretValueCommand(params);
    const response = await client.send(command);
    const dbJson = JSON.parse(response.SecretString);
    return {
      user: dbJson.POSTGRE_DBUSER,
      host: dbJson.POSTGRE_DBHOST,
      database: dbJson.POSTGRE_DBNAME,
      password: dbJson.POSTGRE_DBPASSWORD,
      port: +dbJson.POSTGRE_DBPORT,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
