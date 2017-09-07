<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            出科预约记录
        </c-header>
        <c-tabs :bus="bus" @change-tab="changeTab">
            <c-tab title=" 待审核 " :active="type == 1 ? true: false" :bus="bus" data="1">

            </c-tab>
            <c-tab title=" 进行中 " :active="type == 2 ? true: false" :bus="bus" data="2">

            </c-tab>
            <c-tab title=" 已取消 " :active="type == 3 ? true: false" :bus="bus" data="3">

            </c-tab>
        </c-tabs>
        <div class="g-main">
            <template v-if="type == 1">
                <to-check></to-check>
            </template>
            <template v-if="type == 2">
                <running></running>
            </template>
            <template v-if="type == 3">
                <canceled></canceled>
            </template>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import cTabs from "../../../components/tabs";
    import cTab from "../../../components/tab";
    import cHeader from '../../header';
    import toCheck from './tocheck';
    import running from './running';
    import canceled from './canceled';
    import methods from '../../../methods';
    let bus = new Vue();

    export default {
        data() {
            return {
                type: 1,
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
            running,
            canceled
        },
        created() {
            this.type = Number(this.$route.query.type || 1);
        },
        mounted () {

        },
        methods:{
            ...methods,
            back(){
                window.location.href='/pages/futuredoctorapp/application.html'
            },
            changeTab(tab) {//切换tab刷新
                this.type = tab.data;
            }
        }
    }
</script>
<style>

</style>
