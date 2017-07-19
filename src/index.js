
import ReactDOM from 'react-dom';
import React from 'react';


const Provider = require('react-redux').Provider;
const registerStore = require('src/store');
const store = registerStore();

import 'src/index.html';
import 'src/index.less';
import Routes from 'src/routes';

// react-outer去除url中的k参数
import { createHashHistory } from 'history'
import {Router, Route, useRouterHistory} from 'react-router'
var appHistory = useRouterHistory(createHashHistory)({queryKey:false});

ReactDOM.render(
  <Provider store={store}>
    <Routes history={appHistory} />
  </Provider>,
  document.getElementById('root')
);
