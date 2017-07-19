import {get, post} from 'util/request';

export async function getTopMenu(params) {
  return get('/sysOrg/queryAll.htm');
}
