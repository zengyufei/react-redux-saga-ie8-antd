/**
 * 遍历 mock 文件夹，获取 mock 接口
 */
'use strict';

const perfix = 'mock';

const mock = {};
const fs = require('fs');
const path = require('path');
var mockPath = path.join(process.cwd()+"/"+perfix);

readDirSync(mockPath);
function readDirSync(mockPath) {
  var pa = fs.readdirSync(mockPath);
  pa.forEach(function (ele, index) {
    var info = fs.statSync(mockPath + "/" + ele)
    if (info.isDirectory()) {
      if(ele.indexOf(".") != 0){
        readDirSync(mockPath + "/" + ele);
      }
    } else {
      if(/.js$/.test(ele)){
        const perfixPath = mockPath.replace(process.cwd(), "").replace("\\", "./");
        Object.assign(mock, require(perfixPath + "/" + ele))
      }
    }
  })
}

module.exports = mock;
//module.exports = ()=>{};
