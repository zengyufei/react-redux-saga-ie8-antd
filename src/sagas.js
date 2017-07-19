import { menuSagas } from 'store/menu/';

function* rootSaga() {
  /*The saga is waiting for a action called LOAD_DASHBOARD to be activated */
  yield [
    menuSagas(),
  ];
}

export default rootSaga;
