<template>
    <div class="booking-time-sel g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            班级预约
        </c-header>

        <div class="time-sel">
            <div class="valign-center lab-info">
                <div class="auto-width place">
                    {{labInfo.displayname}}
                </div>
                <a class="view-lab" @click="viewLab()">查看实验室资源</a>
            </div>

            <c-tabs :bus="bus" className="time-tabs" @change-tab="changeTab">
                <template v-for="it in items">
                    <c-tab :title="it.label" :active="it.active" :data="it" :bus="bus">

                    </c-tab>
                </template>
            </c-tabs>
        </div>

        <div class="list list-cut lab-list g-main" v-infinite-scroll="loadMore">
            <template v-for="it in list">
                <div class="item">
                    <div class="valign-center">
                        <div class="auto-width">
                            <h3 class="name">{{it.starttime | substr(0, 5)}}-{{it.endtime | substr(0, 5)}}</h3>
                            <p class="addr">{{it.applynum}} / {{it.maxnum}}</p>
                        </div>
                        <a class="btn btn-blue" @click="toSubmit(it)" > 预约 </a>
                    </div>
                    	<p>{{it.learnslist  | showLabel}}</p>
                    	<p>{{it.teachername}}</p>
                    	<p v-if="it.teachername==null&&it.learnslist.length==0">无预约</p>
                </div>
            </template>
            <no-content v-show="list.length==0" :txtdescription="txtdescription"></no-content>
        </div>

        <c-modal :config="labInfoModal">
            <table class="lab-info-table">
                <tr>
                    <th>资源名称</th>
                    <!--<th>资源类型</th>-->
                    <th>数量</th>
                </tr>
                <tr v-for="res in resourcelist">
                    <td>{{res.resourcename}}</td>
                    <!--<td>{{res.type}}</td>-->
                    <td>{{res.resourcenum}}</td>
                </tr>
            </table>
        </c-modal>
    </div>
</template>

<script>

    import Vue from 'vue';
    import $ from 'jquery';
    import moment from 'moment';
    import methods from '../../../methods';
    import cHeader from '../../header.vue';
    import cModal from '../../../components/modal';
    import cTabs from "../../../components/tabs";
    import cTab from "../../../components/tab";
    import noContent from '../../no_content';

    import { mapState, mapActions } from 'vuex';

    let bus = new Vue();

    export default {
        data() {
            return {
                labInfoModal: {
                    show: false,
                    title: '查看实验室资源',
                    hideOnClickOut: true
                },
                bus: bus,
                resourcelist: [],
                labInfo: {},
                currentTab: null,
                currentTime: null,
                page: 1,
                hasMore: true,
                items: [],
                list: [],
                txtdescription:"当天没有时间段可预约~"
            }
        },
        components: {
            cHeader,
            cModal,
            cTabs,
            cTab,
            noContent
        },
        created() {},
        mounted () {
            let self = this;
            this.labInfo = this.$route.query;
            this.init();
            this.registerToNative('goBack', function (data) {
                if (self.labInfoModal.show){
                    self.labInfoModal.show = false;
                }else {
                    self.back();
                }
            });
        },
        filters: {
            showLabel(arr) {
                let label = [];
                if(arr && arr.length) {
                    for(let i = 0; i < arr.length; i++) {
                        label.push(arr[i].learnname);
                    }
                }

                return label.join('、');
            },
        },
        watch: {
            '$router': function (val, oldVal) {
                this.labInfo = this.$route.query;
                this.init();
            }
        },
        /*computed: mapState([
         'loginUser'
         ]),*/
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

                if(!self.labInfo || !self.labInfo.placeid) {
                    this.back();
                    this.toast('请先选择实验室！');
                }
                this.post('/learn/queryplaceresource', {
                    command: 'learn/queryplaceresource',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    placeid: self.labInfo.placeid
                }).done(function (data) {
                    self.resourcelist = data && data.resourcelist;
                });

                // date
                this.items = [];
                for(let i = 0; i < 7; i++) {
                    let d = moment().add(i, 'days');
                    this.items.push({
                        label: d.format('M.D'),
                        value: d.format('YYYY-MM-DD') + ' 00:00:00',
                        moment: d,
                        active: i === 0
                    });
                }
            },
            toSubmit(time){
                console.log('time='+JSON.stringify(time));
                var temp=[];
                time.learnslist.forEach(function(value){
                    temp.push({
                        learnid:value.learnid,
                        name:value.learnname
                    })
                })
                this.currentTime = time;

                let st = this.currentTab.moment.format('YYYY-MM-DD ') + this.currentTime.starttime;
                let et = this.currentTab.moment.format('YYYY-MM-DD ') + this.currentTime.endtime;

                this.$router.push({
                    name: 'fdCreateSubmit',
                    query: {
                        labInfo: this.labInfo,
                        timeInfo: {
                            starttime: st,
                            endtime: et,
                            openid: this.currentTime.openid
                        },
                        learnlist:temp,
                        courseid:time.courseid,
                        coursename:time.coursename,
                        from:'seltime'
                    }
                });
            },
            back(){
                this.$router.push({
                    name: 'fdCreateSelLab'
                })
            },
            viewLab(){
                this.labInfoModal.show = true;
            },
            changeTab(tab, index) {
                this.currentTab = tab.data;
                this.page = 1;
                this.list = [];
                this.hasMore = true;
                this.loadData();
            },
            loadData(){
                let self = this;
                this.post('/learn/selectapplytimes', {
                    command: 'learn/selectapplytimes',
                    placeid: this.labInfo.placeid,
                    starttime: this.currentTab.value,
                    admin: this.labInfo.admin,
                    volume: this.labInfo.volume,
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid')
                }).done(function (data) {
                    self.list = data.timelist;
                    console.log(JSON.stringify(data))
                });
            },
            loadMore(){
                /*if(this.hasMore) {
                    this.page++;
                    this.loadData();
                }*/
            }
        }
    }

</script>
<style lang="scss">
    @import "../../../scss/variables.scss";

    .booking-time-sel{
        border-top:0;

        .time-sel{
            background: #FFF;
            margin-bottom:.2rem;
            padding:.24rem;
        }
        .place{
        	font-size: .28rem;
        	font-weight: 400;
        }
        .lab-info{
            font-size:.26rem;
            margin-bottom:.24rem;
            color:#333;

            .view-lab{
                font-size:.2rem;
                color:#369;
            }
        }
        .time-tabs{
            border:1px solid #3499db;
            border-radius: .06rem;
            padding-left:.18rem;
            padding-right:.18rem;
            .tab{
                label{
                    /*color: #888;*/
                    font-size:.26rem;
                    padding:.25rem .05rem .2rem .05rem;
                }
            }
        }
         .btn{
                	font-size: .26rem;
                }
        .lab-info-table{

            width:100%;

            tr {
                th, td{
                    padding: .2rem;
                    font-weight: normal;
                    text-align: center;
                    border-right:1px solid $line-color;
                    border-bottom:1px solid $line-color;

                    &:last-child{
                         border-right:none;
                     }
                }
                td{
                    font-size: $font-size-xm;
                    color:$gray;
                }

                th{
                    width:50%;
                    padding:.25rem;
                    color:$gray-dark;
                }

                &:last-child {
                    td{
                        border-bottom:none;
                    }
                }
            }
        }

    }
</style>
