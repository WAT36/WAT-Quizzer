import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

export const getApiKey = async () => {
  if (process.env.NEXT_PUBLIC_API_KEY_VALUE) {
    return process.env.NEXT_PUBLIC_API_KEY_VALUE || '';
  }

  try {
    console.log('start teset');
    const client = new SecretsManagerClient({
      region: process.env.NEXT_PUBLIC_REGION || ''
    });
    console.log(`client:${JSON.stringify(client)}`);
    const params = {
      SecretId: process.env.NEXT_PUBLIC_API_KEY || ''
    };
    const command = new GetSecretValueCommand(params);
    console.log(`command:${JSON.stringify(command)}`);
    const response = await client.send(command);
    console.log(`response:${JSON.stringify(response)}`);
    return response.SecretString ? (JSON.parse(response.SecretString).API_KEY as string) : '';
  } catch (err) {
    console.log(`NEXT_PUBLIC_REGION:${process.env.NEXT_PUBLIC_REGION}`);
    console.error(`getApiKey:${err}`);
    return JSON.stringify({ err }, null, 2);
  }
};
