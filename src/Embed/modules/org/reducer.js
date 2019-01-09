import { merge, groupBy, map, prop, indexBy } from 'ramda';

import { ActionTypes } from 'modules/org/constants';

const OrgPropertyNamespaces = {
  'OrgPropertyNamespaces.THEME': 'theme',
  'OrgPropertyNamespaces.GATES': 'gates',
  'OrgPropertyNamespaces.SETTINGS': 'settings',
  'OrgPropertyNamespaces.INTEGRATIONS': 'integrations',
}


const defaultState = {
  org: {
    data: undefined,
    status: undefined,
  },
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case ActionTypes.fetchPublicOrgSuccess:
      const org = action.payload;
      const { properties, ...rest } = org;
      const groupedAndIndexedProperties = map(
        (namespacedProperties) => map(
          property => property.value,
          indexBy(
            prop('name'),
            map(
              property => ({ name: property.name, value: property.value }),
              namespacedProperties
            )
          ),
        ),
        groupBy((prop) => OrgPropertyNamespaces[prop.namespace], org.properties)
      )
      return merge(state,
        {
          ...groupedAndIndexedProperties,
          ...rest,
        }
      );
    default:
      return state;
  }
}