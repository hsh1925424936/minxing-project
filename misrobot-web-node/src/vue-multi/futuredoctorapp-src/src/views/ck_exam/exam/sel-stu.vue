<template>
    <div class="ck-exam-selstu g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            选择考生
        </c-header>
        <div class="g-main">
            <div class="exam-info">
                <p>考试科目：{{examInfo.learnname}}</p>
                <p>考官姓名：{{examInfo.teachername}}</p>
                <p>考试时间：{{examInfo.starttime | date}}</p>
                <p>考试场地：<span v-show="examInfo.placeid!=-1">{{examInfo.displayname}}</span><span v-show="examInfo.placeid==-1">{{examInfo.placeinfo}}</span></p>
            </div>
            <div class="list list-cut stu-list">
                <div class="item item-valign-center title" style="margin-left: 0;padding-left: 0.24rem;">
                    选择考生
                </div>
                <template v-for="it in stulist">
                    <a class="item valign-center"
                       :class="{
                            'already-done': it.status === 4
                       }" @click="selStu(it)">
                        <i class="iconfont icon-clock"></i>
                        <div class="auto-width">
                            <p>{{it.stuname}}</p>
                            <!--<p class="addr">{{it.pname}}</p>-->
                        </div>
                        <template v-if="it.status === 0">
                            <img class="right-icon" src="../../../assets/images/icon_xiangyou.png" />
                        </template>
                        <template v-if="it.status === 4">已考</template>
                    </a>
                </template>
            </div>
        </div>
         <div class="padding">
                <a class="btn btn-lg btn-white btn-block" @click="examEnd()">考试结束</a>
                <p class="tip">如考生均未到场，也请你点击“考试结束”按钮，否则无法收集您的到场信息，谢谢</p>
         </div>
    </div>
</template>

<script>

import $ from 'jquery';
import methods from '../../../methods';
import cHeader from '../../header';

import { mapState, mapActions } from 'vuex';

export default {
    data() {
        return {
            stulist: [],
            examInfo: {},
            loading: 0
        }
    },
    components: {
        cHeader
    },
    filters:{
        date(value){
            if(value){
                return value.substr(0,16)
            }
        }
    },
    created() {},
    mounted () {

        let self = this;
        this.examid = this.$route.query.examid;

        this.registerToNative('ckStuRefresh', function (data) {
            // console.log(data);
            self.init()
        });

        this.registerToNative('goBack', function (data) {
            self.back();
        });

        if(!this.examid) {
            this.toast('请先选择考试！');
            this.back();
            return;
        }

        this.init();
    },
    /*computed: mapState([
        'loginUser'
    ]),*/
    methods: {
        ...mapActions([
            'showAlert',
            'showConfirm',
            'showLoading',
            'hideLoading',
            'toast'
        ]),
        ...methods,
        back() {
            this.$router.push({
                name: 'fdCkExamExamMy'
            });
        },
        init(){
            let self = this;

            this.post('/examapply/selectstuforexam', {
                command: "examapply/selectstuforexam",
                sessionid: $.cookie('sid'),
                loginid: $.cookie('uid'),
                examid: this.examid
            }).done(function(data){
                self.examInfo = data && data.examinfo;
                self.stulist = (self.examInfo && self.examInfo.studentlist) || [];
                self.loading = 1;
            }).fail(function () {
                self.loading = 2;
            });
        },
        selStu(stu){

            if(!stu) {
                return;
            }
            if(stu.status != 0) {
                return;
            }

            this.invokeNative('IntentMarkGradeActivity', {
                examineeid: stu.stuid,
                examid: this.examInfo.examid,
                placeid: this.examInfo.placeid,
                placeroomnum: this.examInfo.placeroomnum,
                dispalyname: this.examInfo.displayname,
                examinerid: this.examInfo.teacherid,
                scoresheetcode: this.examInfo.scoresheetcode,
                scoretype: 1,
                learnid: this.examInfo.learnid,
                learnname: this.examInfo.learnname,
                stuname: stu.stuname
            });
        },
        examEndSubmit() {

            let self = this;
            this.toast('考试提交。。。');

            this.post('/examapply/updateexamstatusforend', {
                command: 'examapply/updateexamstatusforend',
                sessionid: $.cookie('sid'),
                loginid: $.cookie('uid'),
                examid: self.examid
            }).done(function (data) {
                if(data && data.errcode == 0 ) {
                    self.toast('提交成功！');
                    self.back();
                } else {
                    self.toast('提交失败，请稍后再试！');
                }
            }).fail(function (data) {
                self.toast('提交失败，请稍后再试！');
            });
        },
        examEnd(){

            let self = this;
            let namelist = [];

            (this.stulist || []).forEach(it => {
                if(+it.status === 0) {
                    namelist.push(it.stuname);
                }
            });

            if(namelist.length) {
                this.showConfirm({
                    title: '考生缺考确认',
                    msg: `老师您好，我们发现本次考试有${namelist.length}位考生的成绩未提交。`+
                         `姓名是：${namelist.join('、')}，确认${namelist.length}位同学缺考么？`,
                    theme: 'modal-confirm modal-white',
                    okLabel: '确认缺考',
                    okTheme: 'color-red',
                    ok: function () {
                        self.examEndSubmit();
                    },
                    cancel: function () {}
                });
            } else {
                self.examEndSubmit();
            }
        }
    }
}

</script>
<style lang="scss">

    @import "../../../scss/variables.scss";

    .ck-exam-selstu {
        .exam-info{
            background: $blue;
            padding: .25rem;
            margin-bottom: .3rem;
            color: $white;

            p{
                line-height:1.5;
                font-size: $font-size-xm;
                font-weight:normal;

                &:last-child{
                    margin-bottom:0;
                }
            }
        }
        .list.stu-list{
            border-top:none;

            .title{
                font-size:$font-size-md;
            }
            .right-icon{
                width:.15rem;
            }

            p{
                font-size:$font-size-xm;
                color:$gray;

                &:last-child{
                    margin-bottom: 0;
                }
            }

            .already-done{
                color: $gray-lighter;

                p{
                    color: $gray-lighter;
                }
            }
        }

        .tip{
            font-size:$font-size-xs;
            color: $gray-lighter;
            margin-top:.22rem;
            line-height: 1.2;
        }
    }

</style>
