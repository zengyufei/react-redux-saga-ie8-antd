const qs = require('qs');
const objectAssign = require('object-assign');
const {dataUtils, randomUtils, jsonUtils} = require('../utils/index.jsx');

const { icons, resourceContant } = require('../constant/index.jsx');
const { permissions, firstResources, secondResources, threeResources, } = resourceContant;


let map = jsonUtils.objToStrMap(permissions);
let resNames = Object.keys(permissions);

let mockOption = {
  page: {
    defaultPn: 1,
    defaultPs: 10,
    defaultTotalCount: 100,
  },
};

let finalResources = objectAssign({}, firstResources, secondResources, threeResources);

mockOption[`result|${map.size}`] = [{
  'id|+1': 1,
  'parentId|1-100': 1,
  'resName|+1': resNames,
  'hierarchy': function () {
    return firstResources[this.resName] ? 1 : secondResources[this.resName] ? 2 : 3;
  },
  'resNo': function () {
    return finalResources[this.resName];
  },
  'parentResNo': function () {
    let resName = finalResources[this.resName];
    return resName ? resName.substring(0, resName.lastIndexOf("-")) : "";
  },
  'icon': function () {
    return this.hierarchy == 3 ? "" : icons[randomUtils.get(0, map.size-1)];
  },
  'permission': function () {
    return map.get(this.resName);
  },

  createTime: '@datetime',
  updateTime: '@datetime',
}];


// 数据持久
let sysResourceListData = {};
if (!global.sysResourceListData) {
  const result = dataUtils.mock(mockOption);
  sysResourceListData = result;

  sysResourceListData = sysResourceListData;
} else {
  sysResourceListData = global.sysResourceListData;
}

module.exports = {
  /**
   * 查询全部组织机构
   */
  'GET /sysResource/queryAll.htm': (req, res) => {
    const newData = dataUtils.copyToNew(sysResourceListData.result);

    res.json({
      result: newData,
    });
  },

  /**
   * 查询
   */
  'GET /sysResource/queryPage.htm': (req, res) => {
    const query = qs.parse(req.query);

    /**
     * 初始化分页参数
     */
    const pageNo = query.pageNo || 1;
    const pageSize = query.pageSize || 10;

    /**
     * 从全局获取缓存数据，复制数组过去
     */
    const newData = dataUtils.copyToNew(sysResourceListData.result);

    // page 数据的 list
    let pageList;
    // 最终回显得 page
    let newPage;

    /**
     * 条件查询 account, mobile, roleId,
     */
    if (query.resNo || query.resName || query.roleId) {
      newPage = dataUtils.getPage(sysResourceListData.result, pageNo, pageSize, { resNo: query.resNo, resName: query.resName, roleId: +query.roleId });
    /**
     * 查询全部
     */
    } else {
      newPage = dataUtils.getDefaultPage(sysResourceListData.result, pageNo, pageSize);
    }

    res.json({
      result: newPage,
    });
  },


  /**
   * 查询单个
   */
  'GET /sysResource/queryById.htm': (req, res) => {
    const query = qs.parse(req.query);

    /**
     * 过滤，返回ID 相同的值
     */
    const sysOrgs = dataUtils.filter(sysResourceListData.result, { id: +query.id });
    const isQuery = !!sysOrgs;

    res.json({
      code: isQuery ? 200 : 400,
      msg: isQuery ? '查询成功' : '用户不存在',
      result: sysOrgs,
    });
  },


  /**
   * 新增
   */
  'POST /sysResource/insert.htm': (req, res) => {
    const body = qs.parse(req.body);
    sysResourceListData.result = dataUtils.insert(sysResourceListData.result, body);

      /**
       * 修改分页数据长度
       */
    sysResourceListData.page.defaultTotalCount = sysResourceListData.result.length;

      /**
       * 回写回全局
       */
    global.sysResourceListData = sysResourceListData;

    res.json({
      code: 200,
      msg: '新增成功',
    });
  },

  /**
   * 删除
   */
  'GET /sysResource/deleteById.htm': (req, res) => {
    const query = qs.parse(req.query);

    /**
     * 过滤，返回 false即不返回该对象即可实现删除功能
     */
    const beforeLen = sysResourceListData.result.length;
    sysResourceListData.result = dataUtils.delete(sysResourceListData.result, { id: +query.id });
    const afterLen = sysResourceListData.result.length;
    const isDelete = beforeLen > afterLen;

    /**
     * 删除后需要修改 page 默认数据
     */
    sysResourceListData.page.defaultTotalCount = sysResourceListData.result.length;
    /**
     * 修改进度
     */
    sysResourceListData.page.defaultPs = query.pageSize || sysResourceListData.page.defaultPs;
    sysResourceListData.page.defaultPn = query.pageNo || 1;

    /**
     * 回写回全局
     */
    global.sysResourceListData = sysResourceListData;

    res.json({
      code: isDelete ? 200 : 400,
      msg: isDelete ? '删除成功' : '删除失败',
    });
  },

  /**
   * 修改
   */
  'POST /sysResource/update.htm': function (req, res) {
    const body = qs.parse(req.body);

    const newData = dataUtils.update(sysResourceListData.result, body);
    sysResourceListData.result = newData;
    /**
     * 回写回全局
     */
    global.sysResourceListData = sysResourceListData;

    res.json({
      code: 200,
      msg: '修改成功',
    });
  },

 /**
   * 修改不为空的字段
   */
  'POST /sysResource/updateNotNull.htm': function (req, res) {
    const body = qs.parse(req.body);

    const newData = dataUtils.updateNotNull(sysResourceListData.result, body);
    sysResourceListData.result = newData;
    /**
     * 回写回全局
     */
    global.sysResourceListData = sysResourceListData;

    res.json({
      code: 200,
      msg: '修改成功',
    });
  },


  /**
   * 重新造数据
   */
  'GET /sysResource/reload.htm': (req, res) => {
    const result = dataUtils.mock(mockOption);
    sysResourceListData = result;

    global.sysResourceListData = sysResourceListData;

    res.json({
      code: 200,
      msg: '重刷数据完毕',
    });
  },
};
