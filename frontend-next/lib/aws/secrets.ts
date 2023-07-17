import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

export const getApiKey = async () => {
  if (process.env.API_KEY_VALUE) {
    return process.env.API_KEY_VALUE;
  }

  try {
    const client = new SecretsManagerClient({
      region: process.env.REGION
    });

    const params = {
      SecretId: process.env.API_KEY
    };
    const command = new GetSecretValueCommand(params);
    const response = await client.send(command);
    return JSON.parse(response.SecretString || '').API_KEY;
  } catch (err) {
    console.log(err);
    return JSON.stringify({ err }, null, 2);
  }
};
