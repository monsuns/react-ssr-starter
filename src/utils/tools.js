import Cookie from "js-cookie";
import moment from "moment"; //使用ant-design框架集成了moment。

/**
 * @desc 链接数组对象里的某个属性,并返回一个数组，如 [{mis_doctor_id:123},{mis_doctor_id:3497}] 返回数组[123, 3497]
 * @param arr
 * @param prop
 * @returns {Array}
 */
export function getArrProp(arr, prop){
  let result=[];
  if(!arr) return result;
  for(let i=0; i<arr.length; i++){
    result.push(arr[i][prop])
  }
  return result;
}
//价格转换 digit:精确到小数点后多少位,不传精确到元, 传则精确到相关位, 最大4位
export function convertPrice(price,digit=0){
  let tarPrice = Number(price);
  if(price<0){
    let _price = -price;
    return -(convertPrice(_price,digit));
  //}else if(price<100){
  //  return tarPrice.toFixed(digit)
  }else{
    return (tarPrice/10000).toFixed(digit)
  }
}
//小数转换成百分比string digit:需要转换的小数
export function convertPercent(digit){
  return calc.Mul(digit,100) + '%';
}
/**
 * @description 时间转换,处理13位的时间戳(毫秒)
 * @param timeStamp 13位的时间戳(毫秒)
 * @param fmt 输出的时间格式 string 'yyyy-MM-dd hh:mm:ss'
 */
export function convertTimeToStr(timeStamp,fmt='yyyy-MM-dd hh:mm:ss'){
  let date, k, o, tmp;
  if(!timeStamp){return false;}
  if(typeof timeStamp == 'string'){
    timeStamp = parseInt(timeStamp)
  }
  //如果是10位数,则乘以1000转换为毫秒
  if(timeStamp.toString().length == 10 ){
    timeStamp = timeStamp*1000
  }
  date = new Date(timeStamp);
  o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S" : date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
/**
 * @description 时间转换,将时间字符串转为时间戳
 * @param dateStr 日期字符串
 * @param isSecond 为true则输出10位时间戳(秒),默认为13位(毫秒)
 * @returns {number}
 */
export function convertStrToStamp(dateStr,isSecond=false){
  if(!dateStr){ return 0;}
  let date = new Date(dateStr);
  if(date.toString() === 'Invalid Date'){
    console.error('[convertStrToStamp]: 日期格式错误.');
  }else{
    return isSecond?Math.round(date.getTime()/1000):date.getTime();
  }
}
/**
 * @description 参数处理,处理一个对象,剔除其中值为空的项,返回有值的项.用在发送参数的时候处理参数对象.
 * @param object 输入的参数对象
 * @returns {*}
 */
export function handleParams(object){
  if(typeof object !== 'object') return false;
  let keys = Object.keys(object),res = {};
  if(keys.length){
    keys.forEach(item=>{
      switch(typeof object[item]){
        case 'number': //数字0保留
          if(object[item] || object[item] === 0){
            res[item] = object[item];
          }
          break;
        case 'boolean': //false保留
          res[item] = object[item];
          break;
        default: //目标参数value存在(不为null/undefined,或空字符串)
          if(object[item]){
            res[item] = object[item];
          }
      }
    })
  }
  return res;
}
/**
 * @description 本地存储包装器
 * @param type不传默认为 localStorage, 传 session 为 sessionStorage
 */
export const storage = {
  checkWindow(){
    if(!window){
      console.warn("[Storage] === Storage can ONLY used in browser.");
      return false;
    }
    return true;
  },
  checkSupport(type){
    let winFlag = this.checkWindow();
    if(winFlag && window[type]){
      return true
    }else{
      console.warn(`[Storage] === ${type} Storage is NOT supported.`);
      return false
    }
  },
  checkType(type){
    if(type && type === 'session'){
      return 'sessionStorage'
    }else{
      return 'localStorage'
    }
  },
  setObj(obj,type){
    Object.keys(obj).forEach((item)=>{
      this.set(item,obj[item],type);
    })
  },
  set(key, value, type){
    let target = this.checkType(type);
    if(this.checkSupport(target)){
      return window[target].setItem(key, JSON.stringify(value))
    }
  },
  get(key,type){
    let target = this.checkType(type);
    if(this.checkSupport(target)){
      if (window[target][key] && window[target][key] !== 'undefined') {
        return JSON.parse(window[target][key])
      } else {
        return window[target][key]
      }
    }
  },
  removeArr(arr,type){
    if(Array.isArray(arr) && arr.length){
      arr.forEach((item)=>{
        this.remove(item,type)
      })
    }else{
      console.warn("[Storage] === Params must be an array.");
    }
  },
  remove(key,type){
    let target = this.checkType(type);
    if(this.checkSupport(target)){
      if( window[target][key] && window[target][key] !== 'undefined'){
        return window[target].removeItem(key)
      }
    }
  },
  clear(type){
    let target = this.checkType(type);
    window[target].clear();
  },
};
/**
 * @description js精准计算
 * */
export const calc = {
  /**
   * 函数，加法函数，用来得到精确的加法结果
   * 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
   * 参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数）
   * 调用：Calc.Add(arg1,arg2,d)
   * 返回值：两数相加的结果
   */
  Add: function (arg1, arg2) {
    arg1 = arg1.toString(); arg2 = arg2.toString();
    let arg1Arr = arg1.split("."), arg2Arr = arg2.split("."), d1 = arg1Arr.length == 2 ? arg1Arr[1] : "", d2 = arg2Arr.length == 2 ? arg2Arr[1] : "";
    let maxLen = Math.max(d1.length, d2.length);
    let m = Math.pow(10, maxLen);
    let result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
    let d = arguments[2];
    return typeof d === "number" ? Number((result).toFixed(d)) : result;
  },
  /**
   * 函数：减法函数，用来得到精确的减法结果
   * 说明：函数返回较为精确的减法结果。
   * 参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数
   * 调用：Calc.Sub(arg1,arg2)
   * 返回值：两数相减的结果
   */
  Sub: function (arg1, arg2) {
    return Calc.Add(arg1, -Number(arg2), arguments[2]);
  },
  /**
   * 函数：乘法函数，用来得到精确的乘法结果
   * 说明：函数返回较为精确的乘法结果。
   * 参数：arg1：第一个乘数；arg2第二个乘数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
   * 调用：Calc.Mul(arg1,arg2)
   * 返回值：两数相乘的结果
   */
  Mul: function (arg1, arg2) {
    let r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
    m = (r1.split(".")[1] ? r1.split(".")[1].length : 0) + (r2.split(".")[1] ? r2.split(".")[1].length : 0);
    resultVal = Number(r1.replace(".", "")) * Number(r2.replace(".", "")) / Math.pow(10, m);
    return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
  },
  /**
   * 函数：除法函数，用来得到精确的除法结果
   * 说明：函数返回较为精确的除法结果。
   * 参数：arg1：除数；arg2被除数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
   * 调用：Calc.Div(arg1,arg2)
   * 返回值：arg1除于arg2的结果
   */
  Div: function (arg1, arg2) {
    let r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
    m = (r2.split(".")[1] ? r2.split(".")[1].length : 0) - (r1.split(".")[1] ? r1.split(".")[1].length : 0);
    resultVal = Number(r1.replace(".", "")) / Number(r2.replace(".", "")) * Math.pow(10, m);
    return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
  }
};
/**
  * @description 将对象转换为URL字符串,方便发送或存储
  * @param o 将要转为URL参数字符串的对象
  * @param key URL参数字符串的前缀
  * @param encode true/false 是否进行URL编码,默认为true
  * @return string URL参数字符串
 **/
export function objToUrlString(o, key, encode) {
  if (o == null) return '';
  var fn = function(obj, key, encode){
    var paramStr = '',
      t = typeof (obj);
    if (t == 'string' || t == 'number' || t == 'boolean') {
      paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(obj) : obj);
    } else {
      for (var i in obj) {
        var k = key==null?i:key + (obj instanceof Array ? '[' + i + ']' : '.' + i);
        paramStr += fn(obj[i], k, encode);
      }
    }
    return paramStr;
  };
  var result = fn(o, key, encode);
  return result.substr(1)
}
/**
 * @description url字符串转换成对象
 * @param [string]
 * @returns {{}}
 */
export function urlStringToObj(string) {
  'use strict';
  var params = {},
    q = string?string:window.location.search.substring(1),
    e = q.split('&'),
    l = e.length,
    f,
    i = 0;
  for (i; i < l; i += 1) {
    f = e[i].split('=');
    params[f[0]] = decodeURIComponent(f[1]);
  }
  return params;
}
/**
 * @desc 格式化一个对象为字符串如 name=pat&city_no=020&old=99;
 * @param data string
 **/
export function parseParams(data){
  if(data == null){return '';}
  let list = [];
  for(let item in data){
    list.push(`${item}=${data[item]}`)
  }
  return list.join("&");
}
/**
 * @description 频率控制 返回函数连续调用时，func 执行频率限定为 次 / wait --
 * @param  {function}   func      传入函数
 * @param  {number}     wait      表示时间窗口的间隔
 * @param  {object}     options   如果想忽略开始边界上的调用，传入{leading: false}。
 *                                如果想忽略结尾边界上的调用，传入{trailing: false}
 * @return {function}             返回客户调用函数
 */
export function throttle(func, wait, options){
  var context, args, result;
  var timeout = null;
  // 上次执行时间点
  var previous = 0;
  if (!options) options = {};
  // 延迟执行函数
  var later = function() {
    // 若设定了开始边界不执行选项，上次执行时间始终为0
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = Date.now();
    // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
    if (!previous && options.leading === false) previous = now;
    // 延迟执行时间间隔
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
    // remaining大于时间窗口wait，表示客户端系统时间被调整过
    if (remaining <= 0 || remaining > wait) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
      //如果延迟执行不存在，且没有设定结尾边界不执行选项
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}
/**
 * @description 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 * @param  {function} func        传入函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，调用触发于开始边界而不是结束边界
 * @return {function}             返回客户调用函数
 */
export function debounce(func, wait, immediate) {
  var timeout, args, context, timestamp, result;
  var later = function() {
    // 据上一次触发时间间隔
    var last = Date.now() - timestamp;
    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };
  return function() {
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }
    return result;
  };
}
/**
 * @desc 适用于ant-design DatePicker日期选择组件，将Moment类型转换为时间戳。
 * @param Moment
 * @return {*}
 */
export function convertMoment2Stamp(Moment) {
  if (Array.isArray(Moment)) {
    return {
      startDateStamp: parseInt(Moment[0].hour(0).minute(0).second(0).valueOf() / 1000),
      endDateStamp: parseInt(Moment[1].hour(23).minute(59).second(59).valueOf() / 1000)
    }
  } else if (typeof (Moment) === "object") {
    return parseInt(Moment.valueOf() / 1000);
  } else {
    return undefined;
  }
}
/**
 * @desc 将时间戳转变为Moment类型。timeStamp是秒级的时间戳。
 * @param timeStamp
 * @return {*}
 */
export function convertStamp2Moment(timeStamp) {
  let text = null;
  if (timeStamp) {
    text = moment.unix(timeStamp);
    //text = moment.unix(timeStamp * 1000);
    //非法的时间
    if (!text._isValid) {
      text = null;
    }
  }
  return text;
}
/**
 * @desc 参数为时间戳（毫秒级）或字符串“2017-02-01”。
 * @param birth
 * @return string 返回“*岁”、“*个月”、“*天”。如果参数非法则返回“/”。
 */
export function getAgeByBirthday(birth) {
  // 时间戳毫秒级“1486450898000”和字符串“2017-02-08”都能通过new Date()生成Date类型。
  let d = new Date(birth);
  if (isNaN(d.getTime())) {
    console.warn("getAgeByBirthday()生日格式不正确", birth);
    return "/";
  }

  const birthStamp = Math.round(d.getTime() / 1000),
    nowStamp = Math.round(new Date().getTime() / 1000);
  let result = "",
    value = nowStamp - birthStamp;
  if (value < 0) {
    console.warn("getAgeByBirthday()参数出错，出生日期大于当前时间", birth);
    return "[出生日期大于当前时间]";
  } else {
    const SIGN_LIST = ["second", "minute", "hour", "date", "month", "year"];
    let month, sign = 0;
    while (true) {
      switch (SIGN_LIST[sign]) {
        case "second":
          if (value > 60) {
            value = Math.round(value / 60);
          } else {
            result = value + "秒";
          }
          sign++;
          break;
        case "minute":
          if (value > 60) {
            value = Math.round(value / 60);
          } else {
            result = value + "分";
          }
          sign++;
          break;
        case "hour":
          if (value > 24) {
            value = Math.round(value / 24);
          } else {
            result = value + "时";
          }
          sign++;
          break;
        case "date":
          if (value < 30) {
            result = value + "天";
          }
          sign++;
          break;
        case "month":
          month = Math.round(value / 30);
          if (month < 12) {
            result = month + "个月";
          }
          sign++;
          break;
        case "year":
          value = Math.round(value / 365);
          result = value + "岁";
          break;
        default:
          result = "/";
      }
      if (result) {
        break;
      }
    }
  }
  return result;
}
/**
 * @desc js里的Date类型转为时间戳(时间戳转为Date类型请参照tools.js里convertTimeToStr)
 * @author hao
 * @param date Date类型
 * @return number
 * */
export function dateToStamp(date) {
  //判断是否为Date类型，也可以 (typeof date=='object')&&date.constructor==Date
  if (!(date instanceof Date)) {
    return 0;
  }
  //Date.parse(date)方法获得的是 1470898476000
  //date.getTime() 方法获得的是 1470898476295
  return Math.round(date.getTime() / 1000);
}
/**
 * 转为大写（发票）
 * @param money
 * @return {string}
 */
export function convertCurrency(money) {
  //汉字的数字
  let cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
  //基本单位
  let cnIntRadice = new Array('', '拾', '佰', '仟');
  //对应整数部分扩展单位
  let cnIntUnits = new Array('', '万', '亿', '兆');
  //对应小数部分单位
  let cnDecUnits = new Array('角', '分', '毫', '厘');
  //整数金额时后面跟的字符
  let cnInteger = '整';
  //整型完以后的单位
  let cnIntLast = '元';
  //最大处理的数字
  let maxNum = 999999999999999.9999;
  //金额整数部分
  let integerNum;
  //金额小数部分
  let decimalNum;
  //输出的中文金额字符串
  let chineseStr = '';
  //分离金额后用的数组，预定义
  let parts;
  if (money == '') {
    return '';
  }
  money = parseFloat(money);
  if (money >= maxNum) {
    //超出最大处理数字
    return '';
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  //转换为字符串
  money = money.toString();
  if (money.indexOf('.') == -1) {
    integerNum = money;
    decimalNum = '';
  } else {
    parts = money.split('.');
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  //获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0;
    let IntLen = integerNum.length;
    for (let i = 0; i < IntLen; i++) {
      let n = integerNum.substr(i, 1);
      let p = IntLen - i - 1;
      let q = p / 4;
      let m = p % 4;
      if (n == '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        //归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  //小数部分
  if (decimalNum != '') {
    let decLen = decimalNum.length;
    for (let i = 0; i < decLen; i++) {
      let n = decimalNum.substr(i, 1);
      if (n != '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (chineseStr == '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum == '') {
    chineseStr += cnInteger;
  }
  return chineseStr;
}

const Tools={
  cookie             : Cookie,
  getArrProp         : getArrProp,
  convertPrice       : convertPrice,
  convertTimeToStr   : convertTimeToStr,
  convertStrToStamp  : convertStrToStamp,
  convertMoment2Stamp: convertMoment2Stamp,
  convertStamp2Moment: convertStamp2Moment,
  getAgeByBirthday   : getAgeByBirthday,
  handleParams       : handleParams,
  storage            : storage,
  calc               : calc,
  objToUrlString     : objToUrlString,
  urlStringToObj     : urlStringToObj,
  convertCurrency    : convertCurrency,
};

export default Tools;
