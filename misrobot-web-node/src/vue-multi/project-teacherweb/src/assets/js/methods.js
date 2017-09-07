/**
 * Created by 54160 on 2017/7/19.
 */
import flyer from './jquery.fly'
import xhttp from './http'

var methods={
  fly(from,to){
    var startoffset=$(from).offset()
    var endoffset=$(to).offset()
    var flyer=$('<div class="flyimage"></div>')
    flyer.fly({
      start: {
        left: startoffset.left,//抛物体起点横坐标
        top: startoffset.top //抛物体起点纵坐标
      },
      end: {
        left: endoffset.left + 10,//抛物体终点横坐标
        top: endoffset.top + 10, //抛物体终点纵坐标
      },
      onEnd: function() {
        $(flyer).remove(); //销毁抛物体
      }
    })
  },
  deleteItem(arr,num){//给数组删除index元素
    delete arr[num];
    var temp=[];
    for(var index in arr){
      temp.push(arr[index])
    };
    return temp
  },
  numtocase(val){//0-7数字转成大写字母
    switch (val){
      case 0:
        return 'A'
        break;
      case 1:
        return 'B'
        break;
      case 2:
        return 'C'
        break;
      case 3:
        return 'D'
        break;
      case 4:
        return 'E'
        break;
      case 5:
        return 'F'
        break;
      case 6:
        return 'G'
        break;
      case 7:
        return 'H'
        break;
    }
  }

}


export default methods
