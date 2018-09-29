import { ofType, combineEpics } from 'redux-observable';
import { map } from 'rxjs/operators';

import * as EventTypes from 'shared/eventTypes';
import * as UIActions from 'modules/ui/actions';
import { IframeViews } from 'modules/ui/constants';


const startAuthFlowEpic = action$ => action$.pipe(
  ofType(EventTypes.START_AUTH_FLOW),
  map(({ payload }) => UIActions.setViewAndType({ view: IframeViews.AUTH_MODAL, type: payload }))
)

export default combineEpics(
  startAuthFlowEpic,
)