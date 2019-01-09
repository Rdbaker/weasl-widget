const orgRoot = state => state.org || {};
const orgTheme = state => orgRoot(state).theme || {};

export const getOrgThemeValue = (state, property) => orgTheme(state)[property];