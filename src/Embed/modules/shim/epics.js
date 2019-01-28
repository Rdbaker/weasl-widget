import { ofType, combineEpics } from 'redux-observable';
import { map, tap, ignoreElements, flatMap, catchError, mergeMap } from 'rxjs/operators';
import { of, from } from 'rxjs';

import { EndUserAPI } from 'api/endUser';
import * as AuthActions from 'modules/auth/actions';
import * as UIActions from 'modules/ui/actions';
import { IframeViews } from 'modules/ui/constants';
import * as OrgActions from 'modules/org/actions';
import { ActionTypes as OrgActionTypes } from 'modules/org/constants';
import { getAllowedDomains } from 'modules/org/selectors';
import * as ShimActions from 'modules/shim/actions';
import { ActionTypes as ShimActionTypes } from 'modules/shim/constants';
import *  as SharedEventTypes from 'shared/eventTypes';
import { makeDomainMatcher } from 'shared/helpers';
import { INFO_MSG_CLASSNAME } from 'shared/iframeClasses';


const startAuthFlowEpic = action$ => action$.pipe(
  ofType(SharedEventTypes.START_AUTH_FLOW),
  map(({ payload }) => UIActions.setViewAndType({ view: IframeViews.AUTH_MODAL, type: payload }))
);

const verifyDomain = (action$, state$) => action$.pipe(
  ofType(ShimActionTypes.verifyDomain),
  flatMap(({ payload }) => {
    return action$.pipe(
      ofType(OrgActionTypes.fetchPublicOrgSuccess),
      map(() => {
        const allowed = getAllowedDomains(state$.value).some(makeDomainMatcher(payload.host))
        if (!allowed) {
          window.parent.postMessage({type: SharedEventTypes.DOMAIN_NOT_ALLOWED }, '*');
        }
        return allowed ? ShimActions.verifyDomainSuccess() : ShimActions.verifyDomainFailed();
      }),
    )
  }),
)

const verifyDomainFailed = action$ => action$.pipe(
  ofType(ShimActionTypes.verifyDomainFailed),
  mergeMap(() => ([
    UIActions.setViewAndType({ view: IframeViews.INFO_MSG, type: ShimActionTypes.verifyDomainFailed }),
    UIActions.changeContainerClass(INFO_MSG_CLASSNAME),
  ])),
)

const startWidgetBootstrap = (action$) => action$.pipe(
  ofType(SharedEventTypes.INIT_IFRAME),
  mergeMap(({ payload }) => {
    global.clientId = payload.clientId;
    return [
      OrgActions.fetchPublicOrg({ clientId: payload.clientId }),
      // TODO: uncomment once the app side is done
      // ShimActions.verifyDomain({ host: payload.topHost }),
    ];
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
  verifyDomain,
  verifyDomainFailed,
)