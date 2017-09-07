<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            出科考试
            <div slot="headerRight">
                <router-link :to="{name: 'fdscorequery'}"
                             class="my-booking-btn">成绩查询</router-link>
            </div>
        </c-header>
        <c-tabs :bus="bus" className="" @change-tab="changeTab">
            <c-tab title="全部考试" active=true data="all" :bus="bus"></c-tab>
            <c-tab title="尚未开始" data="notbegin" :bus="bus"></c-tab>
            <c-tab title="已考" data="end" :bus="bus"></c-tab>
            <c-tab title="缺考" data="miss" :bus="bus"></c-tab>
        </c-tabs>

        <div class="my-exam-list g-main">
            <template v-for="it in list">
                <div class="item"
                     v-if="currentTab === 'all' ||
                          (currentTab === 'notbegin' && it.status == 1 ) ||
                          (currentTab === 'miss' && it.status == 2 ) ||
                          (currentTab === 'end' && it.status == 3 )"
                    :class="{
                        'my-exam-executing': it.status === 0,
                        'my-exam-notbegin': it.status === 1,
                        'my-exam-end': it.status === 3,
                        'my-exam-miss': it.status == 2
                    }"
                    @click="toSelStu(it)">
                    <p><label>考试科目：</label>{{it.learnname}}</p>
                    <p><label>考试时间：</label>{{it.starttime.slice(0,16)}}</p>
                    <p><label>考试场地：</label><template v-if="it.placeid == -1">{{it.placeinfo}}</template><template v-else>{{it.displayname}}</template></p>
                    <p><label>考生姓名：</label>{{it.studentlist | showName}}</p>
                </div>
            </template>
        </div>
    </div>
</template>

<script>

    import Vue from 'vue';
    import $ from 'jquery';
    import methods from '../../../methods';
    import cHeader from '../../header.vue';
    import cTabs from "../../../components/tabs";
    import cTab from "../../../components/tab";

    import { mapState, mapActions } from 'vuex';

    let bus = new Vue();

    export default {
        data() {
            return {
                bus: bus,
                currentTab: null,
                page: 1,
                status: -1,  // 0-考试进行中，1-未开始，2-缺考，3-已考
                hasMore: true,
                list: []
            }
        },
        components: {
            cHeader,
            cTabs,
            cTab
        },
        created() {},
        mounted () {
            let self = this;
            this.init();
            this.registerToNative('goBack', function (data) {
                self.back();
            });
        },
        /*computed: mapState([
         'loginUser'
         ]),*/
        filters: {
            showName: function (arr) {
                let namelist = [];

                (arr || []).forEach(it => {
                    namelist.push(it.stuname);
                });

                return namelist.join('、');
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

                this.post('/examapply/queryallexaminfobystatus', {
                    command: 'examapply/queryallexaminfobystatus',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    teacherid: $.cookie('uid')
                }).done(function (data) {

                    let examlist = data && data.examinfolist;
                    let list = [];

                    if(examlist && examlist.length) {
                        for(let i =0; i < examlist.length; i++) {
                            if(examlist[i].status === 0) {
                                list.unshift(examlist[i]);
                            } else {
                                list.push(examlist[i]);
                            }
                        }
                    }

                    self.list = list;
                });
            },
            toSelStu(exam){

                if(exam && exam.status === 0) {
                    this.$router.push({
                        name: 'fdCkExamExamSelStu',
                        query: {
                            examid: exam.examid
                        }
                    });
                }
            },
            back(){
                window.location.href='/pages/futuredoctorapp/application.html';
            },
            changeTab(tab, index) {
                this.currentTab = tab.data;
                this.page = 1;
                // this.list = [];
                this.hasMore = true;
                this.loadData();
            },
            loadData(){
                let self = this;
                /*this.post('/learn/selectapplytimes', {
                    command: 'learn/selectapplytimes',
                    placeid: this.labInfo.placeid,
                    starttime: this.currentTab.value,
                    admin: this.labInfo.admin,
                    volume: this.labInfo.volume,
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid')
                }).done(function (data) {
                    self.list = data.timelist;
                });*/
            },
            loadMore(){

            }
        }
    }

</script>
<style lang="scss">
    @import "../../../scss/variables.scss";

    .my-exam-list{

        .item{
            padding: .25rem;
            background:#FFF;
            margin-bottom: .3rem;
            position: relative;

            &:after{
                 display: block;
                 content: ' ';
                 position: absolute;
                 top:0;
                 right:0;
                 width: 1.1rem;
                 height:1.1rem;
            }

            &.my-exam-executing:after{
                background:url("../../../assets/images/tips_jxz.png");

                background-size: cover;
                background-repeat: no-repeat;
             }

            &.my-exam-notbegin:after{
                 background:url("../../../assets/images/tips_swks.png");

                 background-size: cover;
                 background-repeat: no-repeat;
             }
            &.my-exam-end:after{
                 background:url("../../../assets/images/tips_yjs.png");

                 background-size: cover;
                 background-repeat: no-repeat;
             }
            &.my-exam-miss:after{
                 background:url("../../../assets/images/tips_qk.png");

                 background-size: cover;
                 background-repeat: no-repeat;
             }

             p{
                 line-height: 1.5;
                 font-size: $font-size-xm;

                 label {
                     color: $gray-light;
                 }
             }
        }
        .item:after{

        }

    }
</style>
