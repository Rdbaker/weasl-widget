import { ofType, combineEpics } from 'redux-observable';
import { mapTo } from 'rxjs/operators';

import * as EventTypes from 'shared/eventTypes';
import * as UIActions from 'modules/ui/actions';
import { IframeViews } from 'modules/ui/constants';


const startLoginFlowEpic = action$ => action$.pipe(
  ofType(EventTypes.START_LOGIN_FLOW),
  mapTo(UIActions.setView({ view: IframeViews.AUTH_MODAL }))
)

export default combineEpics(
  startLoginFlowEpic,
)