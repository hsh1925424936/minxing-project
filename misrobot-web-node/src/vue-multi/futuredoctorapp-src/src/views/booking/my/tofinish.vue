<template>
    <div>
        <div class="xiecontentBox" v-for="(value,index) in toFinishList">
            <dl>
                <dd>
                    <span>实验室名称&ensp;&nbsp;: </span>
                    <b>{{ value.pname }}</b>
                </dd>
                <dd>
                    <span>实验室地址&ensp;&nbsp;: </span>
                    <b>{{ value.displayname }}</b>
                </dd>
                <dd>
                    <span>管&emsp;理&emsp;员&ensp;&nbsp;:</span>
                    <b>{{ value.uname }} {{ value.mobile }}</b>
                </dd>
                <dd>
                    <span>训练项名称&ensp;&nbsp;: </span>
                    <b>
                        <i v-for="(value2,index2) in toFinishList[index].learnlist">{{ value2.learnname }}&nbsp;&nbsp;</i>
                    </b>
                </dd>
                <dd>
                    <span>预 约 人 数&emsp;: </span>
                    <b>{{ value.stunum }}</b>
                </dd>
                <dd>
                    <span>预 约 时 段&emsp;: </span>
                    <b>{{ value.starttime | substr(0, 16)}}-{{value.endtime | substr(11, 5)}}</b>
                </dd>
                <dd>
                    <span>备 注 说 明&emsp;: </span>
                    <b>{{ value.comment }}</b>
                </dd>
                <dd>
                    <span>审 批 意 见&emsp;: </span>
                    <b>{{ value.description }}</b>
                </dd>
            </dl>
            <p class="xiebottomHandlers">
                <span class="xiebtn xiebtn-yellow" @click="open_shadow_cancel(value.scheduleid)">取消预约</span>&nbsp;
            </p>
        </div>
        <div class="shadow" v-show="isShadow">
            <div class="xieconfirmBox" v-show="cancelBox">
                <p class="xieconfirmText">
                    确定取消您的预约吗？
                </p>
                <p class="xiebottomHandlers" style="border:none;padding-right:20px;padding-top:0;">
                    <button class="btn btn-white right" @click="closeShadow()" style="margin-left:20px;">放弃</button>
                    <button class="btn btn-blue right" @click="cancelAppoint()">确认</button>
                </p>
            </div>
        </div>
        <no-content v-show="toFinishList.length==0"></no-content>
    </div>
</template>
<script>
    import xieFn from '../../../vuex/xie';
    import { mapState, mapActions } from 'vuex';
    import noContent from '../../no_content.vue';
    import methods from '../../../methods'
    export default {
        data() {
            return {
                isShadow:false,
                cancelBox:false,
                toFinishList:'',
                scheduleid:'',
                placeid:'',
                starttime:'',
                endtime:''
            }
        },
        mounted() {
            this.queryAppoint()
        },
        components:{
            noContent
        },
        methods:{
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
        ...methods,
            queryAppoint:function(){//查询预约接口
                var self=this;
                var param={
                    command:'learn/queryapplyinfobystatus',
                    sessionid:xieFn.getCookie('sid'),
                    loginid:xieFn.getCookie('uid'),
                    status:1,//0：待审批，1：待训练，2，不通过，3，取消
                    teacherid:xieFn.getCookie('uid')
                }
                self.post('/learn/queryapplyinfobystatus',param).done(function(res){
                    if(res.errcode==0){
                        self.toFinishList=res.applylist;
                    }else{
                        self.toast(res.errdesc)
                    }
                }).fail(function(){
                    self.toast('连接服务失败，请稍后再试')
                })
            },
            cancelAppoint:function(){
               var self=this;
               var param={//取消预约接口
                   command:'learn/cancelapplybyteacher',
                   sessionid:xieFn.getCookie('sid'),
                   loginid:xieFn.getCookie('uid'),
                   scheduleid:this.scheduleid
               }
                self.post('/learn/cancelapplybyteacher',param).done(function(res){
                    if(res.errcode==0){
                        self.toast('已为您取消预约');
                        self.isShadow=false;
                        self.cancelBox=false;
                        self.queryAppoint();
                    }else{
                        self.toast(res.errdesc)
                    }
                }).fail(function(){
                    self.toast('连接服务失败，请稍后再试')
                })
            },
            open_shadow_cancel:function(paramScheduleid){
                this.isShadow=true;
                this.cancelBox=true;
                this.scheduleid=paramScheduleid;
            },
            closeShadow:function(){
                this.isShadow=false;
                this.cancelBox=false;
            }
        }
    }
</script>
<style>
    @import "../../../scss/my.css"
</style>
