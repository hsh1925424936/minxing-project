<template>
    <div class="g-wrapper">
        <c-header class="header">
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            出科考试评教
        </c-header>
        <c-tabs :bus="bus" @change-tab="changeTab">
            <!--<c-tab title=" 全部考试 " :active="type == 1 ? true: false"  :bus="bus" data="1">-->
            <!--</c-tab>-->
            <c-tab title=" 待评教 " :active="type == 2 ? true: false"  :bus="bus" data="2">
            </c-tab>
            <c-tab title=" 已评教 " :active="type == 3 ? true: false" :bus="bus" data="3">
            </c-tab>
        </c-tabs>
        <div class="g-main">
            <!--<template v-if="type == 1">-->
                <!--<all-exam></all-exam>-->
            <!--</template>-->
            <template v-if="type == 2">
                <wait-assess></wait-assess>
            </template>
            <template v-if="type == 3">
                <already-assess></already-assess>
            </template>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import cHeader from '../../header';
    import cTabs from "../../../components/tabs";
    import cTab from "../../../components/tab";
//    import allExam from './all-exam';
    import waitAssess from './wait-assess';
    import alreadyAssess from './already-assess';
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
//            allExam,
            alreadyAssess,
            waitAssess
        },
        created() {

        },
        mounted () {
            let _this=this;
            this.registerToNative('goBack', function (data) {
                _this.back();
            });
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
