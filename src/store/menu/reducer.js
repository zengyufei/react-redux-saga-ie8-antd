import { List, Record } from 'immutable';
import objectAssign from 'object-assign';

import {types} from './actions';
import Menu from './menu';

export default function menuReducer(state = new Menu(), {payload, type, data, params}) {
  switch (type) {
    case types.GET_TOP_MENU:
      return objectAssign({}, state, { topMenu: params.topMenu });

    case types.UPDATE_NAVPATH:
      let navpath = [], tmpOb, tmpKey, child, selectClass = 'ant-menu-item-selected';
      /**
       * 判断 `Action` 传来的数据是否有 `面包屑` 信息
       *
       * `Menu` 控件传来的值 ['子级控件值', '父级控件值']，将数组倒序，先遍历父级标签
       * 如果不做方向操作，`child` 没有子级菜单列表，导致程序出错
       *
       * 判断如果是父级标签，查询菜单Json，取到对应Key的值。
       * 储存该菜单的子集菜单集合到 `child` 中
       * 将 `key`、`name` 添加到 `面包屑` 集合中
       *
       * 判断如果是子级标签，取出对应的Key值
       * 判断 `child` 是否有值，
       * 取到对应的子级数据中的Json
       * 将 `key`、`name` 添加到 `面包屑` 集合中
       *
       * 在面包屑组件中遍历 `navpath` 构建 `Breadcrumb` 标签的值，按顺序显示相关内容
       *
       * `selectClass` 用于解决同步菜单二级菜单点击时 `class` 选中状态的问题，目前没有二级菜单，所以暂时没有用处
       *
       */
      if (data.data) {
        data.data.reverse().map((item) => {
          if (item.indexOf('sub') != -1) {
            tmpKey = item.replace('sub', '');
            tmpOb = _.find(state.topMenu, function(o) {
              return o.key == tmpKey;
            });
            child = tmpOb.child;
            navpath.push({
              key: tmpOb.key,
              name: tmpOb.name
            })
            // selectClass = ''
          }
          if (item.indexOf('menu') != -1) {
            tmpKey = item.replace('menu', '');
            if (child) {
              tmpOb = _.find(child, function(o) {
                return o.key == tmpKey;
              });
            }
            navpath.push({
              key: tmpOb.key,
              name: tmpOb.name
            })
          }
        })
      }

      return objectAssign({}, state, {
        currentIndex: data.key * 1,
        navpath: navpath,
        selectClass: selectClass
      });


    case types.UPDATE_STATUS:
      return objectAssign({}, state, { status: data.status });

    case types.GET_LEFT_MENU:
      return objectAssign({}, state, { leftMenu: params.leftMenu });

    case types.INIT_MENU:

      params.leftMenu.map((item) => {
        item.num = 0;
      });

      return objectAssign({}, state, { leftMenuType: leftMenuType });

    case types.UPDATE_COLLAPSE:
      return objectAssign({}, state, { collapse: !data.collapse });

    case types.GET_ADD_CASE_LEFT_MENU:
      return objectAssign({}, state, { leftMenu: leftMenu });

    default:
      return state;
  }
}
