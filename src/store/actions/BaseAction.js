//import {polyfill} from "es6-promise";
import fetch from "isomorphic-fetch";
import {parseParams} from "../../utils/tools"

const option = {
  timeout: 10000,
  credentials: 'include',
};
export function get(url="", data=null, callback=(json)=>{},errorCallback=(json)=>{}, reducersConnect=(json)=>{},headers){
  const params = parseParams(data), tarUrl = data===null?url:`${url}?${params}`;
  return dispatch=>{
    return fetch(tarUrl, Object.assign({method: "GET",headers:headers?headers:{}},option))
      .then( response => {
        return response.json()
      })
      .then(json=>{
        dispatch(reducersConnect(json));
        callback(json);
        return json;
      })
      .catch(e=>{
        errorCallback(e);
      })
  }
}

export function post(url="", data=null, callback=(json)=>{},errorCallback=(json)=>{}, reducersConnect=(json)=>{},headers){
  return dispatch=>{
    return fetch(url, Object.assign({method: "POST",body:JSON.stringify(data),headers:headers?headers:{}},option))
      .then( response => {
        return response.json()
      })
      .then(json=>{
        dispatch(reducersConnect(json));
        callback(json);
        return json;
      })
      .catch(e=>{
        errorCallback(e);
      })
  }
}

export function phpGet(url="", data=null, callback=(json)=>{},errorCallback=(json)=>{}, reducersConnect=(json)=>{}){
  let postData = {};
  for(let i in data){
    if ((typeof data[i]==="object")&&(data[i].constructor===Array)) {
      data[i].map((item,index)=>{
        postData[i+"["+index+"]"] = item
      });
    }else{
      postData[i] = data[i]
    }
  }
  const params = parseParams(postData), tarUrl = data===null?url:`${url}?${params}`;
  return dispatch=>{
    return fetch(tarUrl, Object.assign({method: "GET"},option))
      .then( response => {
        return response.json()
      })
      .then(json=>{
        dispatch(reducersConnect(json));
        callback(json);
        return json;
      })
      .catch(e=>{
        errorCallback(e);
      })
  }
}

export function phpPost(url="", data=null, callback=(json)=>{},errorCallback=(json)=>{}, reducersConnect=(json)=>{}){
  let form = new FormData(data);
  for(let i in data){
    if ((typeof data[i]==="object")&&(data[i].constructor===Array)) {
      data[i].map((item,index)=>{
        form.append(i+"["+index+"]",item)
      })
    }else {
      form.append(i, data[i])
    }
  }
  return dispatch=>{
    return fetch(url, Object.assign({method: "POST",body:form},option))
      .then( response => {
        return response.json()
      })
      .then(json=>{
        dispatch(reducersConnect(json));
        callback(json);
        return json;
      })
      .catch(e=>{
        errorCallback(e);
      })
  }
}
