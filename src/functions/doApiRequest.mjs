import Axios from 'axios';
import qs from 'qs';
import { API_HOST } from '../consts/wykopApi.mjs';
import signApiRequest from './signApiRequest.mjs';
import getEnv from './getEnv.mjs';

export default async function (path, postData = undefined) {
  let requestPath = path;
  if (!path.startsWith('/')) {
    requestPath = `/${path}`;
  }

  requestPath = `${requestPath}/appkey/${getEnv('API_KEY')}`;

  const axiosOptions = {
    url: requestPath,
    method: 'get',
    headers: {
      apisign: signApiRequest(API_HOST + requestPath, postData),
    },
    responseType: 'json',
    baseURL: API_HOST,
  };

  if (postData !== undefined) {
    axiosOptions.method = 'post';
    axiosOptions.headers['content-type'] = 'application/x-www-form-urlencoded';
    axiosOptions.data = qs.stringify(postData);
  }

  return Axios.request(axiosOptions);
}
