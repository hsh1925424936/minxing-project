<template>
    <div class="g-wrapper">
        <c-header>
        	<div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
        	我的审批
        </c-header>
        <c-tabs :bus="bus" @change-tab="changeTab" >
            <c-tab title=" 待审批 " :active="type == 1" :bus="bus" data="1">

            </c-tab>
            <c-tab title=" 已审批 " :active="type == 2" :bus="bus" data="2">

            </c-tab>
        </c-tabs>

        <div class="g-main">
        	<template v-if="type==1">
        		 <to-choose :active="type == 1"></to-choose>
        	</template>
        	<template v-if="type==2">
        		 <finished :active="type == 2"></finished>
        	</template>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import cTabs from "../../../components/tabs";
    import cTab from "../../../components/tab";
    import methods from "../../../methods";
    import cHeader from '../../header';
	import toChoose from './tochoose';
    import finished from './finished';

    let bus = new Vue();

    export default {
        data() {
            return {
                type: 1 ,
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
            toChoose,
	        finished
        },
        created() {
            this.type = Number(this.$route.query.type || 1);
        },
        mounted(){

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
<style>
@import "../../../scss/my.css";
</style>
