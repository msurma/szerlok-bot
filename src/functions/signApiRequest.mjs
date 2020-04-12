import md5 from 'md5';
import getEnv from './getEnv.mjs';

/**
 * @param {string} url
 * @param {Object} postData
 * @returns {string}
 */
export default function (url, postData = undefined) {
  let postValues = '';
  if (postData !== undefined) {
    postValues = Object.values(Object.fromEntries(Object.entries(postData).sort()));
    postValues = postValues.join(',');
  }

  return md5(getEnv('API_SECRET') + url + postValues);
}
