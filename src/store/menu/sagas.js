/**
 * Created by Yuicon on 2017/6/30.
 */
import {select, put, call} from 'redux-saga-ie8/effects';
import {takeEvery, takeLatest} from 'redux-saga-ie8'
import 'whatwg-fetch';

import {getTopMenu} from 'services/rbac/sysOrgService';
import {types, menuActions} from './actions';

const { getTopMenuSuccess, getTopMenuFail, } = menuActions;

function* getTopMenuAsync() {
  // 获取Store state 上的数据
  const menu = yield select( state =>{
    return state.menu
  });
  const topMenu = menu.topMenu;
  // 发起 ajax 请求
  const json = yield call(getTopMenu, 'param');
  console.log(json);
  if (+json.code === 200) {
    // 发起 getTopMenuSuccess
    yield put(getTopMenuSuccess(json.data));
  } else {
    // 发起 getTopMenuFail
    yield put(getTopMenuFail(json.error));
  }
}

export default function* rootSaga() {
  yield [
    takeEvery(types.GET_TOP_MENU, getTopMenuAsync),
  ];
}
