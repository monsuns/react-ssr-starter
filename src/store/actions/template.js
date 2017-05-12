/**
* action 示例参考
* */

import {get,post} from "./BaseAction";

export const RECEIVE_TEMPLATE = 'RECEIVE_TEMPLATE';

export function requestTemplate(data,callback,errorCallback){
  return get(`/user_center`,data,callback,errorCallback,(json)=>{
    return {
      type: RECEIVE_TEMPLATE,
      json
    }
  });
}
