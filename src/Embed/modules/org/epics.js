import { ofType, combineEpics } from 'redux-observable';
import { flatMap, startWith, catchError } from 'rxjs/operators';
import { of, from } from 'rxjs';

import { OrgAPI } from 'api/org';
import * as OrgActions from 'modules/org/actions';
import { ActionTypes } from './constants';


const fetchPublicOrg = action$ => action$.pipe(
  ofType(ActionTypes.fetchPublicOrg),
  flatMap(() =>
    from(OrgAPI.getPublicOrg())
      .pipe(
        flatMap((response) => from(response.json())),
        flatMap(({ data }) => of(OrgActions.fetchPublicOrgSuccess(data))),
        catchError(err => of(OrgActions.fetchPublicOrgFailed(err))),
        startWith(OrgActions.fetchPublicOrgPending()),
      )
  )
)


export default combineEpics(
  fetchPublicOrg,
)