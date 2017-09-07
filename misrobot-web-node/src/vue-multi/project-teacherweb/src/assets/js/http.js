/**
 * Created by xieyindong on 2017/7/31.
 */
import {Message} from 'element-ui'
import router from '../../router'
var baseUrl = ''
if(process.env.NODE_ENV === 'production'){
  baseUrl=''
}else{
  //baseUrl='http://192.168.1.200:8086'
  baseUrl='http://192.168.1.200:8088/misrobot-service'//蒋
}

var xhttp={
  errcodefn(res){//公用错误码函数
    if(res.errcode==9904){
      Message({
        message: '登陆信息已失效，请重新登陆',
        type: 'warning'
      })
      setTimeout(function(){
        router.push({name:'Login'})
      },3000)
    }else{
      Message({
        message: res.errdesc,
        type: 'warning'
      })
    }
  },
  errfn(){//公用连接失败函数
    Message({
      message: '连接服务失败',
      type: 'error'
    })
  },
  post(url,data,callback,errcodefn,errfn){//公用ajax函数
    data=JSON.stringify({ "1":data });
    var req=new XMLHttpRequest();
    var address=baseUrl+url
    req.open('POST',address);
    req.setRequestHeader("content-Type","text/plain;charset=utf-8");
    req.onreadystatechange=function(){
      if(req.readyState==4){
        if(req.status==200){
          if(typeof(req.responseText)=="string"){
            var response=JSON.parse(req.responseText)["1"]
          }else{
            var response=req.responseText["1"]
          }
          if(response.errcode==0){
            callback(response)
          }else{
            errcodefn(response)
          }
        }else{
          errfn()
        }
      }
    }
    req.send(data)
  }
}
export default xhttp

