//去掉最后一个逗号
let removeTheLastComma = function removeTheLastComma(data) {
  var index = data.lastIndexOf(",");
  return data.substring(0,index);
}
export default {
  removeTheLastComma
}
