const qs = require('qs');
const {dataUtils} = require('../utils/index.jsx');
const { orgContant } = require('../constant/index.jsx');
const { firstOrgs, secondOrgs, threeOrgs } = orgContant;

let firstOrgNameKeys = Object.keys(firstOrgs);
let secondOrgNameKeys = Object.keys(secondOrgs);
let threeOrgNameKeys = Object.keys(threeOrgs);

const orgNameKeys = [ ...firstOrgNameKeys, ...secondOrgNameKeys, ...threeOrgNameKeys ];

let values = new Map();
for(let key in firstOrgs){
  values.set(key, firstOrgs[key])
}
for(let key in secondOrgs){
  values.set(key, secondOrgs[key])
}
for(let key in threeOrgs){
  values.set(key, threeOrgs[key])
}

const mockOption = {
  'result|100': [{
    'id|+1': 1,
    'orgName|1': orgNameKeys,
    'orgNo': function () {
      return values.get(this.orgName);
    },
    'parentOrgNo': function () {
      let orgName = values.get(this.orgName);
      var lastIndexOf = orgName.lastIndexOf("-");
      return orgName.lastIndexOf("-", lastIndexOf-1) > -1 ? orgName.substring(0, lastIndexOf) : "";
    },
    'priority|1-100': 1,
    'available|1-2': true,
    description: '@cparagraph(1, 2)',
    'provinceName': '@province',
    'cityName': '@city',
    'province|1-100': 1,
    'city|1000-9999': 1,
    address: '@county(true)',
    createTime: '@datetime',
    updateTime: '@datetime',
  }],
  page: {
    defaultPn: 1,
    defaultPs: 10,
    defaultTotalCount: 100,
  },
};

// 数据持久
let sysOrgListData = {};
if (!global.sysOrgListData) {
  const result = dataUtils.mock(mockOption);
  sysOrgListData = result;

  global.sysOrgListData = sysOrgListData;
} else {
  sysOrgListData = global.sysOrgListData;
}

module.exports = {
  /**
   * 查询全部组织机构
   */
  'GET /sysOrg/queryAll.htm': (req, res) => {
    // 固定前12条数据
    /*sysOrgListData.result[0].orgNo = 'zzfz-000';
    sysOrgListData.result[0].parentOrgNo = '';
    sysOrgListData.result[1].orgNo = 'zzfz-001';
    sysOrgListData.result[1].parentOrgNo = '';
    sysOrgListData.result[2].orgNo = 'zzfz-002';
    sysOrgListData.result[2].parentOrgNo = '';
    sysOrgListData.result[3].orgNo = 'zzfz-003';
    sysOrgListData.result[3].parentOrgNo = '';
    sysOrgListData.result[4].orgNo = 'zzfz-004';
    sysOrgListData.result[4].parentOrgNo = '';

    sysOrgListData.result[5].orgNo = 'zzfz-000-001';
    sysOrgListData.result[5].parentOrgNo = 'zzfz-000';
    sysOrgListData.result[6].orgNo = 'zzfz-000-002';
    sysOrgListData.result[6].parentOrgNo = 'zzfz-000';
    sysOrgListData.result[7].orgNo = 'zzfz-000-003';
    sysOrgListData.result[7].parentOrgNo = 'zzfz-000';
    sysOrgListData.result[8].orgNo = 'zzfz-000-004';
    sysOrgListData.result[8].parentOrgNo = 'zzfz-000';

    sysOrgListData.result[9].orgNo = 'zzfz-001-001';
    sysOrgListData.result[9].parentOrgNo = 'zzfz-001';
    sysOrgListData.result[10].orgNo = 'zzfz-001-002';
    sysOrgListData.result[10].parentOrgNo = 'zzfz-001';
    sysOrgListData.result[11].orgNo = 'zzfz-001-003';
    sysOrgListData.result[11].parentOrgNo = 'zzfz-001';
    sysOrgListData.result[12].orgNo = 'zzfz-001-004';
    sysOrgListData.result[12].parentOrgNo = 'zzfz-001';

    sysOrgListData.result[13].orgNo = 'zzfz-002-001';
    sysOrgListData.result[13].parentOrgNo = 'zzfz-002';
    sysOrgListData.result[14].orgNo = 'zzfz-002-002';
    sysOrgListData.result[14].parentOrgNo = 'zzfz-002';
    sysOrgListData.result[15].orgNo = 'zzfz-002-003';
    sysOrgListData.result[15].parentOrgNo = 'zzfz-002';
    sysOrgListData.result[16].orgNo = 'zzfz-002-004';
    sysOrgListData.result[16].parentOrgNo = 'zzfz-002';

    sysOrgListData.result[17].orgNo = 'zzfz-003-001';
    sysOrgListData.result[17].parentOrgNo = 'zzfz-003';
    sysOrgListData.result[18].orgNo = 'zzfz-003-002';
    sysOrgListData.result[18].parentOrgNo = 'zzfz-003';
    sysOrgListData.result[19].orgNo = 'zzfz-003-003';
    sysOrgListData.result[19].parentOrgNo = 'zzfz-003';
    sysOrgListData.result[20].orgNo = 'zzfz-003-004';
    sysOrgListData.result[20].parentOrgNo = 'zzfz-003';

    sysOrgListData.result[21].orgNo = 'zzfz-004-001';
    sysOrgListData.result[21].parentOrgNo = 'zzfz-004';
    sysOrgListData.result[22].orgNo = 'zzfz-004-002';
    sysOrgListData.result[22].parentOrgNo = 'zzfz-004';
    sysOrgListData.result[23].orgNo = 'zzfz-004-003';
    sysOrgListData.result[23].parentOrgNo = 'zzfz-004';
    sysOrgListData.result[24].orgNo = 'zzfz-004-004';
    sysOrgListData.result[24].parentOrgNo = 'zzfz-004';*/
    const newData = dataUtils.copyToNew(sysOrgListData.result);

    res.json({
      result: newData,
    });
  },

  /**
   * 查询
   */
  'GET /sysOrg/queryPage.htm': (req, res) => {
    const query = qs.parse(req.query);

    /**
     * 初始化分页参数
     */
    const pageNo = query.pageNo || 1;
    const pageSize = query.pageSize || 10;

    /**
     * 从全局获取缓存数据，复制数组过去
     */
    const newData = dataUtils.copyToNew(sysOrgListData.result);

    // page 数据的 list
    let pageList;
    // 最终回显得 page
    let newPage;

    /**
     * 条件查询 account, mobile, roleId,
     */
    if (query.orgNo || query.orgName) {
      newPage = dataUtils.getPage(sysOrgListData.result, pageNo, pageSize, { orgNo: query.orgNo, orgName: query.orgName });
    /**
     * 查询全部
     */
    } else {
      newPage = dataUtils.getDefaultPage(sysOrgListData.result, pageNo, pageSize);
    }

    res.json({
      result: newPage,
    });
  },


  /**
   * 查询单个
   */
  'GET /sysOrg/queryById.htm': (req, res) => {
    const query = qs.parse(req.query);

    /**
     * 过滤，返回ID 相同的值
     */
    const sysOrgs = dataUtils.filter(sysOrgListData.result, { id: +query.id });
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
  'POST /sysOrg/insert.htm': (req, res) => {
    const body = qs.parse(req.body);
    sysOrgListData.result = dataUtils.insert(sysOrgListData.result, body);

      /**
       * 修改分页数据长度
       */
    sysOrgListData.page.defaultTotalCount = sysOrgListData.result.length;

      /**
       * 回写回全局
       */
    global.sysOrgListData = sysOrgListData;

    res.json({
      code: 200,
      msg: '新增成功',
    });
  },

  /**
   * 删除
   */
  'GET /sysOrg/deleteById.htm': (req, res) => {
    const query = qs.parse(req.query);

    /**
     * 过滤，返回 false即不返回该对象即可实现删除功能
     */
    const beforeLen = sysOrgListData.result.length;
    sysOrgListData.result = dataUtils.delete(sysOrgListData.result, { id: +query.id });
    const afterLen = sysOrgListData.result.length;
    const isDelete = beforeLen > afterLen;

    /**
     * 删除后需要修改 page 默认数据
     */
    sysOrgListData.page.defaultTotalCount = sysOrgListData.result.length;
    /**
     * 修改进度
     */
    sysOrgListData.page.defaultPs = query.pageSize || sysOrgListData.page.defaultPs;
    sysOrgListData.page.defaultPn = query.pageNo || 1;

    /**
     * 回写回全局
     */
    global.sysOrgListData = sysOrgListData;

    res.json({
      code: isDelete ? 200 : 400,
      msg: isDelete ? '删除成功' : '删除失败',
    });
  },

  /**
   * 修改
   */
  'POST /sysOrg/update.htm': function (req, res) {
    const body = qs.parse(req.body);

    const newData = dataUtils.update(sysOrgListData.result, body);
    sysOrgListData.result = newData;
    /**
     * 回写回全局
     */
    global.sysOrgListData = sysOrgListData;

    res.json({
      code: 200,
      msg: '修改成功',
    });
  },

 /**
   * 修改不为空的字段
   */
  'POST /sysOrg/updateNotNull.htm': function (req, res) {
    const body = qs.parse(req.body);

    const newData = dataUtils.updateNotNull(sysOrgListData.result, body);
    sysOrgListData.result = newData;
    /**
     * 回写回全局
     */
    global.sysOrgListData = sysOrgListData;

    res.json({
      code: 200,
      msg: '修改成功',
    });
  },


  /**
   * 重新造数据
   */
  'GET /sysOrg/reload.htm': (req, res) => {
    const result = dataUtils.mock(mockOption);
    sysOrgListData = result;

    global.sysOrgListData = sysOrgListData;

    res.json({
      code: 200,
      msg: '重刷数据完毕',
    });
  },
};
