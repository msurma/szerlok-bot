import doApiRequest from './doApiRequest.mjs';
import getUserKey from './getUserKey.mjs';

export default async (message) => {
  const userKey = await getUserKey();
  const response = await doApiRequest(`/Entries/Add/userkey/${userKey}`, {
    body: message,
  });

  return response.data;
};
