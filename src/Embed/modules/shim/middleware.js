import *  as SharedEventTypes from 'shared/eventTypes';


const postMessageEventTypes = [
  SharedEventTypes.FETCH_CURRENT_USER_SUCCESS,
  SharedEventTypes.FETCH_CURRENT_USER_FAILED,
  SharedEventTypes.BOOTSTRAP_DONE,
  SharedEventTypes.VERIFY_EMAIL_TOKEN_SUCCESS,
  SharedEventTypes.DOMAIN_NOT_ALLOWED,
  SharedEventTypes.CHANGE_CONTAINER_CLASS,
];


const maybeCoercePayload = payload => {
  if (payload instanceof Error) {
    return String(payload);
  }

  return payload;
}


const postMessageToParent = ({
  type,
  payload,
}) => {
  const value = maybeCoercePayload(payload);
  window.parent.postMessage({type, value}, '*');
}


const postMessageMiddleware = () => next => action => {
  const shouldPostMessage = postMessageEventTypes.indexOf(action.type) !== -1;

  if (shouldPostMessage) {
    postMessageToParent(action);
  }

  next(action);
};


export default postMessageMiddleware;