<template>
    <div>
        <div class="xiecontentBox" v-for="(value,index) in toCheckList">
            <dl>
                <dd>
                    <span>技能项 : </span>
                    <b>{{ value.learnname }}</b>
                </dd>
                <dd>
                    <span>考试地点 : </span>
                    <b v-if="value.placeid!=-1">{{ value.displayname }}</b>
                    <b v-if="value.placeid==-1">{{ value.placeinfo }}</b>
                </dd>
                <dd>
                    <span>考试时间 : </span>
                    <b>{{ value.starttime.slice(0,16)}}~{{ value.endtime.slice(11,16) }}</b>
                </dd>
                <dd>
                    <span>已报名人数 : </span>
                    <b>{{ value.stunum }}</b>
                </dd>
                <dd>
                    <span>取消原因 : </span>
                    <b>{{ value.auditcomment }}</b>
                </dd>
            </dl>
            <p class="xiebottomHandlers">
                <span class="xiebtn xiebtn-default" @click="showDetail(value.examid)">预约详情</span>
            </p>
        </div>
        <no-content v-show="toCheckList.length==0"></no-content>
        <c-modal :config="detailModal3">
            <div class="xiecontentBox m0" v-for="(value,index) in toCheckList" v-show="value.examid==detailexamid">
                <dl>
                    <dd>
                        <span style="width:36%">技能项 : </span>
                        <b style="width:64%">{{ value.learnname }}</b>
                    </dd>
                    <dd>
                        <span style="width:36%">考试地点 : </span>
                        <b v-if="value.placeid!=-1" style="width:64%">{{ value.displayname }}</b>
                        <b v-if="value.placeid==-1" style="width:64%">{{ value.placeinfo }}</b>
                    </dd>
                    <dd>
                        <span style="width:36%">考试时间 : </span>
                        <b style="width:64%">{{ value.starttime.slice(0,16)}}~{{ value.endtime.slice(11,16) }}</b>
                    </dd>
                    <dd>
                        <span style="width:36%">报名截止 : </span>
                        <b style="width:64%">{{ value.joinlasttime.slice(0,16) }}</b>
                    </dd>
                    <dd>
                        <span style="width:36%">人数上限 : </span>
                        <b style="width:64%">{{ value.volumemax }}</b>
                    </dd>
                    <dd>
                        <span style="width:36%">备注 : </span>
                        <b style="width:64%">{{ value.comment }}</b>
                    </dd>
                    <dd>
                        <span style="width:36%">取消原因 : </span>
                        <b style="width:64%">{{ value.auditcomment }}</b>
                    </dd>
                </dl>
            </div>
        </c-modal>
    </div>
</template>
<script>
    import xieFn from '../../../vuex/xie'
    import { mapState, mapActions } from 'vuex'
    import noContent from '../../no_content.vue'
    import cModal from '../../../components/modal'
    import methods from '../../../methods'
    import Vue from 'vue'
    let bus = new Vue()
    export default {
        props: ['active'],//切换tab刷新
        data() {
            return {
                isShadow:false,
                cancelBox:false,
                detailModal3:{
                    show: false,
                    title: '查看预约详情',
                    hideOnClickOut: true
                },
                toCheckList:[],
                detailexamid:'',
                placeid:'',
                starttime:'',
                endtime:''
            }
        },
        mounted() {
            var self = this
            this.registerToNative('goBack', function (data){
                if(self.detailModal3.show){
                    self.detailModal3.show=false
                }else{
                    window.location.href='/pages/futuredoctorapp/application.html'
                }
            })
            self.queryAppoint();
        },
        components:{
            noContent,
            cModal
        },
        watch: {
            'active': function(val, oldVal){

                if(val) {
                    // 刷新
                    console.log('reloaddatacanceled')
                    this.queryAppoint()
                }
            }
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
        showDetail:function(paramexamid){
            this.detailModal3.show=true
            this.detailexamid=paramexamid
        },
        queryAppoint:function(){//查询预约接口
            var self=this;
            var param={
                command:'examapply/queryexamapplybystatus',
                sessionid:xieFn.getCookie('sid'),
                loginid:xieFn.getCookie('uid'),
                status:8,//0：审核通过，1：待审核，2，审核不通过，3，取消,4已考,8:已取消+审核不通过
                teacherid:xieFn.getCookie('uid')
            }
            self.post('/examapply/queryexamapplybystatus',param).done(function(res){
                if(res.errcode==0){
                    self.toCheckList=res.examlist
                }else{
                    self.toast(res.errdesc)
                }
            }).fail(function(){
                self.toast('连接服务失败，请稍后再试')
            })
        }
    }
    }
</script>
<style>
    @import "../../../scss/my.css"
</style>
