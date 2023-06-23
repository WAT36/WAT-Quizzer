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
