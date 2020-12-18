/**
 * @description 保存cookie
 * @param {String} name 需要存储cookie的key
 * @param {String} value 需要存储cookie的value
 * @param {Number} timer 默认存储多少天
 */
function setCookie(name,value,timer=1){
  var Days = timer; //默认将被保存 1 天
  var exp  = new Date();
  exp.setTime(exp.getTime() + Days*24*60*60*1000);
  document.cookie = name + "="+ escape(value) +";expires="+ exp.toGMTString();
}

/**
 * @description 获取cookie
 * @param {String} name 需要获取cookie的key
 */
function getCookie(name){
  var arr = document.cookie.match(new 
  RegExp("(^| )"+name+"=([^;]*)(;|$)"));
  if(arr != null){
    return unescape(arr[2])
  }else{
    return null
  }
}

/**
 * @description 删除cookie
 * @param {String} name 需要删除cookie的key
 */
function clearCookie(name){
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval=getCookie(name);
  if(cval!=null) document.cookie=name +"="+cval+";expires="+exp.toGMTString();
}

export {
  setCookie,
  getCookie,
  clearCookie
}