let accessTocken: string | null = null;

export const setStoredAccessToken = (token: string | null) => {
  accessTocken = token;
};

export const getStoredAccessToken = () => {
  return accessTocken;
};
