import { getApiKey } from '../../lib/aws/secrets';

export const baseURL: string = process.env.NEXT_PUBLIC_API_SERVER || '';

export const get = async (path: string, func: any, queryParam?: { [key: string]: string }) => {
  const key = await getApiKey();
  const query = queryParam ? `?${new URLSearchParams(queryParam)}` : '';

  await fetch(baseURL + path + query, {
    method: 'GET',
    headers: {
      'x-api-key': key
    }
  })
    .then((response) =>
      response.json().then((data) => ({
        status: response.status,
        body: data
      }))
    )
    .then(func)
    .catch((error) => {
      console.error(`GET(${path}): ${error}`);
    });
};

export const getApiAndGetValue = async (path: string, queryParam?: { [key: string]: string }) => {
  const key = await getApiKey();
  const query = queryParam ? `?${new URLSearchParams(queryParam)}` : '';

  return await fetch(baseURL + path + query, {
    method: 'GET',
    headers: {
      'x-api-key': key
    }
  });
};

export const post = async (path: string, jsondata: object, func: any) => {
  const key = await getApiKey();
  await fetch(baseURL + path, {
    method: 'POST',
    body: JSON.stringify(jsondata),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key
    }
  })
    .then((response) =>
      response.json().then((data) => ({
        status: response.status,
        body: data
      }))
    )
    .then(func)
    .catch((error) => {
      console.error(`GET(${path}): ${error}`);
    });
};

export const put = async (path: string, jsondata: object, func: any) => {
  const key = await getApiKey();
  await fetch(baseURL + path, {
    method: 'PUT',
    body: JSON.stringify(jsondata),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key
    }
  })
    .then((response) =>
      response.json().then((data) => ({
        status: response.status,
        body: data
      }))
    )
    .then(func)
    .catch((error) => {
      console.error(`GET(${path}): ${error}`);
    });
};

export const del = async (path: string, jsondata: object, func: any) => {
  const key = await getApiKey();
  await fetch(baseURL + path, {
    method: 'DELETE',
    body: JSON.stringify(jsondata),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key
    }
  })
    .then((response) =>
      response.json().then((data) => ({
        status: response.status,
        body: data
      }))
    )
    .then(func)
    .catch((error) => {
      console.error(`GET(${path}): ${error}`);
    });
};
