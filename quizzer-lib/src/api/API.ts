import { ApiResult, ProcessingApiReponse } from './'

export const baseURL: string = process.env.NEXT_PUBLIC_API_SERVER || ''

// TODO メソッドごとに分けてるけどまとめられないか？
export const get = async (
  path: string,
  func: (data: ProcessingApiReponse) => ApiResult,
  queryParam?: { [key: string]: string | number | boolean },
  bodyData?: object,
  needAuth?: boolean
) => {
  const query = queryParam
    ? `?${new URLSearchParams(
        Object.keys(queryParam).reduce(
          (after, key) =>
            queryParam[key] === undefined
              ? after
              : {
                  ...after,
                  [key]: String(queryParam[key])
                },
          {}
        )
      )}`
    : ''

  const result = await fetch(baseURL + path + query, {
    method: 'GET',
    body: bodyData ? JSON.stringify(bodyData) : null,
    ...(needAuth !== false && {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
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
        message: {
          message: String(error.message),
          messageColor: 'error',
          isDisplay: true
        }
      } as ApiResult
    })
  return result
}

export const getApiAndGetValue = async (
  path: string,
  queryParam?: { [key: string]: string }
) => {
  const accessToken = localStorage.getItem('accessToken')
  const query = queryParam ? `?${new URLSearchParams(queryParam)}` : ''

  return await fetch(baseURL + path + query, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
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
  func: (data: ProcessingApiReponse) => ApiResult,
  needAuth?: boolean
) => {
  return await fetch(baseURL + path, {
    method: 'POST',
    body: JSON.stringify(jsondata),
    headers: {
      'Content-Type': 'application/json',
      ...(needAuth !== false && {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      })
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
        message: {
          message: String(error.message),
          messageColor: 'error',
          isDisplay: true
        }
      } as ApiResult
    })
}

export const put = async (
  path: string,
  jsondata: object,
  func: (data: ProcessingApiReponse) => ApiResult
) => {
  const accessToken = localStorage.getItem('accessToken')
  return await fetch(baseURL + path, {
    method: 'PUT',
    body: JSON.stringify(jsondata),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
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
        message: {
          message: String(error.message),
          messageColor: 'error',
          isDisplay: true
        }
      } as ApiResult
    })
}

export const del = async (
  path: string,
  jsondata: object,
  func: (data: ProcessingApiReponse) => ApiResult
) => {
  const accessToken = localStorage.getItem('accessToken')
  return await fetch(baseURL + path, {
    method: 'DELETE',
    body: JSON.stringify(jsondata),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
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
        message: {
          message: String(error.message),
          messageColor: 'error',
          isDisplay: true
        }
      } as ApiResult
    })
}

export const patch = async (
  path: string,
  jsondata: object,
  func: (data: ProcessingApiReponse) => ApiResult
) => {
  const accessToken = localStorage.getItem('accessToken')
  return await fetch(baseURL + path, {
    method: 'PATCH',
    body: JSON.stringify(jsondata),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
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
        message: {
          message: String(error.message),
          messageColor: 'error',
          isDisplay: true
        }
      } as ApiResult
    })
}

// ファイルを送りたい時
export const fileUploadAPI = async (
  path: string,
  file: File,
  func: (data: ProcessingApiReponse) => ApiResult,
  needAuth?: boolean
) => {
  const formData = new FormData()
  formData.append('file', file)
  return await fetch(baseURL + path, {
    method: 'POST',
    body: formData,
    headers: {
      ...(needAuth !== false && {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      })
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
        message: {
          message: String(error.message),
          messageColor: 'error',
          isDisplay: true
        }
      } as ApiResult
    })
}
