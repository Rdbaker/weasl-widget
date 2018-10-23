const COOKIE_NAME = 'WEASL_AUTH';


export const expireToken = (clientId) => {
  document.cookie = `${COOKIE_NAME}-${clientId}=;expires=${(new Date()).toUTCString()};`;
};

export const isMobile = () => window.innerWidth < 600;
export const isTablet = () => window.innerWidth > 600 && window.innerWidth < 768;
export const isDesktop = () => window.innerWidth > 768;
export const isPortraitMode = () => window.innerHeight > window.innerWidth;

export const allowedAttrTypes = ['STRING', 'NUMBER', 'BOOLEAN', 'JSON']