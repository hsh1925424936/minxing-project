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
        <div class="bookin-lab-sel g-main" style="margin-bottom: 2rem;">
        	<div class="list lab-list">
        		<template v-for="(val,index) in signList">
        			<a class="item valign-center" @click="selLab(val.id)">
        				<i class="icon-clock iconfont"></i>
        				<div class="auto-width" style="width: 150%;">
        					<h3 class="lhl_name">{{val.trainname}}</h3>
        					<p>{{val.traintime}}</p>
        				</div>
        				<div class="auto-width">
        					<p class="lhl_name">{{val.status}}</p>
        					<p>{{val.trainprice | newMoney}}</p>
        				</div>
        				<a><img src="../../assets/images/icon_xiangyou.png" alt="" style="width: .15rem;"/></a>
        			</a>
        		</template>
        	</div>
        </div>
        <div  class="padding" style="padding: 0;" v-show="removePicture">
				<a href="http://139.196.6.204:8090/misrobot-edms/chksys/" style="width: 100%;">
					<img src="../../assets/images/广告.png" style="width: 100%;position: fixed;bottom: 0;z-index: 999;" id="advert"/>
					
					
				</a>
				<img src="../../assets/images/btn_closed.png" id="deleteBtn1" @click="deleteBtn" style="z-index: 9999 !important;"/>
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
            	signList:[],
            	removePicture:true
            }
        },
        components: {
        	cHeader,
        	noContent
        },
        created() {
        },
        mounted () {
        	$('#deleteBtn1').css({
				bottom:$('#advert').height()-$('#advert').width()/12-20+"px",
				width:$('#advert').width()/12+'px'
			})
        	this.registerToNative('goBack', function (data) {
              this.back();
          });
        	this.setTitle('报名记录')
        	let self=this;
        	if ($.cookie('sid')&&$.cookie('uid')) {
        		this.post('/externaltrain/queryregistrationlist',{
             	command: "externaltrain/queryregistrationlist",
				sessionid: $.cookie('sid'),
				loginid: $.cookie('uid'),
				uid: $.cookie('uid')
             }).done(function(res){
                    if(res.errcode=='0'){
                        self.signList=res.registrationlist;
                        console.log(res);
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
                    }else if(res.errcode=='9904'){
                        self.toast("登陆信息已失效，请重新登录！")
                        setTimeout(function(){
                            self.$router.push({
                                name: 'fdtraining_login',
                                query: {
                                    from:'signedlist'
                                }
                            })
                        },1500)
                    }else{
                        self.toast(res.errdesc)
                    }
             }).fail(function(){
                    self.toast("连接服务失败，请稍后再试")
                })
        	} else{
        		self.toast("您还没有登陆，请登录！")
        		setTimeout(function(){
                    self.$router.push({
                        name: 'fdtraining_login',
                        query: {
                            from:'signedlist'
                        }
                    })
                },1500)
        	}

           
       },
        filters:{
        	
        	newMoney:function(value){
        		return "￥"+value+".00"
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
        	selLab(val){
        		this.$router.push({
        			name:"fdtraining_signeddetail",
        			query:{
        				booking:val
        			}
        		})
        	},
            back(){
                this.$router.push({
                    name:"fdtraining_courselist",
                    query:''
                })
            },
            deleteBtn:function(){
            	this.removePicture=false;
            }
        }
    }

</script>
<style lang="scss" scoped="scoped">
    .lhl_name{
    	font-size: .24rem;
    }
    
    #deleteBtn1{
    	position: absolute;
    	right: .2rem;
    }
</style>
