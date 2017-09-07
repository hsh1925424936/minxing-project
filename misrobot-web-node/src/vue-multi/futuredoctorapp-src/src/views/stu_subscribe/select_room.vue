<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            {{learninfo.name}}
            <template v-if="learninfo.type==0">
                (在线)
            </template>
            <template v-else-if="learninfo.type==1">
                (模型)
            </template>
            <template v-else-if="learninfo.type==2">
                (智能)
            </template>
        </c-header>

            <div class="room_outer">
                <!-- <img src="../../assets/images/turnLeft.jpg" /> -->
                <div class="room_con">
                    <div class="room_inner">
                        <span v-for="item in placelist" :class="room_class(item.placeid)" @click="change_now_room(item.placeid,item.name,item.displayname,item.uname,item.mobile)">
                            <p>{{item.name}}</p>
                        </span>
                    </div>
                </div>
                <!-- <img src="../../assets/images/turnRight.jpg" /> -->

            </div>

            <!--<div class="table">-->
                <!--<div class="th clearfix">-->
                    <!--<div class="td black">{{month}}月</div>-->
                    <!--<div v-for="item in day" class="td">-->
                        <!--{{item.day}}<br/><span class="black">{{item.date}}</span>-->
                    <!--</div>-->
                    <!--&lt;!&ndash; <div class="td">13<br/>周一</div> &ndash;&gt;-->

                <!--</div>-->
                <!--&lt;!&ndash; <div class="tr clearfix">-->
                    <!--<div class="td">-->
                        <!--08:00-<br/>08:45-->
                    <!--</div>-->
                    <!--<div class="td">未开放</div>-->
                    <!--<div class="td">2</div>-->
                    <!--<div class="td">2</div>-->
                    <!--<div class="td">2</div>-->
                    <!--<div class="td">2</div>-->
                    <!--<div class="td">2</div>-->
                    <!--<div class="td">2</div>-->
                <!--</div> &ndash;&gt;-->
                <!--<div class="tr clearfix" v-for="(_timelist,x) in timelist">-->
                    <!--<div class="td">-->
                        <!--{{_timelist.starttime.substring(0,5)}}-<br/>{{_timelist.endtime.substring(0,5)}}-->
                    <!--</div>-->
                    <!--<template v-for="(_dayslist,y) in _timelist.dayslist">-->
                        <!--<div v-if="isover(_dayslist.status,_timelist.endtime,y)" class="td not_open">-->
                            <!--已过期-->
                        <!--</div>-->
                        <!--<div v-else-if="_dayslist.status == 0" :class="show_select(_dayslist.day.substring(0,10)+' '+_timelist.starttime.substring(0,5)+'-'+_timelist.endtime.substring(0,5))" :time="_dayslist.day.substring(0,10)+' '+_timelist.starttime.substring(0,5)+'-'+_timelist.endtime.substring(0,5)" @click="jump_confirm()">-->

                        <!--</div>-->
                        <!--<div v-else-if="_dayslist.status == 1" class="td full">-->
                            <!--已有预约-->
                        <!--</div>-->
                        <!--<div v-else-if="_dayslist.status == 3" class="td not_open">-->
                            <!--未开放-->
                        <!--</div>-->
                    <!--</template>-->
                <!--</div>-->

            <!--</div>-->
        <!--</div>-->
            <div class="seltimemain">
                <div class="changepagehandlers">
                    <span class="pageleftbtn" v-show="week>1" @click="seltimeprevpage()"><img src="../../assets/images/btn_left.png" alt=""></span>
                    <span class="pagerightbtn" v-show="week<totalweek" @click="seltimenextpage()"><img src="../../assets/images/btn_right.png" alt=""></span>
                </div>
                <ul class="seltimethead">
                    <li></li>
                    <li v-for="(value1,index1) in day">
                        <span class="fcontentgray titleweekday">{{ value1.day.slice(0,10) | daytoweek }}</span>
                        <span class="ftitlegray">{{ value1.day.slice(5,10) }}</span>
                    </li>
                </ul>
            </div>
            <div class="g-main">
                <div class="timetable" border="1" cellspacing="0">
                    <div id="appointtimetable">
                    <div v-for="(value2,index2) in timeslist" class="flex">
                        <div class="seltimeleftcol flex-column timetabletd">
                            <span class="fcontentgray block">{{ value2.starttime.slice(0,5) }}~</span>
                            <span class="fcontentgray">{{ value2.endtime.slice(0,5) }}</span>
                        </div>
                        <div v-if="learninfo.paramvalue==0" v-for="(value3,index3) in timeslist[index2].dayslist" :class="{'tdblueback':value3.status==2 || value3.status==1 || value3.status==3 || value3.status==5 || value3.status==8,'tdgrayback':value3.status==4 || value3.status==6 || value3.status==7 || value3.flag=='past'}" class="timetabletd">
                            <div v-if="value3.status==0 && value3.flag=='future'" @click="jump_confirm(value3)" class="appointok">
                                <!--<p class="m0">-->
                                    <!--<span class="fcontentblue" v-text="value3.count==null?0:value3.count"></span> /-->
                                    <!--<span v-text="value3.size==null?0:value3.size"></span>-->
                                <!--</p>-->
                            </div>
                            <!--<span v-if="value3.status==0 && value3.flag=='future' && value3.count && value3.count > 0">{{value3.count}}</span>-->
                            <span v-if="value3.status!=0 && value3.flag=='future'">{{ value3.description }}</span>
                            <span v-if="value3.flag=='past'">已过期</span>
                        </div>
                        <div v-if="learninfo.paramvalue==1" v-for="(value3,index3) in timeslist[index2].dayList" :class="{'tdblueback':value3.status==2 || value3.status==1 || value3.status==3 || value3.status==5 || value3.status==8,'tdgrayback':value3.status==4 || value3.status==6 || value3.status==7 || value3.flag=='past'}" class="timetabletd">
                            <div v-if="value3.status==0 && value3.flag=='future'" @click="jump_confirm(value3)" class="appointok">
                                <!--<p class="m0">-->
                                    <!--<span class="fcontentblue" v-text="value3.count==null?0:value3.count"></span> /-->
                                    <!--<span v-text="value3.size==null?0:value3.size"></span>-->
                                <!--</p>-->
                            </div>
                            <!--<span v-if="value3.status==0 && value3.flag=='future' && value3.count && value3.count > 0">{{value3.count}}</span>-->
                            <span v-if="value3.status!=0 && value3.flag=='future'">{{ value3.description }}</span>
                            <span v-if="value3.flag=='past'">已过期</span>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
    </div>
</template>

<script>

    import $ from 'jquery';
    import methods from '../../methods';
    import cHeader from '../header.vue';
    import cModal from '../../components/modal';
    import { mapState, mapActions } from 'vuex';
    import xieFn from '../../vuex/xie';
    export default {
        data() {
            return {
                learninfo:{
                    learnid:this.$route.query.learnid,
                    name:this.$route.query.name,
                    type:this.$route.query.type,
                    paramvalue:this.$route.query.paramvalue
                },
                month:'',
                day:[],
                placelist:[],
                nowroomid:'',//当前选择的房间,
                selected_room:{//当前选择的房间信息
                    displayname:'',//当前选择房间地址
                    name:'',//当前选择房间名称
                    uname:'',//当前管理员姓名
                    mobile:'',//当前管理员电话
                },
                nowtime:'',//存放当前选择的时间段

                timeslist:[],
                totalweek:'',
                week:1,
            }
        },
        filters:{
            daytoweek: function (oldvalue) {//把日期转换成周几
                var newvalue=xieFn.whichday(oldvalue)
                return newvalue
            }
        },
        components: {
            cHeader,
            cModal
        },
        mounted () {
        	console.log('----------subscribe_confirm router-----------'+JSON.stringify(this.$route.query))
            this.setTitle('选择实验室')
            let _this=this;
            this.registerToNative('goBack', function (data) {
                _this.back();
            });
            this.init();
//          console.log(xieFn.comparenowtime('2017-05-18 16:40:00'))
        },
        updated :function(){
            var tdwidth=$('.timetable td').width()
            $('.timetable td').each(function(){
                $(this).height(tdwidth*1.6)
            })
        },
        watch: {
            nowroomid: function(val,oldVal){
                this.week=1
                this.getTable(this.week,val)
            }
        },
        methods: {
            ...mapActions([
                'showAlert',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            ...methods,
            init() {
                let self = this;

				if (self.learninfo.paramvalue==0) {
					// 通过训练项查房间
	                this.post('/learn/queryplacebylearnid', {
	                    command: "learn/queryplacebylearnid",
	                    sessionid: $.cookie('sid'),
	                    loginid: $.cookie('uid'),
	                    learnids:[{learnid:this.learninfo.learnid}]
	//                  learnid:31
	                }).done(function (data) {
	                    self.placelist = data.placelist;
	                    $('.room_inner').css('width',data.placelist.length*1.86+1+'rem');

	                    //填充默认房间信息
	                    self.nowroomid = data.placelist[0].placeid;

	                    self.selected_room.displayname = data.placelist[0].displayname;//当前选择房间地址
	                    self.selected_room.name = data.placelist[0].name;//当前选择房间名称
	                    self.selected_room.uname = data.placelist[0].uname;//当前管理员姓名
	                    self.selected_room.mobile = data.placelist[0].mobile;//当前管理员电话

	                });
				} else{
					// 通过训练项查房间
	                this.post('/studentapply/queryplacebylearnid', {
	                    command: "studentapply/queryplacebylearnid",
	                    sessionid: $.cookie('sid'),
	                    loginid: $.cookie('uid'),
	                    learnid:this.learninfo.learnid
	//                  learnid:31
	                }).done(function (data) {
	                    self.placelist = data.placelist;
	                    $('.room_inner').css('width',data.placelist.length*1.86+1+'rem');

	                    //填充默认房间信息
	                    self.nowroomid = data.placelist[0].placeid;

	                    self.selected_room.displayname = data.placelist[0].displayname;//当前选择房间地址
	                    self.selected_room.name = data.placelist[0].name;//当前选择房间名称
	                    self.selected_room.uname = data.placelist[0].uname;//当前管理员姓名
	                    self.selected_room.mobile = data.placelist[0].mobile;//当前管理员电话

	                });
				}

            },
            back(){
                this.$router.push({
                    name: 'fdnew_learninfo',
                })
            },
            seltimenextpage:function(){//跳转下一页
                this.week++
                this.getTable(this.week,this.nowroomid)
            },
            seltimeprevpage:function(){//跳转上一页
                this.week--
                this.getTable(this.week,this.nowroomid)
            },
            getTable:function(pagenum,whichroom){//获取表格内容
                this.totalweek=''
                this.timeslist=[]
                this.day=[]
                var self=this
                if (self.learninfo.paramvalue==0) {
                	var param = {
	                    command: 'learn/liststudentbooking',
	                    loginid: xieFn.getCookie('uid'),
	                    placeid: whichroom,
	                    sessionid: xieFn.getCookie('sid'),
	                    page:pagenum,
	                    stuid:xieFn.getCookie('uid'),
	                    learnid:this.learninfo.learnid
	//					learnid:31
	                }
	                self.post('/learn/liststudentbooking', param).done(function (res) {
	                    if(res.errcode==0){
	                        self.totalweek=res.totalweek;
	                        self.timeslist=res.timeslist;
	                        self.day=res.timeslist[0].dayslist;
	                        for(var i=0;i<self.timeslist.length;i++){
	                            for(var j=0;j<self.timeslist[i].dayslist.length;j++){
	                                self.timeslist[i].dayslist[j].starttime=self.timeslist[i].starttime
	                                self.timeslist[i].dayslist[j].endtime=self.timeslist[i].endtime
	                                self.timeslist[i].dayslist[j].flag=xieFn.comparenowtime(self.timeslist[i].dayslist[j].day+' '+self.timeslist[i].starttime)
	                            }
	                        }
                            console.log('-------------'+JSON.stringify(self.timeslist))
	                    }else{
	                        self.toast(res.errdesc)
	                    }
	                }).fail(function () {
	                    self.toast('连接服务失败，请稍后再试。')
	                })
                } else{
	                var param = {
	                    command: 'studentapply/querystubookingcalendar',
	                    loginid: xieFn.getCookie('uid'),
	                    placeid: whichroom,
	                    sessionid: xieFn.getCookie('sid'),
	                    page:pagenum,
	                    stuid:xieFn.getCookie('uid'),
	                    learnid:this.learninfo.learnid
	//					learnid:31
	                }
	                self.post('/studentapply/querystubookingcalendar', param).done(function (res) {
	                    if(res.errcode==0){
	//                      console.log(JSON.stringify(res))
	                        self.totalweek=res.totalweek;
	                        self.timeslist=res.timeslist;
	                        self.day=res.timeslist[0].dayList;
	                        for(var i=0;i<self.timeslist.length;i++){
	                            for(var j=0;j<self.timeslist[i].dayList.length;j++){
	                                self.timeslist[i].dayList[j].starttime=self.timeslist[i].starttime
	                                self.timeslist[i].dayList[j].endtime=self.timeslist[i].endtime
	                                self.timeslist[i].dayList[j].flag=xieFn.comparenowtime(self.timeslist[i].dayList[j].day+' '+self.timeslist[i].starttime)
	//                              console.log('-------------'+JSON.stringify(self.timeslist[i].starttime))
	                            }
	                        }
	                    }else{
	                        self.toast(res.errdesc)
	                    }
	                }).fail(function () {
	                    self.toast('连接服务失败，请稍后再试。')
	                })
                }
            },
            change_now_room(roomid,name,displayname,uname,mobile) {//改变当前选择的房间号
                this.nowroomid = roomid;
                this.selected_room.name = name;//当前选择房间名称
                this.selected_room.displayname = displayname;//当前选择房间地址
                this.selected_room.uname = uname;//当前管理员姓名
                this.selected_room.mobile = mobile;//当前管理员电话

            },
            room_class(roomid){
                if(roomid == this.nowroomid){
                    return { room_on:true };
                }else{
                    return { room_on:false };
                }
            },
            jump_confirm(timeobj){//点击可预约的时间段，跳转到确认页面
                this.$router.push({
                    name:'fdsubscribe_confirm',
                    query:{
                        placeid:this.nowroomid,
                        roomname:this.selected_room.name,//实验室名称
                        displayname:this.selected_room.displayname,//实验室地址
                        uname:this.selected_room.uname,//管理员姓名
                        mobile:this.selected_room.mobile,//电话
                        time:timeobj,//预约时间段
                        learnid:this.$route.query.learnid,
                        learnname:this.$route.query.name,
                        type:this.$route.query.type,
                        originquery:this.$route.query,
                        paramvalue:this.$route.paramvalue
                    }
                })
            },
            show_select(time){//改变选择的时间段的样式
                if( time == this.nowtime ){
                    return { td:true, select_time:true };
                }else{
                    return { td:true };
                }
            },
            isover(status,endtime,index){//判断有没有过期08:00
                var bool = false;
                if( status == 0 && index == 0 ){
                    var _date = new Date();
                    var _hour = parseInt( endtime.split(':')[0] );//时间段的hour
                    var _minute = parseInt( endtime.split(':')[1] );//时间段的minute
                    if ( _date.getHours()*60+_date.getMinutes() >= _hour*60+_minute ){
                        bool = true;
                    }
                }
                return bool;
            }

        }
    }

</script>
<style type="text/css" scoped>
    .block{
        display:block;
    }
    .titleweekday{
        display:block;
        padding-bottom:.1rem;
    }
    .seltimeleftcol{
        text-align:left;
        padding-left:.06rem;
    }
    .fcontentgray{
        color:#A5A5A5;
    }
    .ftitlegray{
        color:#484848;
    }
    .fcontentblue{
        color:#68A6D0;
    }
    .tdblueback{
        background-color:#3399DB;
        color:white;
    }
    .tdgrayback{
        background-color: #CCCCCC;
        color:white;
        border-color: #c3c3c3;
    }
    .pageleftbtn{
        float:left;
        padding-left:.22rem;
    }
    .pagerightbtn{
        float:right;
        padding-right:.22rem;
    }
    .seltimethead{
        overflow:hidden;
        background-color: white;
        padding:.12rem 0;
    }
    .seltimethead li{
        float:left;
        width:12.5%;
        border-bottom:1px solid transparent;
        text-align: center;
        font-size:.20rem;
    }
    .seltimemain{
        position:relative;
        border-bottom:1px solid #E2E2E2;
    }
    .changepagehandlers{
        position:absolute;
        top:0;
        left:0;
        width:100%;
        overflow:hidden;
        padding:.12rem 0;
    }
    .changepagehandlers img{
        vertical-align: bottom;
    }
    .flex{
        display:flex;
    }
    .flex-column{
        display:flex;
        flex-direction: column;
        justify-content: center;
    }
    .timetable{
        text-align: center;
        width:100%;
        margin:0 auto;
        border-color: #D3D3D3;
        font-size:.20rem;
        border-left:none;
        border-right:none;
        background-color: white;
    }
    .timetabletd{
        box-sizing:border-box;
        width:12.5%;
        height:1.1rem;
        /* line-height: 1.1rem; */
        border:solid 1px #c3c3c3;
        border-left:none;
        border-top:none;
        display:flex;
        justify-content: center;
        align-items: center;
        /* -webkit-border:solid .01rem #c3c3c3;  */
    }
    .g-main{
        color:#888888;
    }
    /*表格*/
    .table{
        margin-top:1.4rem; border-right:1px solid #C3C3C3; border-bottom:1px solid #C3C3C3;
         font-size:0.2rem;
    }
    .table,.th,.tr{
        width:100%;
    }
    .td{
        width:calc(100% / 8); float:left;
        text-align:center; height:1rem; border-left:1px solid;
        border-top:1px solid; border-color:#C3C3C3;
    }
    .th .td{
        padding-top:0.2rem; border-right:0px; border-left:0px;
        position: relative;
    }

    .th .td:nth-child(1){
        padding-top:0.3rem; border-right:1px solid; border-color:#C3C3C3;
        color:#333333;
    }
    .tr .td:nth-child(1){
        padding-top:0.1rem;
    }
    .tr .td{
        padding-top:0.2rem;
    }
    .black{
        color:#333333; font-size:0.27rem;
    }

    /*切换教室*/
    .room_outer{
        width: 100%; height: 1.14rem; padding: 0.1rem;
        font-size: 0.25rem;
        background: #f2f2f2;
    }
    .room_outer>img{
        display:block; float:left; cursor:pointer; width:0.3rem; height:0.3rem;
        position:relative; top:50%; margin-top:-0.15rem;
    }
    .room_con{
        margin:auto;
        width:100%; height:100%;
        overflow-x:auto; overflow-y:hidden;
    }
    .room_inner{
        height:100%;
    }
    .room_inner span{
        text-align:center; display:block; float:left; width:1.9rem; margin-left:0.04rem; margin-right:0.04rem;
        border-radius:0.05rem; height:100%; border:1px solid #C3C3C3;
    }
    .room_inner span>h3{
        font-size:0.28rem; font-weight:normal;
    }
    .room_inner span>p{
        font-size:0.20rem;
        margin-top:18%;
    }
    .room_on{
        color:white; background-color:#3499DB; border:1px solid #3499DB;
    }

    .full{
        background-color:#3499db; color:white;
    }
    .not_open{
        background-color:#999; color:white;
    }
    .select_time{/*被选择的时间段*/
        background-color:#6AD969; background-image:url(../../assets/images/icon_selected.png);
        background-repeat:no-repeat; background-size:60%; background-position:50%;
    }
    .appointok{
        width:100%;
        height:100%;
        /*position: absolute;*/
    }
</style>
