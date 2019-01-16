/**
 * fetch API 封装
 */
import 'whatwg-fetch';
import 'es6-promise';
const headerOption = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Requested-With': 'XMLHttpRequest'
}
export default {
   get (url,data) {
       const selfData = (data && '?'+this.obj2params(data)) || '';
       return fetch(url+selfData, {
           method: "GET",
           credentials: 'include',
           headers: headerOption
       }).then(resp => {
           if (resp.ok) {
               return resp.json();
           } else {
               // let error = '请求失败';
               // throw error
               return {status:resp.status,statusText:resp.statusText,error:true}
           }
       });
   },
    post (url,data){
        const selfData = this.obj2params(data) || '';
        return fetch(url, {
            method: "POST",
            credentials: 'include',
            mode: "no-cors",
            redirect:"follow",
            headers: headerOption,
            body:selfData
        }).then(resp => {
            if (resp.ok) {
                return resp.json();
            } else {
                // let error = "错误代码："+resp.status+"! 错误信息："+resp.statusText;
                // throw error;
                return {status:resp.status,statusText:resp.statusText,error:true}
            }
        });
    },
    obj2params(obj) {
        let result = '';
        let item;
        for (item in obj) {
            result += '&' + item + '=' + encodeURIComponent(obj[item]);
        }
        if (result) {
            result = result.slice(1);
        }
        return result;
    }
}