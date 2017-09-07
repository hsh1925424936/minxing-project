<template>
    <div>
        <div class="test">
            <ul v-for="item in items">
                <li><span>技能项：</span>{{item.name}}</li>
                <li><span>考试时间：</span>{{item.starttime | substr(0, 16)}}-{{item.endtime | substr(11, 5)}}</li>
                <li><span>考试地点：</span>{{item.placeinfo}}</li>
                <li class="detail"><a @click="openBox(item.examid)">取消报名</a></li>
            </ul>
        </div>
        <c-modal :config="labInfoModal" class="reason-box">
            <p>请填写取消原因:</p>
            <textarea v-model="reason" id="reason"></textarea>
            <template slot="buttons">
                <button class="btn" @click="confirm">确定</button>
                <button class="btn" @click="close">取消</button>
            </template>
        </c-modal>
        <no-content v-show="items.length==0"></no-content>
    </div>
</template>
<script>
    import Vue from 'vue';
    import $ from 'jquery';
    import methods from '../../../methods';
    import xiefn from '../../../vuex/xie';
    import cModal from '../../../components/modal';
    import { mapState, mapActions } from 'vuex';
    import noContent from '../../no_content.vue';
    let bus = new Vue();
    export default {
        props: ['active'],
        data() {
            return {
                items:[],
                reason:'',
                labInfoModal: {
                    show: false,
                    title: '取消报名',
                    theme: 'modal-confirm modal-white'
                },
                id:''
            }
        },
        components: {
            cModal,
            noContent
        },
        created() {

        },
        mounted () {
            this.query();
            let _this=this;
            this.registerToNative('goBack', function (data) {
                if(_this.labInfoModal.show){
                    _this.labInfoModal.show=false
                }else{
                    window.location.href='/pages/futuredoctorapp/application.html'
                }
            });
        },
        watch: {
            'active': function(val, oldVal){

                if(val) {
                    // 刷新
                    this.query();
                }
            }
        },
        methods:{
            ...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            query(){
                let _this=this;
                this.post('/ckexamapply/ckexamlist', {
                    command: 'ckexamapply/ckexamlist',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    uid: $.cookie('uid'),
                    status:0
                }).done(function (data) {
                    _this.items=JSON.parse(data.ckexamlist);
                });
            },
            openBox(exaid){
                this.labInfoModal.show = true;
                this.id=exaid;
            },
            close(){
                this.labInfoModal.show = false;
                this.id=[];
            },
            confirm(){
                let _this=this;
                if (_this.reason==""){
                    this.toast('未填写取消理由');
                }else{
                    this.post('/ckexamapply/cancelenroll', {
                        command: 'ckexamapply/cancelenroll',
                        sessionid: $.cookie('sid'),
                        loginid: $.cookie('uid'),
                        uid: $.cookie('uid'),
                        examid:_this.id,
                        comment:_this.reason
                    }).done(function (data) {
                        _this.toast('取消成功');
                        _this.query();
                        _this.close();
                    });
                }
            }
        }
    }
</script>
<style lang="scss">
    @import "../../../scss/studentTest.css";
    .reason-box .modal-dialog {
          bottom:5rem;
      }
    #reason {
        border:1px solid #000;
        border-radius: 0.1rem;
        width:100%;
        height:1rem;
        padding:0.1rem;
    }
</style>
