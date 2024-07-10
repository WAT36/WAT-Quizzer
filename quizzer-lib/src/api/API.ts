import { ProcessingApiReponse } from '../interfaces'
import { getApiKey } from '../../lib/aws/secrets'
import { Message } from '../common/message'

export const baseURL: string = process.env.NEXT_PUBLIC_API_SERVER || ''

// TODO メソッドごとに分けてるけどまとめられないか？
// TODO getAPIKeyは削除する
export const get = async (
  path: string,
  func: (data: ProcessingApiReponse) => any,
  queryParam?: { [key: string]: string },
  bodyData?: object,
  accessToken?: string
) => {
  const key = await getApiKey()
  const query = queryParam ? `?${new URLSearchParams(queryParam)}` : ''

  const result = await fetch(baseURL + path + query, {
    method: 'GET',
    body: bodyData ? JSON.stringify(bodyData) : null,
    headers: {
      // ...(process.env.NEXT_PUBLIC_APP_ENV === 'local' && {
      //   Authorization: 'Bearer ' + (accessToken || localStorage.getItem('apiAccessToken'))
      // })
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
      console.error(`GET(${path}): ${error}`)
    })
  return result
}

export const getApiAndGetValue = async (
  path: string,
  queryParam?: { [key: string]: string },
  accessToken?: string
) => {
  const key = await getApiKey()
  const query = queryParam ? `?${new URLSearchParams(queryParam)}` : ''

  return await fetch(baseURL + path + query, {
    method: 'GET',
    headers: {
      'x-api-key': key
      // ...(process.env.NEXT_PUBLIC_APP_ENV === 'local' && {
      //   Authorization: 'Bearer ' + (accessToken || localStorage.getItem('apiAccessToken'))
      // })
    }
  })
    .catch((error) => {
      console.error('API Error1.')
      throw Error(error)
    })
    .then((response) => response.json())
}

export const post = async (
  path: string,
  jsondata: object,
  func: (data: ProcessingApiReponse) => Message,
  accessToken?: string
) => {
  const key = await getApiKey()
  return await fetch(baseURL + path, {
    method: 'POST',
    body: JSON.stringify(jsondata),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key
      // ...(process.env.NEXT_PUBLIC_APP_ENV === 'local' && {
      //   Authorization: 'Bearer ' + (sessionStorage.getItem('apiAccessToken') || localStorage.getItem('apiAccessToken'))
      // })
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
      return {
        message: error.message,
        messageColor: 'error',
        isDisplay: true
      } as Message
    })
}

export const put = async (
  path: string,
  jsondata: object,
  func: (data: ProcessingApiReponse) => void,
  accessToken?: string
) => {
  const key = await getApiKey()
  await fetch(baseURL + path, {
    method: 'PUT',
    body: JSON.stringify(jsondata),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key
      // ...(process.env.NEXT_PUBLIC_APP_ENV === 'local' && {
      //   Authorization: 'Bearer ' + (sessionStorage.getItem('apiAccessToken') || localStorage.getItem('apiAccessToken'))
      // })
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
      console.error(`PUT(${path}): ${error}`)
    })
}

export const del = async (
  path: string,
  jsondata: object,
  func: (data: ProcessingApiReponse) => void,
  accessToken?: string
) => {
  const key = await getApiKey()
  await fetch(baseURL + path, {
    method: 'DELETE',
    body: JSON.stringify(jsondata),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key
      // ...(process.env.NEXT_PUBLIC_APP_ENV === 'local' && {
      //   Authorization: 'Bearer ' + (sessionStorage.getItem('apiAccessToken') || localStorage.getItem('apiAccessToken'))
      // })
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
      console.error(`DELETE(${path}): ${error}`)
    })
}

export const patch = async (
  path: string,
  jsondata: object,
  func: (data: ProcessingApiReponse) => void,
  accessToken?: string
) => {
  const key = await getApiKey()
  await fetch(baseURL + path, {
    method: 'PATCH',
    body: JSON.stringify(jsondata),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key
      // ...(process.env.NEXT_PUBLIC_APP_ENV === 'local' && {
      //   Authorization: 'Bearer ' + (sessionStorage.getItem('apiAccessToken') || localStorage.getItem('apiAccessToken'))
      // })
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
      console.error(`PATCH(${path}): ${error}`)
    })
}
