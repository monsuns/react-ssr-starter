/**
 * Created by simon on 2017/5/12.
 */
import Cookie from "js-cookie";
/**
 * @description 从cookie中取用户信息,返回用户对象
 * @returns { {user_id: (*|boolean), login_id: (*|boolean), open_id: (*|boolean), user_role: (*|boolean), cur_role: (*|boolean)} || null}
 */
export function getUser(){
  if(typeof document !== 'undefined' && window) {
    return {
      user_id:Cookie.get('user_id') || false,
      user_name:Cookie.get('user_name') || false,
      login_account:Cookie.get('login_account') || false,
      clinic_id:Cookie.get('clinic_id') || false,
      clinic_name:Cookie.get('clinic_name') || false,
      city_id:Cookie.get('city_id') || false,
      city_name:Cookie.get('city_name') || false,
      pharmacy_id:Cookie.get('pharmacy_id') || false,
      pharmacy_name:Cookie.get('pharmacy_name') || false,
      pharmacy_type:Cookie.get('pharmacy_type') || false,
      pharmacy_state:Cookie.get('pharmacy_state') || false,
      login_to:Cookie.get('login_to') || false, // 1,普通药房,2.代煎中心	is_central_pharmacy	是否中央药房	number	选填. 1. 取中央药房
      check_id:Cookie.get('check_id') || false,

      system_uid:Cookie.get('system_uid') || false,//C++检查登录标记,没有该标记则去检查登录
    };
  }
}
/**
 * @description 清理当前用户信息
 */
export function cleanUser() {
  let aUserInfo = ["user_id", "user_name", "login_account", "clinic_id", "clinic_name", "city_id","city_name",
    "pharmacy_id", "pharmacy_name", "pharmacy_type", "is_central_pharmacy", "pharmacy_state"];
  if(typeof document !== 'undefined' && window){
    let domainName = window.location.hostname;
    aUserInfo.forEach(item=>{
      Cookie.remove(item, {domain: domainName});
      Cookie.remove(item, {domain: '.gstzy.cn'});
      Cookie.remove(item);
    });
    storage.removeArr(aUserInfo);
  }
}
