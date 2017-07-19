import 'whatwg-fetch';
import qs from 'qs';

const isProd = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const isDev = process.env.NODE_ENV === 'dev';
const urlPrefix = isDev ? 'http://localhost:8989' : '';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (+response.status >= 200 && +response.status < 300) {
    return response;
  }

  if (+response.status === 404) {
    const error = new Error('404');
    error.response = response;
    return error;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "result" or "err"
 */
const request = (url, options) => {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(result => (result))
    .catch(err => (err));
};


export const get = (url, params) => {

  let newUrl = url.indexOf('.htm') > -1 ? url : `${url}.htm`;
  // 删除空值、undefind
  if (params) {
    delete params.type;
    Object.keys(params).map(v => params[v] || delete params[v]);
    const paramsForGet = (params && qs.stringify(params)) || '';
    newUrl = `${newUrl}?${paramsForGet}`;
  }
  return request(urlPrefix + newUrl, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  });
};

export const post = (url, params) => {
  const newUrl = url.indexOf('.htm') > -1 ? url : `${url}.htm`;
  // 删除空值、undefind
  if (params) {
    delete params.type;
    Object.keys(params).map(v => params[v] || delete params[v]);
  }
  return request(urlPrefix +newUrl, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      Accept: 'application/json',
    }),
    body: qs.stringify(params),
  });
};
