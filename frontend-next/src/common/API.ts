import { ProcessingApiReponse } from '../../interfaces/api/response';
import { getApiKey } from '../../lib/aws/secrets';

export const baseURL: string = process.env.NEXT_PUBLIC_API_SERVER || '';

export const get = async (
  path: string,
  func: (data: ProcessingApiReponse) => any,
  queryParam?: { [key: string]: string }
) => {
  const key = await getApiKey();
  const query = queryParam ? `?${new URLSearchParams(queryParam)}` : '';

  const result = await fetch(baseURL + path + query, {
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
  return result;
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

export const post = async (path: string, jsondata: object, func: (data: ProcessingApiReponse) => void) => {
  const key = await getApiKey();
  await fetch(baseURL + path, {
    method: 'POST',
    body: JSON.stringify(jsondata),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key
    }
  })
    .catch((error) => {
      throw Error(error);
    })
    .then((response) =>
      response.json().then((data) => ({
        status: response.status,
        body: data
      }))
    )
    .then(func);
};

export const put = async (path: string, jsondata: object, func: (data: ProcessingApiReponse) => void) => {
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
      console.error(`PUT(${path}): ${error}`);
    });
};

export const del = async (path: string, jsondata: object, func: (data: ProcessingApiReponse) => void) => {
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
      console.error(`DELETE(${path}): ${error}`);
    });
};

export const patch = async (path: string, jsondata: object, func: (data: ProcessingApiReponse) => void) => {
  const key = await getApiKey();
  await fetch(baseURL + path, {
    method: 'PATCH',
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
      console.error(`PATCH(${path}): ${error}`);
    });
};
