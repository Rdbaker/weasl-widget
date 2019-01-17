import { ofType, combineEpics } from 'redux-observable';
import { map, tap, ignoreElements, flatMap, catchError } from 'rxjs/operators';
import { of, from } from 'rxjs';

import { EndUserAPI } from 'api/endUser.js';
import * as UIActions from 'modules/ui/actions';
import * as OrgActions from 'modules/org/actions';
import * as AuthActions from 'modules/auth/actions';
import { IframeViews } from 'modules/ui/constants';
import *  as SharedEventTypes from 'shared/eventTypes';


const startAuthFlowEpic = action$ => action$.pipe(
  ofType(SharedEventTypes.START_AUTH_FLOW),
  map(({ payload }) => UIActions.setViewAndType({ view: IframeViews.AUTH_MODAL, type: payload }))
);

const startWidgetBootstrap = (action$) => action$.pipe(
  ofType(SharedEventTypes.INIT_IFRAME),
  map(({ payload }) => {
    global.clientId = payload.clientId;
    return OrgActions.fetchPublicOrg({ clientId: payload.clientId });
  }),
);

const setEndUserAttribute = (action$) => action$.pipe(
  ofType(SharedEventTypes.SET_END_USER_ATTRIBUTE),
  tap(({ payload: { token, name, value, type = 'STRING' }}) => EndUserAPI.setAttribute(token, name, value, type)),
  ignoreElements(),
);


const getCurrentUser = action$ => action$.pipe(
  ofType(SharedEventTypes.GET_CURRENT_USER_VIA_JWT),
  flatMap(({ payload }) =>
    from(EndUserAPI.getMe(payload))
      .pipe(
        flatMap((response) => from(response.json())),
        flatMap(({ data }) => of(AuthActions.fetchCurrentUserSuccess(data))),
        catchError(err => of(AuthActions.fetchCurrentUserFailed(err))),
      )
  )
);

const getCurrentUserDone = action$ => action$.pipe(
  ofType(SharedEventTypes.FETCH_CURRENT_USER_SUCCESS, SharedEventTypes.FETCH_CURRENT_USER_FAILED),
  tap(({ type, payload }) => window.parent.postMessage({type, value: payload}, '*')),
  ignoreElements(),
);

export default combineEpics(
  startAuthFlowEpic,
  startWidgetBootstrap,
  setEndUserAttribute,
  getCurrentUser,
  getCurrentUserDone,
)