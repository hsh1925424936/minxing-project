<template>
    <div class="g-wrapper">
        <c-header>
        	<div slot="headerLeft">
        		<a @click="back()" class="header-back-btn">
        			<img src="../../assets/images/icon_fanhui.png" alt="" />
        		</a>
        	</div>
        	报名记录
        </c-header>
        <div class="bookin-lab-sel g-main">
        	<div class="list lab-list">
        		<template v-for="(val,index) in signList">
        			<a class="item valign-center" @click="selLab(val)">
        				<i class="icon-clock iconfont"></i>
        				<div class="auto-width" style="width: 150%;">
        					<h3 class="lhl_name">{{val.trainname}}</h3>
        					<p>{{val.traintime | newTime}}</p>
        				</div>
        				<div class="auto-width">
        					<h3 class="lhl_name">{{val.status}}</h3>
        					<p>{{val.trainprice | newMoney}}</p>
        				</div>
        				<a><img src="../../assets/images/icon_xiangyou.png" alt="" style="width: .15rem;"/></a>
        			</a>
        		</template>
        	</div>

        </div>
        <no-content v-show="signList.length==0"></no-content>
    </div>
</template>

<script>

    import $ from 'jquery';
    import Vue from "vue";
    import cHeader from "../header";
    import methods from "../../methods";
    import noContent from "../no_content.vue";
    import { mapState, mapActions } from 'vuex';

    export default {
        data() {
            return {
            	signList:[]
            }
        },
        components: {
        	cHeader,
        	noContent
        },
        created() {
        },
        mounted () {
        	let self=this;
             this.post('/externaltrain/queryregistrationlist',{
             	command: "externaltrain/queryregistrationlist",
				sessionid: $.cookie('sid'),
				loginid: $.cookie('uid'),
				uid: $.cookie('uid')
             }).done(function(res){
             	self.signList=res.registrationlist;
             	for (var i=0;i<self.signList.length;i++) {
             		if (self.signList[i].status==1) {
             			self.signList[i].status="待审核";
             		}else if(self.signList[i].status==2){
             			self.signList[i].status="待缴费";
             		}else if(self.signList[i].status==3){
             			self.signList[i].status="已缴费";
             		}else{
             			self.signList[i].status="已取消";
             		}
             	}
             });
             this.registerToNative('goBack', function (data) {
                self.back();
            });
        },
        filters:{
        	newTime:function(val){
        		return val.substring(0,19)
        	},
        	newMoney:function(val){
        		return "￥"+val+".00"//金钱处理函数
        	}
        },
        methods: {
        	...mapActions([
				'showAlert',
				'showConfirm',
				'showLoading',
				'hideLoading',
				'toast'
			]),
        	...methods,
        	selLab(booking){
        		this.$router.push({
        			name:"fdtraining_signeddetailapp",
        			query:{
        				booking:booking
        			}
        		})
        	},
        	back:function(){
        			window.location.href='/pages/futuredoctorapp/application.html';
        	}
        }
    }

</script>
<style lang="scss" scoped="scoped">
    .lhl_name{
    	font-size: .24rem;
    }
</style>
