import { ofType, combineEpics } from 'redux-observable';
import { flatMap, startWith, catchError } from 'rxjs/operators';
import { of, from } from 'rxjs';

import { AuthAPI } from 'api/auth.js';
import { ActionTypes } from 'modules/auth/constants';
import * as UIActions from 'modules/ui/actions';
import * as AuthActions from 'modules/auth/actions';
import { setToken, finishFlow } from 'utils/auth.js';
import *  as SharedEventTypes from 'shared/eventTypes';
import { IframeViews } from 'modules/ui/constants';
import { INFO_MSG_CLASSNAME } from 'shared/iframeClasses';


const fetchVerifySmsTokenEpic = action$ => action$.pipe(
  ofType(ActionTypes.fetchVerifySMSToken),
  flatMap(({ token }) =>
    from(AuthAPI.sendVerifySMS(token))
      .pipe(
        flatMap((response) => from(response.json())),
        flatMap(({ JWT }) => {
          if (!JWT) {
            throw arguments[0];
          } else {
            setToken(JWT);
            finishFlow();
          }
          return of(AuthActions.fetchVerifySMSTokenSuccess());
        }),
        catchError(err => of(AuthActions.fetchVerifySMSTokenFailed(err))),
        startWith(AuthActions.fetchVerifySMSTokenPending()),
      )
  )
)


const verifyEmailToken = action$ => action$.pipe(
  ofType(SharedEventTypes.VERIFY_EMAIL_TOKEN),
  flatMap(({ payload }) =>
    from(AuthAPI.verifyEmailToken(payload))
      .pipe(
        flatMap((response) => from(response.json())),
        flatMap(({ JWT }) => {
          if (!JWT) {
            throw new Error("Unable to log in");
          } else {
            setToken(JWT);
            window.parent.postMessage({type: SharedEventTypes.VERIFY_EMAIL_TOKEN_SUCCESS}, '*');
            return ([
              UIActions.setViewAndType({ view: IframeViews.INFO_MSG, type: ActionTypes.fetchVerifyEmailTokenSuccess }),
              UIActions.changeContainerClass(INFO_MSG_CLASSNAME),
            ])
          }
        }),
        catchError(() => ([
          UIActions.setViewAndType({ view: IframeViews.INFO_MSG, type: ActionTypes.fetchVerifyEmailTokenFailed }),
          UIActions.changeContainerClass(INFO_MSG_CLASSNAME),
        ])),
      )
  )
)

export default combineEpics(
  fetchVerifySmsTokenEpic,
  verifyEmailToken,
)