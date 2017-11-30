import fetch from 'dva/fetch';
import {notification} from 'antd';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  // 200以外的状态处理
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: response.statusText,
  });
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
function xhrRequest({ url, method = 'POST', contentType = 'application/json', limit = 20, page = 1, uid = '', params = {} }) {
  return new Promise(function (resolve,reject) {
    if (!url) {
      return;
    }
    let allParams = {};
    if (method === 'post' || method === 'POST') {
      allParams = {
        data: params,
        limit: limit,
        page: page,
        uid: uid,
      };
    }

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (e) => {
      if (xhr.readyState !== 4) {
        return;
      }
      resolve(xhr);
      if (xhr.status === 200) {
        // success(JSON.parse(xhr.responseText));
      } else {
        // alert(xhr._response)
      }
    };
    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.send(JSON.stringify(allParams));
  });
}

const host = 'http://test.gdyunst.com:8084';
export default function request(link, options) {
  const url = host + link;
  return xhrRequest({ url: url, ...options })
    .then(checkStatus)
    .then(response => JSON.parse(response.responseText))
    .catch((error) => {
      if (error.code) {
        notification.error({
          message: error.name,
          description: error.message,
        });
      }
      if ('stack' in error && 'message' in error) {
        notification.error({
          message: `请求错误: ${url}`,
          description: error.message,
        });
      }
      return error;
    });
}

/*
export default function request(link, options) {
  let url = host + link;
  const defaultOptions = {
    credentials: 'include',
    method: 'POST',
    mode: 'cors',
    body: {
      data: {},
      limit: 1000000,
      page: 1,
      uid: '',
    },
  };
  const newOptions = {...defaultOptions, ...options};
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.body.data = options.params;
    newOptions.body = JSON.stringify(newOptions.body);
  } else {
    url += '?t=' + new Date().getTime();
    for (let i = 0, len = options.params.length; i < len; i++) {
      url += '&' + i + '=' + options.params[i];
    }
  }
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => response.json())
    .catch((error) => {
      if (error.code) {
        notification.error({
          message: error.name,
          description: error.message,
        });
      }
      if ('stack' in error && 'message' in error) {
        notification.error({
          message: `请求错误: ${url}`,
          description: error.message,
        });
      }
      return error;
    });
}
*/
