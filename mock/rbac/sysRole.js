const qs = require('qs');
const {dataUtils, randomUtils, jsonUtils} = require('../utils/index.jsx');
const { icons, roles, resourceContant } = require('../constant/index.jsx');
const { permissions, } = resourceContant;

// 共有多少权限
const permissionKeys = Object.keys(permissions);
const resLen = permissionKeys.length;

let finalPermissions = [];
// 根据角色数位，需要几套权限标识组合
const roleLen = roles.length;
for(let j=0; j< roleLen; j++){
  //每次用完重置
  let currentPermissions = "";
  // 获取随机数，决定组合几个权限
  let buildNumber = randomUtils.get(0, 5);
  for(let i=0; i< buildNumber; i++){
    // 获取随机数，决定哪个权限
    let index = randomUtils.get(0, resLen-1);
    currentPermissions += permissions[permissionKeys[index]]+","
  }
  finalPermissions.push(currentPermissions);
}

let roleAndPermissions = {};
for(let j=0; j< roleLen; j++){
  roleAndPermissions[roles[j]] = finalPermissions[j];
}

let mockOption = {
  page: {
    defaultPn: 1,
    defaultPs: 10,
    defaultTotalCount: 100,
  },
};

mockOption[`result|${roleLen}`] = [{
  'id|+1': 1,
  'roleName|1': roles,
  'resources': function () {
    return roleAndPermissions[this.roleName];
  },
  'orgNo|1-100': 1,
  description: '@word(6,25)',
  'sysMemberId|1-100': 1,
  'relyRoleId|1-100': 1,
  createTime: '@datetime',
  updateTime: '@datetime',
}];

// 数据持久
let sysRoleListData = {};
if (!global.sysRoleListData) {
  const result = dataUtils.mock(mockOption);
  sysRoleListData = result;

  global.sysRoleListData = sysRoleListData;
} else {
  sysRoleListData = global.sysRoleListData;
}

module.exports = {
  /**
   * 查询全部角色身份
   */
  'GET /sysRole/queryAllRoleIdAndName.htm': (req, res) => {
    let newData = sysRoleListData.result.map(function (result) {
      return {id: result.id, roleName: result.roleName};
    });

      res.json({
        result: newData,
      });
  },

  /**
   * 查询全部角色身份
   */
  'GET /sysRole/queryAll.htm': (req, res) => {
    let newData = sysRoleListData.result;

    res.json({
      result: newData,
    });
  },

  /**
   * 查询
   */
  'GET /sysRole/queryPage.htm': (req, res) => {
    const query = qs.parse(req.query);

    /**
     * 初始化分页参数
     */
    const pageNo = query.pageNo || 1;
    const pageSize = query.pageSize || 10;

    /**
     * 从全局获取缓存数据，复制数组过去
     */
    const newData = dataUtils.copyToNew(sysRoleListData.result);

    // page 数据的 list
    let pageList;
    // 最终回显得 page
    let newPage;

    /**
     * 条件查询 roleName,
     */
    if ( query.roleName) {
      newPage = dataUtils.getPage(sysRoleListData.result, pageNo, pageSize, {roleName: query.roleName});
    /**
     * 查询全部
     */
    } else {
      newPage = dataUtils.getDefaultPage(sysRoleListData.result, pageNo, pageSize);
    }

      res.json({
        result: newPage,
      });
  },


  /**
   * 查询单个
   */
  'GET /sysRole/queryById.htm': (req, res) => {
    const query = qs.parse(req.query);

    /**
     * 过滤，返回ID 相同的值
     */
    const sysRoles = dataUtils.filter(sysRoleListData.result, {id: +query.id});
    let isQuery = sysRoles ? true : false;

      res.json({
        code: isQuery ? 200 : 400,
        msg: isQuery ? '查询成功' : '用户不存在',
        result: sysRoles,
      });
  },


  /**
   * 新增
   */
  'POST /sysRole/insert.htm': (req, res) => {
      const body = qs.parse(req.body);
      sysRoleListData.result = dataUtils.insert(sysRoleListData.result, body)

      /**
       * 修改分页数据长度
       */
      sysRoleListData.page.defaultTotalCount = sysRoleListData.result.length;

      /**
       * 回写回全局
       */
      global.sysRoleListData = sysRoleListData;

      res.json({
        code: 200,
        msg: '新增成功',
      });
  },

  /**
   * 删除
   */
  'GET /sysRole/deleteById.htm': (req, res) => {
    const query = qs.parse(req.query);

    /**
     * 过滤，返回 false即不返回该对象即可实现删除功能
     */
    const beforeLen = sysRoleListData.result.length;
    sysRoleListData.result = dataUtils.delete(sysRoleListData.result, {id: +query.id});
    const afterLen = sysRoleListData.result.length;
    const isDelete = beforeLen > afterLen;

    /**
     * 删除后需要修改 page 默认数据
     */
    sysRoleListData.page.defaultTotalCount = sysRoleListData.result.length;
    /**
     * 修改进度
     */
    sysRoleListData.page.defaultPs = query.pageSize || sysRoleListData.page.defaultPs;
    sysRoleListData.page.defaultPn = query.pageNo || 1;

    /**
     * 回写回全局
     */
    global.sysRoleListData = sysRoleListData;

      res.json({
        code: isDelete ? 200 : 400,
        msg: isDelete ? '删除成功' : '删除失败',
      });
  },

  /**
   * 修改
   */
  'POST /sysRole/update.htm': function (req, res) {
    const body = qs.parse(req.body);

    const newData = dataUtils.update(sysRoleListData.result, body);
    sysRoleListData.result = newData;
    /**
     * 回写回全局
     */
    global.sysRoleListData = sysRoleListData;

      res.json({
        code: 200,
        msg: '修改成功',
      });
  },

 /**
   * 修改不为空的字段
   */
  'POST /sysRole/updateNotNull.htm': function (req, res) {
    const body = qs.parse(req.body);

    const newData = dataUtils.updateNotNull(sysRoleListData.result, body);
    sysRoleListData.result = newData;
    /**
     * 回写回全局
     */
    global.sysRoleListData = sysRoleListData;

       res.json({
         code: 200,
         msg: '修改成功',
       });
  },

  /**
   * 重新造数据
   */
  'GET /sysRole/reload.htm': (req, res) => {
    const result = dataUtils.mock(mockOption);
    sysRoleListData = result;

    global.sysRoleListData = sysRoleListData;

      res.json({
        code: 200,
        msg: '重刷数据完毕',
      });
  },
};
