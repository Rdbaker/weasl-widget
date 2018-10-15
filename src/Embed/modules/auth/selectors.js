import { ActionTypes } from './constants';


const authRoot = state => state.auth || {};

export const getLoggedInOnInitGuess = state => state.loggedInOnInitGuess;

const verifyToken = state => authRoot(state).verifyToken
const verifyTokenStatus = state => verifyToken(state).status
export const verifyTokenPending = state => verifyTokenStatus(state) === ActionTypes.fetchVerifySMSTokenPending;
export const verifyTokenSuccess = state => verifyTokenStatus(state) === ActionTypes.fetchVerifySMSTokenSuccess;
export const verifyTokenFailed = state => verifyTokenStatus(state) === ActionTypes.fetchVerifySMSTokenFailed;