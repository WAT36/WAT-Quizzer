import { formatString, MESSAGES } from '../..'

export interface Message {
  message: string
  messageColor: string
  isDisplay?: boolean
}

export const successMessage = (
  message: string,
  ...params: string[]
): Message => {
  return {
    message: params.length > 0 ? formatString(message) : message,
    messageColor: 'success.light',
    isDisplay: true
  }
}

export const errorMessage = (message: string, ...params: string[]): Message => {
  return {
    message: params.length > 0 ? formatString(message) : message,
    messageColor: 'error',
    isDisplay: true
  }
}

export const defaultMessage = (
  message: string,
  ...params: string[]
): Message => {
  return {
    message: params.length > 0 ? formatString(message) : message,
    messageColor: 'common.black',
    isDisplay: message !== MESSAGES.DEFAULT.MSG00001
  }
}
