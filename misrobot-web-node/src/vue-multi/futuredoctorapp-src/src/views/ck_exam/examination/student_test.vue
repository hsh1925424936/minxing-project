<template>
    <div class="g-wrapper">
        <c-header class="header">
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            出科报名记录
        </c-header>
        <c-tabs :bus="bus" @change-tab="changeTab">
            <c-tab title=" 待考试 " :active="type == 1 ? true: false"  :bus="bus" data="1">

            </c-tab>
            <c-tab title=" 已取消 " :active="type == 2 ? true: false" :bus="bus" data="2">

            </c-tab>
            <c-tab title=" 已考试 " :active="type == 3 ? true: false" :bus="bus" data="3">

            </c-tab>
        </c-tabs>
        <div class="g-main">
            <template v-if="type == 1">
                <to-wait></to-wait>
            </template>
            <template v-if="type == 2">
                <to-cancel></to-cancel>
            </template>
            <template v-if="type == 3">
                <to-over></to-over>
            </template>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import cHeader from '../../header';
    import cTabs from "../../../components/tabs";
    import cTab from "../../../components/tab";
    import toWait from './towait';
    import toCancel from './tocancel';
    import toOver from './toover';
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
        components: {
            cTabs,
            cTab,
            cHeader,
            toWait,
            toCancel,
            toOver
        },
        created() {

        },
        mounted () {

        },
        methods:{
            ...methods,
            back(){
                    window.location.href='/pages/futuredoctorapp/application.html'
                },
            changeTab(tab) {
                this.type = tab.data;
            }
        }
    }
</script>
