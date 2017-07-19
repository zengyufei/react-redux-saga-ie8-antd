
/**
 *  测试
 */
const qs = require('qs');

module.exports = {

   /**
   * 获取顶部菜单 测试
   */
  'get /getTopMenu.htm': function (req, res) {
      res.json({ code: 400, msg: '登录失败', result: [
        {
          key: 'home',
          name: 'Home',
          icon: 'book'
        },
        {
          key: 'test',
          name: 'Test',
          icon: 'user'
        },
        {
          key: 'loding',
          name: '加载效果',
          icon: 'smile-circle'
        }
      ] });
  },


};
