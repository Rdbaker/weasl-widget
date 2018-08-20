import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

import * as EventTypes from 'shared/eventTypes';


export const startLoginFlowEpic = action$ => action$.pipe(
  ofType(EventTypes.START_LOGIN_FLOW),
  mergeMap(console.log)
)