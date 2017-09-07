<template>
    <div class="g-wrapper booking-submit">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            课程详情
        </c-header>
        <div class="g-main">
            <div class="list info-list">
                <div class="item valign-center">
                    <label>培训课程：</label><div class="auto-width">{{ trainname }}</div>
                </div>
                <div class="item valign-center">
                    <label>培训内容：</label><div class="auto-width">{{ traincomment }}</div>
                </div>
                <div class="item valign-center">
                    <label>举办期数：</label><div class="auto-width">{{ trainterm }}</div>
                </div>
                <div class="item valign-center">
                    <label>培训学时：</label><div class="auto-width">{{ holdingcycle }}学时/期</div>
                </div>
                <div class="item valign-center">
                    <label>培训费用：</label><div class="auto-width">￥{{ trainprice }}</div>
                </div>
                <div class="item valign-center">
                    <label>举办时间：</label><div class="auto-width">{{ holdtime.slice(0,16) }}</div>
                </div>
                <div class="item valign-center">
                    <label>报名截止：</label><div class="auto-width">{{ joinlasttime.slice(0,16) }}</div>
                </div>
                <div class="item valign-center">
                    <label>人数上限：</label><div class="auto-width">{{ volume | filterFun}}</div>
                </div>
                <div class="item valign-center">
                    <label>备注说明：</label><div class="auto-width">{{ comment }}</div>
                </div>
                <div class="item valign-center">
                    <label>需要发票：</label>
                    <div class="auto-width">
                        <form class="needinvoice">
                            <label for="yes" class="radio" style="width: 40%">
                                <span class="radio-bg"></span>
                                <input type="radio" name="needinvoice" id="yes" value="1" v-model="isneedinvoice" checked="checked" style="width: .24rem; height: .24rem"/> 是
                                <span class="radio-on"></span>
                            </label>
                            <label for="no" class="radio" style="width: 40%">
                                <span class="radio-bg"></span>
                                <input type="radio" name="needinvoice" id="no" value="0" v-model="isneedinvoice" style="width: .24rem; height: .24rem"/> 否
                                <span class="radio-on"></span>
                            </label>

                        </form>
                    </div>
                </div>
                <div v-if="isneedinvoice == 1">
                    <div class="item valign-center">
                        <label style="width:1.6rem"><span class="redstar"> * </span> 发票抬头：</label>
                        <div class="auto-width">
                            <input type="text" v-model="invoiceheader" maxlength="30" placeholder="30个字符内">
                        </div>
                    </div>
                    <div class="item valign-center">
                        <div style="width:1.6rem">
                            <label ><span class="redstar"> * </span> 纳税人</label>
                            <label ><span class="redstar"> &nbsp; </span> 识别号：</label>
                        </div>
                        <div class="auto-width">
                            <input type="text" id="num" v-model="taxpayernumber" placeholder="15~25位的数字+大写字母">
                        </div>
                    </div>
                    <div class="item valign-center">
                        <label style="width:1.6rem"><span class="redstar"> * </span> 联系地址：</label>
                        <div class="auto-width">
                            <input type="text" v-model="address" maxlength="100" placeholder="100个字符内">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="padding">
            <a class="btn btn-blue btn-lg btn-block" @click="bookingSubmit()"> 立即报名 </a>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery';
    import methods from '../../methods';
    import cHeader from '../header.vue';
    import cModal from '../../components/modal';
    import { mapState, mapActions } from 'vuex';
    import xieFn from '../../vuex/xie'
    export default {
        data() {
            return {
                trainname:'',
                traincomment:'',
                trainterm:'',
                holdingcycle:'',
                trainprice:'',
                holdtime:'',
                joinlasttime:'',
                volume:'',
                comment:'',
                orgcode:'',
//                发票相关
                isneedinvoice:1,
                invoiceheader:'',
                taxpayernumber:'',
                address:'',
            }
        },
        components: {
            cHeader,
        },
        created() {},
        mounted () {
            this.setTitle('课程详情')
            var self=this
            self.init()
            self.registerToNative('goBack', function (data) {
                self.back()
            })
        },
        filters:{
        	filterFun:function(val){
        		if(val=='0'){
        			return  "无限制";
        		}else{
        			return val + "人"
        		}
        	}
        },
        methods: {
            ...mapActions([
                'showAlert',
                'showLoading',
                'hideLoading',
                'toast',
                'confirm'
            ]),
        ...methods,
        back(){
            if(this.apply) {
                this.$router.push({
                    name: 'fdMy'
                });
            } else {
                this.$router.push({
                    name: 'fdtraining_courselist',
                    query: ''
                })
            }
        },
        init(){
            let self = this;
            this.post('/externaltrain/queryexternaltraininfo', {
                command: "externaltrain/queryexternaltraininfo",
                sessionid: $.cookie('sid'),
                loginid: $.cookie('uid'),
                id:$.cookie('training_sign_planid')
            }).done(function(data){
                if(data.errcode==0){
                    console.log(JSON.stringify(data))
                        self.trainname=data.trainname,
                        self.traincomment=data.traincomment,
                        self.trainterm=data.trainterm,
                        self.holdingcycle=data.holdingcycle,
                        self.trainprice=data.trainprice,
                        self.holdtime=data.holdtime,
                        self.joinlasttime=data.joinlasttime,
                        self.volume=data.volume,
                        self.comment=data.comment,
                        self.orgcode=data.orgcode
                }else{
                    self.toast(data.errdesc)
                }
            }).fail(function () {
                self.toast('连接服务失败，请稍后再试')
            })
        },
        bookingSubmit(){//提交报名接口orgcode
            let self = this;
            var reg = /^[0-9A-Z]{15,25}$/;    //税号验证
            if (self.isneedinvoice == 1 && $('#num').val() == "") {
                self.toast('请输入纳税人识别号');
                return
            } else if (self.isneedinvoice == 1 && !reg.test($('#num').val())) {
                self.toast('请输入正确格式的税号');
                return
            }
            if( $.cookie('sid') && $.cookie('uid')){
                this.post('/externaltrain/submittraininfo', {
                    command: "externaltrain/submittraininfo",
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    planid:$.cookie('training_sign_planid'),
                    orgcode:self.orgcode,
                    uid: $.cookie('uid'),
                    comment:self.comment,
//                    发票相关
                    isneedinvoice:self.isneedinvoice,
                    invoiceheader:self.invoiceheader,
                    taxpayernumber:self.taxpayernumber,
                    address:self.address,
                }).done(function(data){
                    if(data.errcode==0){
                        self.toast('报名成功！')
                        setTimeout(function(){
                            self.$router.push({
                                name: 'fdtraining_signedlist',
                                query: ''
                            })
                        },1500)
                    }else if(data.errcode==9904){
                        self.toast('登录信息已失效，请重新登录')
                        setTimeout(function(){
                            self.$router.push({
                                name: 'fdtraining_login',
                                query: {
                                    comment:self.comment,
                                    orgcode:self.orgcode
                                }
                            })
                        },1500)
                    }else if (data.errcode==3001){
                        self.toast(data.errdesc)
                        setTimeout(function(){
                            self.$router.push({
                                name: 'fdtraining_signedlist',
                                query: ''
                            })
                        },1500)
                    }else if (data.errcode==9903){
                        self.toast("请输入完整的发票信息！")
                    }else{
                        self.toast(data.errdesc)
                    }
                }).fail(function () {
                    self.toast('连接服务失败，请稍后再试')
                })
            }else{
                self.toast('抱歉，您还没有登录')
                setTimeout(function(){
                    self.$router.push({
                        name: 'fdtraining_login',
                        query: {
                            comment:self.comment,
                            orgcode:self.orgcode
                        }
                    })
                },1500)
            }
        }
    }
    }
</script>
<style lang="scss" scoped>
    .needinvoice{
        display: block;
        width: 100%;
        height: auto;
    }
    .needinvoice label{
        vertical-align: middle;
        display: inline-block;
    }
    .needinvoice input{
        vertical-align: middle;
        /*-webkit-appearance: none;*/
    }
    .needinvoice label span{
        padding-left: .1rem;
    }

    /*单选按钮*/
    .radio{
        display: inline-block;
        position: relative;
        line-height: 0.28rem;
        margin-right: 10px;
        cursor: pointer;
    }
    .radio input{
        display: none;
    }
    .radio .radio-bg{
        display: inline-block;
        height: .3rem;
        width: .3rem;
        margin-right: 5px;
        padding: 0;
        border-radius: 100%;
        vertical-align: top;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid #c3c3c3;
    }
    .radio .radio-on{
        display: none;
    }
    .radio input:checked + span.radio-on{
        width: .2rem;
        height: .2rem;
        position: absolute;
        border-radius: 100%;
        top: 0.05rem;
        left: 0.05rem;
        transition: all 0.2s ease;
        transform: scale(1, 1);
        display: inline-block;
        background-color: #3499DB
    }

    .redstar{
        color:red;
    }

    input{
        height: .3rem!important;
    }
</style>

