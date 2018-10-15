import { ofType, combineEpics } from 'redux-observable';
import { flatMap, map, startWith, catchError } from 'rxjs/operators';
import { of, from } from 'rxjs';

import { AuthAPI } from 'api/auth.js';
import { ActionTypes } from 'modules/auth/constants';
import * as AuthActions from 'modules/auth/actions';
import { setToken, finishFlow } from 'utils/auth.js';

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

export default combineEpics(
  fetchVerifySmsTokenEpic,
)