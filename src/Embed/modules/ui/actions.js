import { ActionTypes } from 'modules/ui/constants';
import * as SharedActionTypes from 'shared/eventTypes';

export const hideUI = () => ({
  type: ActionTypes.hideUI,
});

export const showUI = () => ({
  type: ActionTypes.showUI,
});

export const changeContainerClassDone = () => ({
  type: SharedActionTypes.CHANGE_CONTAINER_CLASS_DONE,
});

export const changeContainerClass = (classnames) => ({
  type: SharedActionTypes.CHANGE_CONTAINER_CLASS,
  classnames,
});

export const setView = ({ view }) => ({
  type: ActionTypes.setView,
  view,
});

export const setType = ({ type }) => ({
  type: ActionTypes.setType,
  viewType: type,
});

export const setViewAndType = ({ view, type }) => ({
  type: ActionTypes.setViewAndType,
  view,
  viewType: type,
});