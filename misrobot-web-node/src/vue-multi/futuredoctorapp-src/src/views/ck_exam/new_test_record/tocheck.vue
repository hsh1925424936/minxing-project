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
            </dl>
            <p class="xiebottomHandlers">
                <span class="xiebtn xiebtn-yellow" @click="open_shadow_cancel(value.examid)">取消预约</span>
                <span class="xiebtn xiebtn-default" @click="showDetail(value.examid)">预约详情</span>
            </p>
        </div>
        <div class="shadow" v-show="isShadow">
            <div class="xieconfirmBox" v-show="cancelBox">
                <p class="xieconfirmText">
                    确定取消您的预约吗？
                </p>
                <div class="xieconfirmContent">
                    <textarea name="" id="" cols="30" rows="10" placeholder="请输入取消的原因" class="areaStyle" id="whycancel"></textarea>
                </div>
                <p class="xiebottomHandlers" style="padding-right:20px">
                    <button class="btn btn-white right" @click="closeShadow()" style="margin-left:20px;">放弃</button>
                    <button class="btn btn-blue right" @click="cancelAppoint()">确认</button>
                </p>
            </div>
        </div>
        <no-content v-show="toCheckList.length==0"></no-content>
        <c-modal :config="detailModal1">
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
                        <span style="width:36%">报名截止:</span>
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
                detailModal1:{
                    show: false,
                    title: '查看预约详情',
                    hideOnClickOut: true
                },
                toCheckList:[],
                placeid:'',
                starttime:'',
                endtime:'',
                detailexamid:'',
                cancelexamid:''
            }
        },
        mounted() {
            var self = this
            this.registerToNative('goBack', function (data) {
                if(self.detailModal1.show){
                    self.detailModal1.show=false
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
                    console.log('reloaddatatocheck')
                    // 刷新
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
        showDetail:function(examid){
            this.detailModal1.show=true
            this.detailexamid=examid
        },
        queryAppoint:function(){//查询预约接口
            var self=this;
            var param={
                command:'examapply/queryexamapplybystatus',
                sessionid:xieFn.getCookie('sid'),
                loginid:xieFn.getCookie('uid'),
                status:1,//0：审核通过，1：待审核，2，审核不通过，3，取消,4已考
                teacherid:xieFn.getCookie('uid')
            }
            self.post('/examapply/queryexamapplybystatus',param).done(function(res){
                if(res.errcode==0){
                    self.toCheckList=res.examlist;
                }else{
                    self.toast(res.errdesc)
                }
            }).fail(function(){
                self.toast('连接服务失败，请稍后再试')
            })
        },
        cancelAppoint:function(){
            if(!$('#whycancel').val()){
                this.toast('请输入取消预约的原因')
                return
            }
            var self=this;
            var param={//取消预约接口
                command:'examapply/cancelexamapply',
                sessionid:xieFn.getCookie('sid'),
                loginid:xieFn.getCookie('uid'),
                examid:this.cancelexamid,
                auditcomment:$('#whycancel').val()
            };
            self.post('/examapply/cancelexamapply',param).done(function(res){
                if(res.errcode==0){
                    self.toast('已为您取消预约')
                    self.isShadow=false
                    self.cancelBox=false
                    $('#whycancel').val('')
                    self.queryAppoint()
                }else{
                    self.toast(res.errdesc)
                }
            }).fail(function(){
                self.toast('连接服务失败，请稍后再试')
            })
        },
        open_shadow_cancel:function(paramexamid){
            this.isShadow=true;
            this.cancelBox=true;
            this.cancelexamid=paramexamid;
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
