const root = state => state.shim;

const getAllowedDomain = state => root(state).allowedDomain;
export const domainVerificationIsDone = state => getAllowedDomain(state) !== null;
export const domainVerificationFailed = state => !getAllowedDomain(state);