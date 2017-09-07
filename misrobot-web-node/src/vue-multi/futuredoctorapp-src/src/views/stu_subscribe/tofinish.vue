<template>
    <div class="ld_add">
        <div class="xiecontentBox" v-for="(value,index) in toFinishList">
            <dl>
                <dd>
                    <span>实验室名称 : </span>
                    <b>{{ value.placename }} <button v-if="paramvalue==0" class="attentionbtn" @click="attentionBtn(value.placeid)">!</button> </b>
                </dd>
                <dd>
                    <span>实验室地址 : </span>
                    <b>{{ value.displayname }}</b>
                </dd>
                <dd>
                    <span>管理员 : </span>
                    <b>{{ value.admin }} {{ value.adminphone }}</b>
                </dd>
                <dd>
                    <span>训练项名称 : </span>
                    <b>{{ value.learnname }}</b>
                </dd>
                <dd>
                    <span>位置 : </span>
                    <b>{{ value.workstation }}</b>
                </dd>
                <dd>
                    <span>预约时段 : </span>
                    <b>{{ value.learntime}}</b>
                </dd>
                <dd>
                    <span>备注 : </span>
                    <b>{{ value.comment }}</b>
                </dd>
                <dd>
                    <span>审批意见 : </span>
                    <b>{{ value.description }}</b>
                </dd>
            </dl>
            <p class="xiebottomHandlers">
                <span class="xiebtn xiebtn-blue" @click="quxiao" :quxiaoId="value.id">取消预约</span>&nbsp;
            </p>
        </div>
        <c-modal :config="cancelModal">
			<p style="padding: .2rem;">请填写取消预约原因</p>
			<p style="margin:0 0 .4rem 0;">
				<textarea class="advice"  v-model="quxiaoyuyuetxt" ></textarea>
			</p>
            <template slot="buttons">
                    <button type="button" class="btn btn-blue btn-false btn-fc" @click="fanhui" style="font-size: .26rem ;color: #3499db ;" >返回</button>
					<button type="button" class="btn btn-blue btn-sure btn-fc" @click="queren" :querenid="sureId" style="font-size: .26rem ;color: #3499db ;">确认</button>

            </template>
        </c-modal>
        <no-content v-show="toFinishList.length==0"></no-content>
        
        <div class="attention" v-show="attentionshow">
			<div class="attentioncontent">
				<p class="attentiontitle">{{attentiontitle}} <span class="close" @click="closeattention">+</span></p>
				<p class="attentiontext">{{attentioncontent}}</p>
			</div>
		</div>
    </div>
</template>
<script>
	import $ from 'jquery';
	import xieFn from '../../vuex/xie';
	import { mapState, mapActions } from 'vuex';
	import noContent from '../no_content.vue';
	import methods from '../../methods';
	import cModal from '../../components/modal';
    export default {
        data() {
            return {
            	attentionshow:false,
            	attentiontitle:'',
            	attentioncontent:'',
                toFinishList:'',
                quxiaoyuyuetxt:'',
                sureId:'',
                cancelModal: {
                    show: false,
                    title: '取消预约',
                    hideOnClickOut: true,
                    theme: 'hello-world'
                },
                paramvalue:'',
            }
        },
        mounted() {
//          this.queryAppoint();
			var self=this;
			this.post('/learn/querystudentapplyinfobystatus', {
	            command:'learn/querystudentapplyinfobystatus',
                sessionid:$.cookie('sid'),
                loginid:$.cookie('uid'),
                status:0,//0：审核通过，1：已训练，2：训练失败，3：已取消,4：待审核（默认），5：审核不通过
                teacherid:$.cookie('uid')
	       }).done(function(data){
                self.toFinishList=data.applys;
                console.log(JSON.stringify(self.toFinishList));
	       }).fail(function () {
	        });
	        this.queryparamvalue();
	        
        },
        components:{
            noContent,
            cModal
        },
        methods:{
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            ...methods,
            queryparamvalue(){
            	let self = this;
                this.post('/commparaconf/querycommparaconflist', {
                    command: "commparaconf/querycommparaconflist",
                    paramcode:'param_set'
                }).done(function (data) {
                	self.paramvalue=data.commparaconflist[1].param1;
                	console.log(self.paramvalue)
                });
            },
            attentionBtn: function(id) {
            	var self=this;
            	this.post('/attention/queryattentionbyplaceid', {
	                command: "attention/queryattentionbyplaceid",
	                sessionid: $.cookie('sid'),
	                loginid: $.cookie('uid'),
	                placeid:id
	            }).done(function (data) {console.log(JSON.stringify(data))
	                self.attentiontitle=data.attentionname;
	                self.attentioncontent=data.content;
            		self.attentionshow=true;
	            });
            },
            closeattention:function(){
            	this.attentionshow=false;
            },
            agree: function(type) {
				var self = this;
				self.toFinishList = '';
				this.post('/learn/updatestudentapplystatus', {
		            command:'learn/querystudentapplyinfobystatus',
	                sessionid:$.cookie('sid'),
	                loginid:$.cookie('uid'),
	                status:0,//0：审核通过，1：已训练，2：训练失败，3：已取消,4：待审核（默认），5：审核不通过
                	teacherid:$.cookie('uid')
		       }).done(function(data){
	                self.toFinishList=data.applys;
	                console.log(JSON.stringify(self.toFinishList));
		       }).fail(function () {
		        });
			},
            quxiao:function(){
				this.cancelModal.show = true;
				this.sureId=$(event.target).attr('quxiaoid');
				this.quxiaoyuyuetxt='取消预约';
			},
			fanhui: function() {
				this.cancelModal.show=false;
			},
			queren:function() {
				var self = this;
				this.post('/learn/updatestudentapplystatus', {
		            command:'learn/updatestudentapplystatus',
	                sessionid:$.cookie('sid'),
	                loginid:$.cookie('uid'),
	                status:3,//0：审核通过，1：已训练，2：训练失败，3：已取消,4：待审核（默认），5：审核不通过
					id:$(event.target).attr('querenId'),
					description:self.quxiaoyuyuetxt
		       }).done(function(data){
//	                self.toFinishList=data.applys;
	                console.log(JSON.stringify(self.toFinishList));
	                if(data.errcode==0){
	               		self.agree(1);
	                	self.cancelModal.show=false;
	                }
		       }).fail(function () {
		        });
			}
        }
    }
</script>
<style>
	.attentionbtn{
		border: 1px solid;
		border-radius: 50%;
		transform: rotate(180deg);
		width: 0.3rem;
		height: 0.3rem;
		cursor: pointer;
		margin-left: 0.4rem;
	}
	.attention{
		background-color: rgba(0,0,0,0.5);
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
	}
	.attentioncontent{
		background-color: #fff;
		position: absolute;
		bottom: 0;
		height: 85%;
		width: 100%;
	}
	.attentiontitle{
		text-align: center;
		padding: .4rem 0 .5rem 0;
		font-size: .4rem;
	}
	.attentiontext{
		padding: 0 .2rem;
		text-align: justify;
	}
	.close{
		transform: rotate(45deg);
		position: absolute;
		font-size: 1rem;
		right: .3rem;
		top: 0.05rem;
	}
	.ld_add .advice{
		outline: 1px solid lightgray;
		margin-bottom: .2rem;
		width: 80%;
		height: 2rem;
		margin-left: 10%;
	}
</style>
