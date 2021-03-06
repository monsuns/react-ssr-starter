/**
 * Created by Administrator on 2017/1/6.
 * @file
 * @desc 表单的检验规则
 */

//校验手机号
export function checkPhone(rule, value, callback) {
  let errors;
  let reg = /^1[3|4|5|7|8][0-9]{9}$/;
  if (value && !reg.test(value)) {
    errors = [new Error('非法手机号码 ')];
  }
  callback(errors);
}

//校验身份证
export function checkID(value) {
  let reg = /^\d{17}(\d|x)$/i;
  if (value && reg.test(value)) {
    return true;
  }else {
    return false;
  }
  // const city = {
  //   11: "北京",
  //   12: "天津",
  //   13: "河北",
  //   14: "山西",
  //   15: "内蒙古",
  //   21: "辽宁",
  //   22: "吉林",
  //   23: "黑龙江 ",
  //   31: "上海",
  //   32: "江苏",
  //   33: "浙江",
  //   34: "安徽",
  //   35: "福建",
  //   36: "江西",
  //   37: "山东",
  //   41: "河南",
  //   42: "湖北 ",
  //   43: "湖南",
  //   44: "广东",
  //   45: "广西",
  //   46: "海南",
  //   50: "重庆",
  //   51: "四川",
  //   52: "贵州",
  //   53: "云南",
  //   54: "西藏 ",
  //   61: "陕西",
  //   62: "甘肃",
  //   63: "青海",
  //   64: "宁夏",
  //   65: "新疆",
  //   71: "台湾",
  //   81: "香港",
  //   82: "澳门",
  //   91: "国外"
  // };
  // const birthday = ID.substr(6, 4) + '/' + Number(ID.substr(10, 2)) + '/' + Number(ID.substr(12, 2));
  // const d = new Date(birthday);
  // const newBirthday = d.getFullYear() + '/' + Number(d.getMonth() + 1) + '/' + Number(d.getDate());
  // const currentTime = new Date().getTime();
  // const time = d.getTime();
  // const arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  // const arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  // const sum = 0, i, residue;
  //
  // if (!/^\d{17}(\d|x)$/i.test(ID)) return '非法身份证';
  // if (city[ID.substr(0, 2)] === undefined) return "非法地区";
  // if (time >= currentTime || birthday !== newBirthday) return '非法生日';
  // for (i = 0; i < 17; i++) {
  //   sum += ID.substr(i, 1) * arrInt[i];
  // }
  // residue = arrCh[sum % 11];
  // if (residue !== ID.substr(17, 1)) return '非法身份证哦';
  // return city[ID.substr(0, 2)] + "," + birthday + "," + (ID.substr(16, 1) % 2 ? " 男" : "女")
}

//校验邮箱

//校验诊疗卡号

//校验订单号

//校验数字
export function checkNumber(value) {
  let reg = /^\d*$/;
  return reg.test(value);
}
