const orgRoot = state => state.org || {};
const orgTheme = state => orgRoot(state).theme || {};
const orgGates = state => orgRoot(state).gates || {};
const orgSettings = state => orgRoot(state).settings || {};

const getOrgThemeValue = (state, property) => orgTheme(state)[property];
export const getSmsLoginDisabled = (state) => getOrgThemeValue(state, 'sms_login_disabled') || false;
export const getGoogleLoginEnabled = (state) => getOrgThemeValue(state, 'google_login_enabled') || false;

const getOrgGate = (state, gateName) => orgGates(state)[gateName] || false;
export const getHasSocialLogin = state => getOrgGate(state, 'has_social_login');

const getOrgSetting = (state, settingName) => orgSettings(state)[settingName];
export const getGoogleClientId = (state) => getOrgSetting(state, 'google_client_id');