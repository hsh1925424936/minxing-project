<template>
    <div class="booking-lab-sel g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            {{ placename }}
            <div slot="headerRight">
                <span class="my-booking-btn" @click="forward()">下一步</span>
            </div>
        </c-header>
        <p class="promptmsg">
            如没空余时段，可选其他老师已预约的时段一起上课。
        </p>
        <div class="seltimemain">
            <div class="changepagehandlers">
                <span class="pageleftbtn" v-show="week>1" @click="seltimeprevpage()"><img src="../../../assets/images/btn_left.png" alt=""></span>
                <span class="pagerightbtn" v-show="week<totalweek" @click="seltimenextpage()"><img src="../../../assets/images/btn_right.png" alt=""></span>
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
                    <div v-for="(value3,index3) in timeslist[index2].applylist" :class="{'tdblueback':value3.roomstatus==2 || value3.roomstatus==3 || value3.roomstatus==5 || (value3.roomstatus==1 && value3.count==value3.size),'tdgrayback':value3.roomstatus==4 || value3.flag=='past'}" class="timetabletd">
                        <span v-if="value3.flag=='past'">已过期</span>
                        <span v-else-if='value3.roomstatus==2'>个人预约</span>
                        <span v-else-if='value3.roomstatus==3'>考试</span>
                        <span v-else-if='value3.roomstatus==4'>未开放</span>
                        <span v-else-if='value3.roomstatus==5 || (value3.roomstatus==1 && value3.count==value3.size)'>已约满</span>
                        <div v-else-if="value3.roomstatus==1 && value3.count!=value3.size" @click="joinprevcourse(value3)">
                            <p>
                                <span v-for="(value4,index4) in value3.learnlist" v-show="index4==0">{{ value4.learnname | txtlimit }}</span>
                            </p>
                            <span class="fcontentblue">{{ value3.count }}</span>
                            <span>/{{ value3.size }}</span>
                        </div>
                        <input v-else-if='value3.roomstatus==0' type='checkbox' v-model='selecttimes' :value='value3' class='seltime_timecheckbox' />
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery'
    import methods from '../../../methods'
    import cHeader from '../../header.vue'
    import { mapState, mapActions } from 'vuex'
    import xieFn from '../../../vuex/xie'
    export default {
        data() {
            return {
                timeslist: [],//每周预约时间信息数组
                placename:xieFn.getCookie('selLabPlaceName'),
                placeid:xieFn.getCookie('selLabPlaceId'),
                isChoosed:false,
                selecttimes:[],
                day:[],
                week:1,//页面加载直接看第一周
                totalweek:2,//后台返回，最多看几周后的信息
            }
        },
        components: {
            cHeader,
        },
        filters: {
            daytoweek: function (oldvalue) {//把日期转换成周几
                var newvalue=xieFn.whichday(oldvalue)
                return newvalue
            },
            txtlimit:function(oldvalue){//限制表格中显示的字数，最多5个字
                var num=oldvalue.length
                var newvalue=''
                if(num>5){
                    newvalue=oldvalue.slice(0,5)+'..'
                    return newvalue
                }else{
                    return oldvalue
                }
            }
        },
        created() {
            this.getTable(this.week)//默认加载第一周
        },
        mounted () {
            var self = this
            this.registerToNative('goBack', function (data) {
                self.back()
            })
            this.initscroll()//开始监听左右滚动
        },
        updated :function(){
            var tdwidth=$('.timetable td').width()
            $('.timetable td').each(function(){
                $(this).height(tdwidth*1.6)
            })
        },
        methods: {
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
        ...methods,
            back:function(){
                this.$router.push({
                    name: 'fdCreateSelLab',
                    query: ''
                })
            },
            forward: function () {
                if(this.selecttimes.length==0){//用户是否选择了时间
                    this.toast('请选择预约时间')
                    return
                }
                this.isTimeLegal()//用户选择的时间是否连续，是否在一天内
            },
            seltimenextpage:function(){//跳转下一页
                this.week++
                this.getTable(this.week)
            },
            seltimeprevpage:function(){//跳转上一页
                this.week--
                this.getTable(this.week)
            },
            getTable:function(pagenum){//获取表格内容
                var self=this
                var param = {
                    command: 'learn/listclassbooking',
                    loginid: xieFn.getCookie('uid'),
                    placeid: self.placeid,
                    sessionid: xieFn.getCookie('sid'),
                    page:pagenum
                }
                self.post('/learn/listclassbooking', param).done(function (res) {
                    if(res.errcode==0){
                        console.log(JSON.stringify(res))
                        self.totalweek=res.totalWeek
                        self.timeslist=res.schedulelist
                        self.day=res.schedulelist[0].applylist
                        for(var i=0;i<self.timeslist.length;i++){
                            for(var j=0;j<self.timeslist[i].applylist.length;j++){
                                self.timeslist[i].applylist[j].starttime=self.timeslist[i].starttime
                                self.timeslist[i].applylist[j].endtime=self.timeslist[i].endtime
                                self.timeslist[i].applylist[j].flag=xieFn.comparenowtime(self.timeslist[i].applylist[j].day.slice(0,11)+self.timeslist[i].starttime)
                            }
                        }
                    }else{
                        self.toast(res.errdesc)
                    }
                }).fail(function () {
                    self.toast('连接服务失败，请稍后再试。')
                })
            },
            isTimeLegal:function(){//选择的时间是否合法
                var self=this
                if(self.selecttimes.length==1){//如果只选了一个时段，直接跳转到保存预约页面，不需要判断合并
                    this.$router.push({
                        name: 'fdCreateSubmitfirst',
                        query: {
                            selecttimes:self.selecttimes
                        }
                    })
                }else{//如果选择了2个以上时段，先判断是否跨天，同一天内再判断是否可以合并
                    var starttimearr=[]//判断用户选的时间是否跨天
                    self.selecttimes.forEach(function(value){
                        starttimearr.push(value.day.slice(0,11))
                    })
                    var sortarr=starttimearr.sort()
                    for(var i=0;i<sortarr.length-1;i++){
                        if(sortarr[i]!=sortarr[i+1]){
                            self.toast('只能预约一天内的课程，不可跨天')
                            return
                        }
                    }//判断用户选的时间是否跨天
                    var temp=[]
                    self.selecttimes.forEach(function(value){
                        temp.push({
                            starttime:value.day.slice(0,11)+''+value.starttime,
                            endtime:value.day.slice(0,11)+''+value.endtime
                        })
                    })
                    temp=xieFn.timelistsort(temp)
                    var param={
                        command:'learn/isschedulemerge',
                        loginid:xieFn.getCookie('uid'),
                        sessionid:xieFn.getCookie('sid'),
                        timelist:temp//starttime,endtime
                    }
                    self.post('/learn/isschedulemerge', param).done(function (res) {
                        if(res.errcode==0){
                            self.$router.push({
                                name: 'fdCreateSubmitfirst',
                                query: {
                                    selecttimes:self.selecttimes
                                }
                            })
                        }else{
                            self.toast(res.errdesc)
                        }
                    }).fail(function () {
                        self.toast('连接服务失败，请稍后再试。')
                    })
                }
            },
            initscroll:function(){//监听滑动事件
                var sw=document.body.clientWidth//页面宽度
                var self=this
                var startxpos=''
                var endxpos=''
                var area=document.getElementById('appointtimetable')
                area.addEventListener('touchstart',function(e){
                    var touch = e.targetTouches[0]
                    startxpos=touch.clientX
                })
                area.addEventListener('touchmove',function(e){
                    var touch = e.targetTouches[0]
                    endxpos=touch.clientX
                })
                area.addEventListener('touchend',function(e){
                    if(endxpos!=''){//如果touchmove了
                        if(startxpos-endxpos>=0){//用户向左滑,self. week++
                            if((startxpos-endxpos)/sw>=0.6){//滑动距离超过1/2屏
                                if(self.week<=(self.totalweek-1)){
                                    self.week++
                                    self.getTable(self.week)
                                    startxpos=''
                                    endxpos=''
                                }else{
                                    self.toast('没有更多记录')
                                    startxpos=''
                                    endxpos=''
                                }
                            }else{
                                startxpos=''
                                endxpos=''
                            }
                        }else{//用户向右滑，self.week--
                            if((endxpos-startxpos)/sw>=0.6){//滑动距离超过1/2屏
                                if(self.week>=2){
                                    self.week--
                                    self.getTable(self.week)
                                    startxpos=''
                                    endxpos=''
                                }else{
                                    self.toast('没有更多记录')
                                    startxpos=''
                                    endxpos=''
                                }
                            }else{
                                startxpos=''
                                endxpos=''
                            }
                        }
                    }
                })
            },
            joinprevcourse:function(obj){//加入前一个老师的课程
                xieFn.setCookie('sellabOrderid',obj.orderid)
                xieFn.setCookie('sellabScheduleid',obj.scheduleid)
                this.$router.push({
                    name: 'fdCreateJoinCourse',
                    query:''
                })
            }
        }
    }

</script>
<style lang="scss">
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
    /* .timetable tbody tr{
        border:solid .01rem #c3c3c3;
    } */
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
        /* -webkit-border:solid .01rem #c3c3c3; */
    }
    .promptmsg{
        background-color: #FEEDD3;
        color:#7E7163;
        margin:0;
        padding:.16rem .24rem;
        font-size:.22rem;
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
    .seltimemain{
        position:relative;
        border-bottom:1px solid #E2E2E2;
    }
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
    .seltime_timecheckbox {
        width: 100%;
        height: 100%;
        background-clip: content-box;
        display: block;
        -webkit-appearance: none;
        user-select: none;
        outline: none;
        border:none;
        border-radius:0;
    }
    .seltime_timecheckbox:checked {
        background-image: url('../../../assets/images/icon_selected.png');
        background-size: 70%;
        background-color:#6BD969 ;
        background-repeat: no-repeat;
        background-position: center;
        border-radius: 0;
    }
    .changepagehandlers img{
        height:.64rem;
    }
</style>
