/**
 * Created by lenovo on 2017/1/15.
 */

Vue.component("headerbox",{
    template:
    "<div>" +
    "<p class='headerbox'>{{ thistitle }} </p>" +
    // "<p class='headerbox'>{{ thistitle }} <b v-show='titlenum!=0'>（{{ titlenum }}）</b></p>" +
    "<span onclick='goBack()' v-show='showback'><img src='../../images/futuredoctorapp/icon_fanhui.png' alt=''></span>" +
    "<img src='../../images/futuredoctorapp/btn_refresh.png' onclick='refresh()' id='reload' v-show='showreload'>" +
    "<img src='../../images/futuredoctorapp/btn_shaixuan.png'  id='picker' v-show='showoption'>"+
    "<img src='../../images/futuredoctorapp/icon_zengjia.png' onclick='openaddlist()' class='addicon' v-if='showadd'>" +

    "</div>",
    props:["thistitle","titlenum","showback","showreload","showoption","showadd","listitem"],
    data:function(){
        return{

        }
    },
    methods:{
//      openaddlist:function(){
//          this.showaddlist=!this.showaddlist
//      }

    }
});
function refresh(){
    layer.load(1);
    window.location.reload();
    window.onload=function(){
        layer.closeAll('loading');
    }
};

Vue.component("footertab",{
    template:
        "<ul class='list-inline f10' id='nav'><li class='text-center'><a class='navMsg' href='todo.html' :class='{ navActive:isactive[0] }'><img :src='navimgsrc[0]' alt=''></br> <span>任务</span> <b class='badge' v-show='todonum!=0'>{{ todonum }}</b> </a> </li> <li class='text-center'> <a class='navMsg' href='msg.html' :class='{ navActive: isactive[1] }'> <img :src='navimgsrc[1]' alt=''></br> <span>消息</span> <b class='badge' v-show='msgnum!=0'>{{ msgnum }}</b> </a> </li> <li class='text-center'> <a href='application.html' :class='{ navActive: isactive[2] }'> <img :src='navimgsrc[2]' alt=''></br> <span>应用</span> </a> </li> <li class='text-center'> <a href='my.html' :class='{ navActive: isactive[3] }'> <img :src='navimgsrc[3]' alt=''></br> <span>我的</span> </a> </li> </ul>",
    props:["todonum","msgnum","isactive","navimgsrc"],
    watch:{
        'msgnum': function (val, oldval) {
            $('#errbox').append('componentwatch=====> ' + val);
        }
    }
});
Vue.component("signfooter",{
    template:
        "<ul id='tosignfooter' class='list-inline'> <li> <a :href='tabsrc[0]' :class='{ signActive:signactive[0] }'> <img :src='signnavimg[0]'> </br> <span>打卡</span> </a> </li> <li> <a :href='tabsrc[1]' :class='{ signActive:signactive[1] }'> <img :src='signnavimg[1]'> </br> <span>统计</span> </a> </li> </ul>",
    props:["signactive","signnavimg","tabsrc"]
});
Vue.component('confirmlogout',{
    template:
    '<div id="confirmlogout" class="hide">'+
    '<div class="shade"></div>'+
    '<div class="content">'+
    '<section>'+
    '<div>'+
    '<p>提醒</p>'+
    '<p class="ac">是否退出明日良医?</p>'+
    '</div>'+
    '</section>'+
    '<footer>'+
    '<p>'+
    '<a class="bc" onclick="futureAppLogout()">确定</a>'+
    '<a class="sc" @click="hidelogout()">取消</a>'+
    '</p>'+
    '</footer>'+
    '</div>'+
    '</div>',
    data:function(){
        return{}
    },
    methods:{
        hidelogout:function(){
            $('#confirmlogout').addClass('hide');
        }
    }
});

