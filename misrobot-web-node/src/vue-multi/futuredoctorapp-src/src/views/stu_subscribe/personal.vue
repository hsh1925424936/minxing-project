<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            我的预约
            <div slot="headerRight">
                <router-link :to="{name: 'fdnew_learninfo'}" class="personaladd">
                	<img src="../../assets/images/icon_zengjia.png" />
                </router-link>
            </div>
        </c-header>
        <c-tabs :bus="bus" @change-tab="changeTab">
            <c-tab title=" 待审批 " :active="type == 1 ? true: false"  :bus="bus" data="1">

            </c-tab>
            <c-tab title=" 审批不通过 " :active="type == 2 ? true: false" :bus="bus" data="2">

            </c-tab>
            <c-tab title=" 待训练 " :active="type == 3 ? true: false" :bus="bus" data="3">

            </c-tab>
            <c-tab title=" 已结束 " :active="type == 4 ? true: false" :bus="bus" data="4">

            </c-tab>
        </c-tabs>
        <div class="g-main">
            <template v-if="type == 1">
                <to-check></to-check>
            </template>
            <template v-if="type == 2">
                <failed></failed>
            </template>
            <template v-if="type == 3">
                <to-finish></to-finish>
            </template>
            <template v-if="type == 4">
                <finished></finished>
            </template>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import cTabs from "../../components/tabs";
    import cTab from "../../components/tab";
    import cHeader from '../header';
    import toCheck from './tocheck';
    import failed from './failed';
    import toFinish from './tofinish';
    import finished from './finished';
    import methods from '../../methods'

    let bus = new Vue();

    export default {
        data() {
            return {
                type: 1,//显示哪个tab
                bus: bus,
                list: [],
                list2: []
            }
        },
        route: {
            data: function(transition) {

            }
        },
        components: {
            cTabs,
            cTab,
            cHeader,
            toCheck,
            failed,
            toFinish,
            finished
        },
        created() {
            this.type = Number(this.$route.query.type || 1);
        },
        mounted(){
            this.setTitle('我的预约')
            var self=this
            this.registerToNative('goBack', function (data) {
                self.back()
            })
        },
        methods:{
            ...methods,
            changeTab(tab) {
                this.type = tab.data;
            },
            back(){
                if(this.$route.query.from=='myappoint_weixin_login' || $.cookie('where')=='myappoint_weixin_login'){
                    this.$router.push({
                        name: 'fdMyAppoint_Weixin_login'
                    })
                }else{
                    window.location.href='/pages/futuredoctorapp/application.html';
                }
            },
        }
    }
</script>
<style>
.personaladd img{
	width: .3rem;
}
</style>
