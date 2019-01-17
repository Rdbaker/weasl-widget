import { ActionTypes } from './constants';

export const fetchPublicOrg = (clientId) => ({
  type: ActionTypes.fetchPublicOrg,
  payload: { clientId },
})

export const fetchPublicOrgPending = () => ({
  type: ActionTypes.fetchPublicOrgPending,
})

export const fetchPublicOrgFailed = () => ({
  type: ActionTypes.fetchPublicOrgFailed,
})

export const fetchPublicOrgSuccess = (data) => ({
  type: ActionTypes.fetchPublicOrgSuccess,
  payload: data,
})
