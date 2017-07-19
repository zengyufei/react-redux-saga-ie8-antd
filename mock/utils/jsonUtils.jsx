/**
 * Created by chenjialin on 17/3/29.
 */
/**
 *jsonUtils 的实现
 */
const jsonUtils = {

  /**
   *字符串转json
   *
   */
  stringToJson(data){
    return JSON.parse(data);
  },

  /**
   *json转字符串
   */
  jsonToString(data){
    return JSON.stringify(data);
  },

  /**
   *map转换为json
   */
  mapToJson(map) {
    return JSON.stringify(jsonUtils.strMapToObj(map));
  },

  /**
   *json转换为map
   */
  jsonToMap(jsonStr){
    return  jsonUtils.objToStrMap(JSON.parse(jsonStr));
  },


  /**
   *map转化为对象（map所有键都是字符串，可以将其转换为对象）
   */
  strMapToObj(strMap){
    let obj= Object.create(null);
    for (let[k,v] of strMap) {
      obj[k] = v;
    }
    return obj;
  },

  /**
   *对象转换为Map
   */
  objToStrMap(obj){
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      strMap.set(k, obj[k]);
    }
    return strMap;
  },

};


module.exports =  jsonUtils;
