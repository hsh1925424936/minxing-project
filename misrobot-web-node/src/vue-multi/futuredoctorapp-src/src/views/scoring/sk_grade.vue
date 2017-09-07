<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            评分
        </c-header>
        <c-tabs :bus="bus" @change-tab="changeTab" :active="bactive">
            <c-tab :title="'待评分（'+listLength+'）'" :bus="bus" data="1">
                
            </c-tab>
            <c-tab title="已评分" :bus="bus"  data="2">
                 
            </c-tab>
        </c-tabs>
        <div class="g-main">
            <div v-show='type == 1'>
                <to-wait @list-length='queryLength'></to-wait>
            </div>
            <div v-show='type == 2'>
                <to-ready></to-ready>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import cHeader from '../header'
    import methods from '../../methods'
    import cTab from '../../components/tab'
    import cTabs from '../../components/tabs'
    import toWait from './sk_grade_wait'
    import toReady from './sk_grade_ready'
    let bus = new Vue()
    export default {
        name:'sk_grade',
        components:{
            cHeader,
            cTab,
            cTabs,
            toWait,
            toReady,
            methods
        },
        data () {
            return {
                type:1,
                bus:bus,
                listLength:0
            }
        },
        computed: {
            bactive: function(){
                return this.type - 1;
            }
        },
        methods:{
            ...methods,
			changeTab(tab) {
                this.type = tab.data;
			},
            queryLength:function(length){
                // console.log(length)
                this.listLength = length
            },
            back () {
                window.location.href='/pages/futuredoctorapp/application.html';
            },
        },
        mounted(){
            let self = this
            if(this.$route.query.booking == 2 || this.$route.query.type == 2){
                this.type = 2;
            }
            self.registerToNative('goBack', function (data) {
                  self.back();
            });
        }
    }
</script>
<style scoped>

</style>