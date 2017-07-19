import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga-ie8'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import sagas from 'src/sagas'

import promiseMiddleware from 'configuration/middlewares/promiseMiddleware';
import reducers from 'src/reducers'

const sagaMiddleware = createSagaMiddleware();

export default function store(initialState) {
  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(
      sagaMiddleware,
      //createLogger(),
      promiseMiddleware({ promiseTypeSuffixes: ['PENDING', 'SUCCESS', 'ERROR'] }),
    )
    // applyMiddleware(thunkMiddleware)
  );
  sagaMiddleware.run(sagas);
  return store
}

