const qs = require('qs');
const {dataUtils} = require('../utils/index.jsx');

const mockOption = {
  'result|100': [{
    'id|+1': 1,
    account: '@word(5,10)',
    password: '@word(6,13)',
    roleName: '@cname',
    'locked|1-2': true,
    'initPwd|1-2': true,
    'available|1-2': true,
    identity: /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i,
    realName: '@cname',
    'orgNo|1-100': 1,
    orgName: '@cname',
    'roleId|1-100': 1,
    mobile: /^1[34578]\d{9}$/,
    email: '@email',
    qq: /^\d{5,10}$/,
    personalNote: '@cparagraph(1, 2)',
    createTime: '@datetime',
    updateTime: '@datetime',
    lastLoginTime: '@datetime',
    loginIP: '@ip',
    remark: '@word(10,33)',
    createAccount: '@word(5,10)',
  }],
  page: {
    defaultPn: 1,
    defaultPs: 10,
    defaultTotalCount: 100,
  },
};

// 数据持久
let sysMemberListData = {};
if (!global.sysMemberListData) {
  const result = dataUtils.mock(mockOption);
  sysMemberListData = result;

  global.sysMemberListData = sysMemberListData;
} else {
  sysMemberListData = global.sysMemberListData;
}

module.exports = {
  /**
   * 查询
   */
  'GET /sysMember/queryPage.htm': (req, res) => {
    const query = qs.parse(req.query);

    /**
     * 初始化分页参数
     */
    const pageNo = query.pageNo || 1;
    const pageSize = query.pageSize || 10;

    /**
     * 从全局获取缓存数据，复制数组过去
     */
    const newData = dataUtils.copyToNew(sysMemberListData.result);

    // page 数据的 list
    let pageList;
    // 最终回显得 page
    let newPage;

    /**
     * 条件查询 account, mobile, roleId,
     */
    if ( query.account || query.mobile || query.roleId ) {
      newPage = dataUtils.getPage(sysMemberListData.result, pageNo, pageSize, {account: query.account, mobile: query.mobile, roleId: +query.roleId});
    /**
     * 查询全部
     */
    } else {
      newPage = dataUtils.getDefaultPage(sysMemberListData.result, pageNo, pageSize);
    }

      res.json({
        result: newPage,
      });
  },


  /**
   * 查询单个
   */
  'GET /sysMember/queryById.htm': (req, res) => {
    const query = qs.parse(req.query);

    /**
     * 过滤，返回ID 相同的值
     */
    const sysMembers = dataUtils.filter(sysMemberListData.result, {id: +query.id});
    let isQuery = sysMembers ? true : false;

      res.json({
        code: isQuery ? 200 : 400,
        msg: isQuery ? '查询成功' : '用户不存在',
        result: sysMembers,
      });
  },


  /**
   * 新增
   */
  'POST /sysMember/insert.htm': (req, res) => {
      const body = qs.parse(req.body);

      body.createTime = '2017-07-01 17:00:00';
      body.lastLoginTime = '2017-07-01 17:00:00';
      body.loginIP = '192.168.83.219';
      body.createAccount = 'admin';
      sysMemberListData.result = dataUtils.insert(sysMemberListData.result, body)

      /**
       * 修改分页数据长度
       */
      sysMemberListData.page.defaultTotalCount = sysMemberListData.result.length;

      /**
       * 回写回全局
       */
      global.sysMemberListData = sysMemberListData;

      res.json({
        code: 200,
        msg: '新增成功',
      });
  },

  /**
   * 删除
   */
  'GET /sysMember/deleteById.htm': (req, res) => {
    const query = qs.parse(req.query);

    /**
     * 过滤，返回 false即不返回该对象即可实现删除功能
     */
    const beforeLen = sysMemberListData.result.length;
    sysMemberListData.result = dataUtils.delete(sysMemberListData.result, {id: +query.id});
    const afterLen = sysMemberListData.result.length;
    const isDelete = beforeLen > afterLen;

    /**
     * 删除后需要修改 page 默认数据
     */
    sysMemberListData.page.defaultTotalCount = sysMemberListData.result.length;
    /**
     * 修改进度
     */
    sysMemberListData.page.defaultPs = query.pageSize || sysMemberListData.page.defaultPs;
    sysMemberListData.page.defaultPn = query.pageNo || 1;

    /**
     * 回写回全局
     */
    global.sysMemberListData = sysMemberListData;

      res.json({
        code: isDelete ? 200 : 400,
        msg: isDelete ? '删除成功' : '删除失败',
      });
  },

  /**
   * 修改
   */
  'POST /sysMember/update.htm': function (req, res) {
    const body = qs.parse(req.body);

    const newData = dataUtils.update(sysMemberListData.result, body);
    sysMemberListData.result = newData;
    /**
     * 回写回全局
     */
    global.sysMemberListData = sysMemberListData;

      res.json({
        code: 200,
        msg: '修改成功',
      });
  },

 /**
   * 修改不为空的字段
   */
  'POST /sysMember/updateNotNull.htm': function (req, res) {
    const body = qs.parse(req.body);

    const newData = dataUtils.updateNotNull(sysMemberListData.result, body);
   sysMemberListData.result = newData;
    /**
     * 回写回全局
     */
    global.sysMemberListData = sysMemberListData;

      res.json({
        code: 200,
        msg: '修改成功',
      });
  },


  /**
   * 重新造数据
   */
  'GET /sysMember/reload.htm': (req, res) => {
    const result = dataUtils.mock(mockOption);
    sysMemberListData = result;

    global.sysMemberListData = sysMemberListData;

      res.json({
        code: 200,
        msg: '重刷数据完毕',
      });
  },
};
