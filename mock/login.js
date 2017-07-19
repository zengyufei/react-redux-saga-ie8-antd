
/**
 * 用户登录接口
 */
const qs = require('qs');

const user = {
  account: 'admin',
  password: 'admin',
};

const loginAdmin = { code: 200, msg: '登录成功', result: 'io4gF054lvFwswe234fHg' };
const loginTest = { code: 200, msg: '登录成功', result: 't48jk234k90dF3w1' };

const test = {
  account: 'test',
  password: 'test',
};

/**
 * 判断是否是 admin
 * @param account == admin
 * @param password == admin
 */
function checkUser(account, password) {
  return user.account === account && user.password === password;
}


/**
 * 判断是否是 test
 * @param account == test
 * @param password == test
 */
function checkTest(account, password) {
  return test.account === account && test.password === password;
}

module.exports = {

   /**
   * 登录
   */
  'POST /login.htm': function (req, res) {
    const item = qs.parse(req.body);
    const result = checkUser(item.account, item.password);
    if (result) {
      res.json(loginAdmin);
    } else if (checkTest(item.account, item.password)) {
      res.json(loginTest);
    } else {
      res.json({ code: 400, msg: '登录失败' });
    }
  },

  /**
   * 获取当前登录用户信息
   */
  'GET /sysMember/getMember.htm': (req, res) => {
    const token = req.headers.token;

    let result;
    if (loginAdmin.token === token) {
      result = { account: 'admin', realName: '管理员', roleId: 1 };
    } else if (loginTest.token === token) {
      result = { account: 'test', realName: '测试', roleId: 2 };
    } else {
      setTimeout(() => {
        res.json({
          code: 400,
          msg: '查询失败, token 过时',
        });
      }, 50);
      return;
    }

    setTimeout(() => {
      res.json({
        code: 200,
        msg: '查询成功',
        result,
      });
    }, 50);
  },

  /**
   * 获取当前登录用户角色信息
   */
  'GET /sysRole/getRole.htm': (req, res) => {
    const token = req.headers.token;

    let result;
    if (loginAdmin.result === token) {
      result = {
        description: '系统管理员', id: 1, name: '管理员', parentId: 0, resourceList: '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29',
      };
    } else if (loginTest.result === token) {
      result = { description: '下属管理员', id: 2, name: '二级管理员', parentId: 1, resourceList: '1,2,3,4' };
    } else {
      setTimeout(() => {
        res.json({
          code: 400,
          msg: '查询失败, token 过时',
        });
      }, 50);
      return;
    }

    setTimeout(() => {
      res.json({
        code: 200,
        msg: '查询成功',
        result,
      });
    }, 50);
  },

  /**
   * 获取当前登录用户资源信息
   */
  'GET /sysResource/getResource.htm': (req, res) => {
    const token = req.headers.token;

    let result;
    if (loginAdmin.result === token) {
      result = 'system:*,system:org:*,system:user:*,system:user:add,system:role:*, system:resource:*, car:*,car:car:*,car:car:add,car:annualVerification:*,car:annualVerification:add,car:maintain:*,car:insurance:*,car:carOperateLog:*' +
      ',driver:*,driver:driver:*,driver:archives:*,driver:common:*,driver:govt:*,driver:media:*,driver:complain:*,driver:punish:*,driver:violation:*,driver:accident:*' +
      ',finance:*,finance:monthQuota:*,finance:nonBusinessIncome:*,finance:reserveMoney:*,finance:securityDeposit:*';
    } else if (loginTest.result === token) {
      result = 'system:*,system:user:*,system:user:add' ;
    } else {
      setTimeout(() => {
        res.json({
          code: 400,
          msg: '查询失败, token 过时',
        });
      }, 50);
      return;
    }

    setTimeout(() => {
      res.json({
        code: 200,
        msg: '查询成功',
        result,
      });
    }, 50);
  },


};
