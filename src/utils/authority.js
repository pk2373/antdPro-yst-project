// use localStorage to store the authority info, which might be sent from server in actual project.
import {staticFn} from './utils';

const projectKey = staticFn().project_key;

export function getAuthority() {
  return localStorage.getItem(`antdPro-authority-${projectKey}`) || '';
}

export function setAuthority(authority) {
  return localStorage.setItem(`antdPro-authority-${projectKey}`, authority);
}
