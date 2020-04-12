import getEnv from './getEnv.mjs';
import doApiRequest from './doApiRequest.mjs';

export default async () => {
  const userResponse = await doApiRequest('/Login/Index', {
    accountkey: getEnv('ACCOUNT_KEY'),
    login: getEnv('ACCOUNT_LOGIN'),
  });

  return userResponse.data.data.userkey;
};
