<template>
    <div class="g-wrapper">
        <c-header>
           <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            	出科考试报名
        </c-header>
	
    	<c-tabs :bus="bus" @change-tab="changeTab" >
            <c-tab title=" 可报名技能项 " :active="type == 1" :bus="bus" data="1">
                
            </c-tab>
            <c-tab title=" 我的技能项 " :active="type == 2" :bus="bus"  data="2">
                 
            </c-tab>
        </c-tabs>
  
        <div class="g-main">
        	
	        <template v-if="type==1">
	        	<to-one :active="type == 1"></to-one>
	        </template>
	        <template v-if="type ==2 ">
	        	<to-two :active="type == 2"></to-two>
	        </template>
        </div>
    </div>
</template>
<script>
	import $ from 'jquery';
    import Vue from 'vue';
    import cTabs from "../../../components/tabs";
    import cTab from "../../../components/tab";
    import cHeader from '../../header';
	import toOne from './enlist_skill';
    import toTwo from './my_skill';
    import xieFn from '../../../vuex/xie.js'
    import methods from '../../../methods'

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
            toOne,
	        toTwo
        },
        created() {
            this.type = Number(this.$route.query.type || 1);
        },
       mounted () {//查询所有场地接口
            var self = this
            var data={
                command: "learn/queryallplaces",
                sessionid: xieFn.getCookie('sid'),
                loginid: xieFn.getCookie('uid')
            }
            function callback(res){
                self.placelist = res.placelist
            }
            xieFn.post('/learn/queryallplaces',data,callback,xieFn.errcodefn,xieFn.errfn)
           this.registerToNative('goBack', function (data) {
               self.back();
           });
           
        },
        methods:{
            ...methods,
			back(){
				window.location.href='/pages/futuredoctorapp/application.html';
			},
			changeTab(tab) {
				this.type = tab.data;
			}
        }
    }
</script>
<style>
    .g-main{
        background: #f2f2f2!important;
    }
</style>
