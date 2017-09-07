<template>
    <div>
        <div class="xiecontentBox" v-for="(value,index) in finishedList" style="padding-bottom:.20rem">
            <dl>
                <dd>
                    <span>实验室名称&ensp;&nbsp;:</span>
                    <b>{{ value.pname }}</b>
                </dd>
                <dd>
                    <span>实验室地址&ensp;&nbsp;:</span>
                    <b>{{ value.displayname }}</b>
                </dd>
                <dd>
                    <span>管&emsp;理&emsp;员&ensp;&nbsp;:</span>
                    <b>{{ value.uname }} {{ value.mobile }}</b>
                </dd>
                <dd>
                    <span>训练项名称&ensp;&nbsp;: </span>
                    <b>
                        <i v-for="(value2,index2) in finishedList[index].learnlist">{{ value2.learnname }}&nbsp;&nbsp;</i>
                    </b>
                </dd>
                <dd>
                    <span>预 约 人 数&emsp;:</span>
                    <b>{{ value.stunum }}</b>
                </dd>
                <dd>
                    <span>预 约 时 段&emsp;:</span>
                    <b>{{ value.starttime | substr(0, 16)}}-{{value.endtime | substr(11, 5)}}</b>
                </dd>
                <dd>
                    <span>备 注 说 明&emsp;:</span>
                    <b>{{ value.comment }}</b>
                </dd>
                <dd>
                    <span>审 批 意 见&emsp;:</span>
                    <b>{{ value.description }}</b>
                </dd>
            </dl>
        </div>
        <no-content v-show="finishedList.length==0"></no-content>
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
                finishedList:''
            }
        },
        mounted() {
            var self=this;
            (function(){//我的预约查询接口
                var param={
                    command:'learn/queryapplyinfobystatus',
                    sessionid:xieFn.getCookie('sid'),
                    loginid:xieFn.getCookie('uid'),
                    status:4,//0：待审批，1：待训练，2，不通过，3，取消,4已结束
                    teacherid:xieFn.getCookie('uid')
                }
                self.post('/learn/queryapplyinfobystatus',param).done(function(res){
                    if(res.errcode==0){
                        self.finishedList=res.applylist;
                    }else{
                        self.toast(res.errdesc)
                    }
                }).fail(function(){
                    self.toast('连接服务失败，请稍后再试')
                })
            })()
        },
        methods:{
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            ...methods
        },
        components:{
            noContent
        }
    }
</script>
<style>
    @import "../../../scss/my.css"
</style>
