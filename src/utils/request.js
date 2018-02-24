import fetch from 'dva/fetch';
import {notification} from 'antd';
import {routerRedux} from 'dva/router';
// import store from '../index';
// let store;
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '请求接口错误',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.responseURL}`,
    description: errortext,
  });
  // const error = new Error(errortext);
  // error.name = response.status;
  // error.response = response;
  // throw error;
}


// XMLHttpRequest
function xhrRequest({url, method = 'POST', contentType = 'application/json', limit = 20, page = 1, uid = '', params = {}}) {
  return new Promise((resolve) => {
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
    };
    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.send(JSON.stringify(allParams));
  } );
}

const host = 'https://www.gdyst.top:8088';
// const host = 'https://192.168.1.118:8088';
export default function request(link, options) {
  const url = host + link;
  return xhrRequest({ url: url, ...options })
    .then(checkStatus)
    .then(response => JSON.parse(response.responseText))
    .catch((error) => {
      return error;
    });
}
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
/*
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = {...defaultOptions, ...options};
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        ...newOptions.headers,
      };
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then((response) => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch((e) => {
      const {dispatch} = window.app_store;
      const status = e.name;
      if (status === 401) {
        dispatch({
          type: 'login/logout',
        });
        return;
      }
      if (status === 403) {
        dispatch(routerRedux.push('/exception/403'));
        return;
      }
      if (status <= 504 && status >= 500) {
        dispatch(routerRedux.push('/exception/500'));
        return;
      }
      if (status >= 404 && status < 422) {
        dispatch(routerRedux.push('/exception/404'));
      }
    });
}
*/
