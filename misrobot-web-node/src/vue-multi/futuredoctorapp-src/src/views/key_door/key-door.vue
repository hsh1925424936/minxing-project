<template>
    <div>
        <c-header class="header">
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            一键开门
        </c-header>
        <div class="result_d">
            <ul v-for="(item,index) in list">
                <li><template v-if="item.type==2">个人预约：</template>{{item.coursename}}</li>
                <li>地点:{{item.placename}}</li>
                <li>时间:{{ item.starttime | substr(0, 16)}}-{{item.endtime | substr(11, 5)}}</li>
                <li v-if="item.type==1">老师:<span  v-for="(val,index) in item.teachers" class="teacher">{{val.name}}&nbsp;&nbsp;</span></li>
            </ul>
        </div>
        <div class="open">
            <div class="door_btn" @click="viewLab">
                <p>一键开门</p>
            </div>
        </div>
        <c-modal :config="labInfoModal">
            <ul>
                <li class="door_name" v-for="(value,index) in door_list" @click="open(value.door_id,value.door_name,value.door_num,value.doorctrl_sn)">{{value.door_name}}</li>
            </ul>
        </c-modal>
    </div>
</template>

<script>
    var currentWiFi='',designWiFi='';
    import $ from 'jquery';
    import methods from '../../methods';
    import xiefn from '../../vuex/xie';
    import cHeader from '../header';
    import cModal from '../../components/modal';
    import { mapState, mapActions } from 'vuex';
    export default {
        data() {
            return {
                labInfoModal: {
                    show: false,
                    title: '选择你需要打开的门'
                },
                list:[],
                door_list:[],
                role:xiefn.getCookie('role'),
                room: [],
                result_id:"",
                door_id:"",
                door_num:"",
                advancetime:''//提前开门时间
            }
        },
        components: {
            cHeader,
            cModal
        },
        created() {
        },
        mounted () {
            let _this = this;
            this.queryView();
            this.registerToNative('goBack', function (data) {
                if (_this.labInfoModal.show){
                    _this.labInfoModal.show = false;
                }else {
                    _this.back();
                }
            });
        },
        methods: {
            ...methods,
        ...mapActions([
            'showAlert',
            'showConfirm',
            'showLoading',
            'hideLoading',
            'toast'
        ]),
    //    TODO ios||安卓
    confirmWifi(callback){
        if(this.isIOS){//如果是苹果系统，保存登录信息,保存wifi状态
            this.invokeNative('GetWiFiStatus', {'WIFIStatus': 'outSend'}, function (responseData) {
                var rd = JSON.parse(responseData);
                currentWiFi = rd.currentWiFi;
                designWiFi = rd.designWiFi;

                callback && callback()
            });
        } else {
            this.invokeNative('GetWiFiStatus', "GetWiFiStatus", function (responseData) {
                var rd = JSON.parse(responseData);
                currentWiFi = rd.currentWiFi;
                designWiFi = rd.designWiFi;

                callback && callback()
            });
        }
    },
    back(){
        window.location.href='/pages/futuredoctorapp/application.html'
    },
    queryView(){//初始化
        let _this=this;
        this.post('/dooraccesscontrol/findcourselist', {
            command: 'dooraccesscontrol/findcourselist',
            sessionid:$.cookie('sid'),
            uid:$.cookie('uid'),
            loginid:$.cookie('uid'),
        }).done(function (data) {
            _this.advancetime=data.advancetime/60;
            if(data.resultlist.length==0){//未查询到
                _this.$router.push({
                    name: 'fdto_time',
                    query:{
                        advancetime:_this.advancetime
                    }
                });
            }else{
                _this.list=data.resultlist;
                data.resultlist.forEach(function(value,index){
                    _this.room.push({roomnum:value.roomnum});
                });
            }
        });
    },
    viewLab(){
        let _this=this;
        if(_this.role=="0"){//如果是学生需要判断wifi
            _this.confirmWifi(function(){
                if (currentWiFi.length==0||designWiFi.length==0){
                    _this.showAlert("当前使用人数过多，请联系老师或管理员开门。");
                }else if(currentWiFi!==designWiFi){
                    _this.showAlert("请连接指定wifi:"+designWiFi);
                }else{
                    key();
                }
            });

        }else{
            key();
        }
        function key(){
            _this.post('/dooraccesscontrol/appfinddoors', {
                command: 'dooraccesscontrol/appfinddoors',
                sessionid:$.cookie('sid'),
                loginid:$.cookie('uid'),
                roomnums:_this.room
            }).done(function (data) {
                if (data.resultlist.length!==0){
                    if(data.resultlist.length==1){//如果当前课程只有一个门直接请求打开
                        _this.open(data.resultlist[0].door_id,data.resultlist[0].door_name,data.resultlist[0].door_num,data.resultlist[0].doorctrl_sn);
                    }else{//多个门就show
                        _this.door_list=data.resultlist;
                        _this.labInfoModal.show = true;
                    }
                }else{//未配备电子门禁
                    _this.labInfoModal.show = false;
                    _this.showAlert({
                        msg:"当前教室未配备电子门，请联系老师或管理员开门。",
                        ok:function(){
                            window.location.href='/pages/futuredoctorapp/application.html';
                        }
                    });
                }
            })
        }
    },
    open(paramDoorid,parmDoorname,parmDoornum,parmDoorsn){
        let _this=this;
        this.showLoading("loading...");
        this.post('/dooraccesscontrol/appopendoor', {
            command: 'dooraccesscontrol/appopendoor',
            sessionid:$.cookie('sid'),
            loginid:$.cookie('uid'),
            door_id:paramDoorid,
            door_name:parmDoorname,
            door_num:parmDoornum,
            doorctrl_sn:parmDoorsn
        }).done(function (data) {
            if(data.errcode==0){
                _this.hideLoading();
                _this.result_id="0";
                _this.$router.push({
                    name:'fdopen_result',
                    query:{
                        succ_id:_this.result_id,
                        door_name:parmDoorname,
                        door_num:parmDoornum
                    }//请求成功跳转id=0
                });
            }else {
                _this.hideLoading();
                _this.result_id="1";
                _this.$router.push({
                    name:'fdopen_result',query:{succ_id:_this.result_id}//请求失败跳转id=1，操作失败
                });
            }
        }).fail (function() {
                _this.hideLoading();
                _this.result_id="2";
                _this.$router.push({
                    name:'fdopen_result',query:{succ_id:_this.result_id}//请求失败跳转id=2，网络问题
                });
            }
        );
    }
    }
    }
</script>
<style lang="scss">
    .result_d {
        padding-bottom: 4rem;
    ul {
        background:#fff;
        padding:0.3rem;
        margin-bottom:0.1rem;
    li {
        text-align: left;
        line-height:0.5rem;
        font-size:0.3rem;
        color: #888;
    span.teacher {
        color: #888;
    }
    }
    :nth-child(1) {
        color: #000;
    }
    }
    }
    .open {
        background: #eee;
        width:100%;
        position: fixed;
        bottom:0;
    .door_btn {
        width:2rem;
        height:2rem;
        margin:1rem auto;
        color:#fff;
        background: url("../../assets/images/signbtns.png") 0 0 no-repeat;
        background-size: cover;
    p {
        display: inline-block;
        position: relative;
        top: 50%;
        left:50%;
        transform: translate(-50%,-50%);
        font-size: 0.35rem;
    }
    }
    }
    li.door_name {
        line-height:0.7rem;
        text-align: center;
        border-bottom: 1px solid #999;
    }
</style>
