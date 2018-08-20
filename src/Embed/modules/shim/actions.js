import { ActionTypes } from './constants'

export const createShimEvent = (type, payload) => ({
  type,
  payload,
})

export const setCookie = (payload) => ({
  type: ActionTypes.setCookie,
  payload,
})

export const startLoginFlow = (payload) => ({
  type: ActionTypes.startLoginFlow,
  payload,
})

export const startRegisterFlow = (payload) => ({
  type: ActionTypes.startRegisterFlow,
  payload,
})