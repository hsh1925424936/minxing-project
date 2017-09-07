<template>
    <div class="g-wrapper">
        <c-header>
            <!-- s -->
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            我的考试
        </c-header>
        <c-tabs :bus="bus" @change-tab="changeTab">
                <c-tab title="待考" :active="type == 1 ? true: false" :bus="bus" data="1">

                </c-tab>
                <c-tab title="已考" :active="type == 2 ? true: false"  :bus="bus" data="2">

                </c-tab>
        </c-tabs>
        <div class="g-main">     
            <div v-show='type == 1'>
                <my-test-wating></my-test-wating>
            </div>
            <div v-show='type == 2'>
                <my-test-ready></my-test-ready>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import cHeader from '../header'
    import cTab from '../../components/tab'
    import cTabs from '../../components/tabs'
    import myTestWating from './my_test_wating'
    import myTestReady from './my_test_ready'
    import methods from '../../methods'
    import { mapState,mapActions } from 'vuex'
    let bus = new Vue({})
    export default {
        name:'myTest',
        components:{
            cHeader,
            cTab,
            cTabs,
            myTestWating,
            myTestReady
        },
        data(){
            return{
                type: 1,
                bus: bus,
            }
        },
        mounted(){
          
        },
        methods:{
            changeTab(tab) {
                this.type = tab.data;
            },
            back(){
                window.location.href = '/pages/futuredoctorapp/application.html'
            }
        }
    }
</script>
<style scoped>
   
</style>