<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            注册
        </c-header>
        <div class="g-main">
            <div class="list info-list" style="margin-top:.1rem">
                <div class="item valign-center">
                    <label style="width:1.4rem"><span class="redstar"> * </span> 姓名：</label>
                    <div class="auto-width">
                        <input type="text" id="uname" @mouseout = "nameCtrl()" v-model="uname" required="required" placeholder="请输入您的姓名">
                        <p v-show = "nameLimit" style="color: red">姓名必须输入</p>
                    </div>
                </div>

                <div class="item valign-center">
                    <label style="width:1.4rem"><span class="redstar"> * </span> 手机号码：</label>
                    <div class="auto-width">
                        <input type="text" autofocus="autofocus" id="num" class="auto-width" required="required" v-model="tel"/>
                        <input id="btn" readonly unselectable="on"  placeholder="获取验证码" @click = "verificationCode()"/>
                    </div>
                </div>
                <div class="item valign-center">
                    <label style="width:1.4rem"><span class="redstar"> * </span> 验证码：</label>
                    <div class="auto-width">
                        <input type="text" id="codeInp" placeholder="请输入验证码" required="required" v-model="validateCode">
                    </div>
                </div>
                <div class="item valign-center">
                    <label style="width:1.4rem"><span class="redstar"> * </span> 登录密码：</label>
                    <div class="auto-width">
                        <input type="password" id="pwd" v-model="upwd" class="auto-width" required="required" placeholder="请输入您的密码" @mouseout = "pwdCtrl()" >
                        <p v-show = "pwdLimit" style="color: red">密码不能少于6位</p>
                    </div>
                </div>
                <div class="item valign-center">
                    <label style="width:1.4rem"><span class="redstar"> * </span> 确认密码：</label>
                    <div class="auto-width">
                        <input type="password" id = "pwdSure" class="auto-width" v-model="repassword" required="required" placeholder="请再次输入密码" @mouseout = "pwdTest()">
                        <p v-show = "pwdComp" style="color: red">两次输入密码不一致</p>
                    </div>
                </div>

                <div class="item valign-center">
                    <label style="width:1.4rem">邮箱:</label>
                    <div class="auto-width">
                        <input type="email" id="email" v-model="email" placeholder="请输入您的邮箱">
                    </div>
                </div>

                <div class="item valign-center">
                    <label style="width:1.4rem">性别:</label>
                    <div class="auto-width">
                        <form class="gender">
                            <label for="man" class="radio">
                                <span class="radio-bg"></span>
                                <input type="radio" name="gender" id="man" value="0" v-model="gender" checked="checked" style="width: .24rem; height: .24rem" /> 男
                                <span class="radio-on"></span>
                            </label>
                            <label for="woman" class="radio">
                                <span class="radio-bg"></span>
                                <input type="radio" name="gender" id="woman" value="1" v-model="gender" style="width: .24rem; height: .24rem" /> 女
                                <span class="radio-on"></span>
                            </label>
                        </form>
                    </div>
                </div>

                <div class="item valign-center">
                    <label style="width:1.4rem">证件类型：</label>
                    <div class="auto-width">{{ hisCard.name }}</div>
                    <a class="btn btn-blue" @click="showSelectCardType()">选择</a>
                </div>

                <div class="item valign-center">
                    <label style="width:1.4rem">证件号码:</label>
                    <div class="auto-width">
                        <input type="email" v-model="cardValue" placeholder="请输入您的证件号码">
                    </div>
                </div>

            </div>
            <div class="padding">
                <button @click = "sign()" class="btn btn-blue btn-lg btn-block">注册</button>
            </div>
        </div>
        <c-modal :config="cardTpl">
        <div class="flex-item class-sel-list">
            <div class="list info-list list-inner">
                <div class="item" v-for="it in cardList">
                    <label class="flex flex-start flex-row">
                        <div class="fitem">{{it.name}}</div>
                        <input type="radio" v-model="hisCard" :value="it" class="checkbox" />
                    </label>
                </div>
            </div>
        </div>
        <template slot="buttons">
            <button type="button" class="btn" @click.stop="selectCardType()">确定</button>
        </template>
        </c-modal>

    </div>
</template>

<script>

    import $ from 'jquery'
    import methods from '../../methods';
    import cHeader from '../header.vue';
    import cModal from '../../components/modal';
    import { mapState, mapActions } from 'vuex';

    export default {
        data() {
            return {
                id:"",
                uname:"",
                tel:"",
                validateCode:"",
                upwd:"",
                repassword:"",
                email:"",
                gender:0,
                hisCard:'',
                cardValue:'',
                code:"",
                pwdComp:false,
                nameLimit:false,
                pwdLimit:false,
                cardList:[],
                cardTpl:{
                    show: false,
                    title: '选择证件类型',
                    hideOnClickOut: true,
                },
            }
        },
        components: {
            cHeader,
            cModal,
        },
        mounted () {
            this.setTitle('注册');
            var self=this
            self.post('/hr/querylevellist',{//证件类型
                command:'hr/querylevellist',
                code:'card'
            }).done(function(res){
                self.cardList=res.levellist
            })
        },
        methods: {
            ...methods,
            ...mapActions([
                'showAlert',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            showSelectCardType:function(){
                this.cardTpl.show=true
            },
            selectCardType:function(){
                this.cardTpl.show=false
            },
            sign:function () {
                var _self = this;
                this.post("/user/register",{
                    command:'user/register',
                    name:_self.uname,
                    mobile:_self.tel,
                    code:_self.validateCode,
                    password:_self.upwd,
                    repassword:_self.repassword,
                    email:_self.email,
                    sex:_self.gender,
                    cardtype:_self.hisCard.id,
                    cardnum:_self.cardValue,
                }).done(function (data) {
                    if(data.errcode==0){
                        $.cookie("uid",data.userid)
                        $.cookie("sid",data.sessionid)
                        _self.toast('注册成功，请登录！')
                        setTimeout(function(){
                            _self.$router.push({
                                name: 'fdMyAppoint_Weixin_login',
                                query: ''
                            })
                        },1500)
                    }else if (data.errcode==47) {
                        _self.toast('存在未填写的必填项！')
                    }
                    else{
                        _self.showAlert(data.errdesc)
                    }
                }).fail(function () {
                        _self.showAlert("注册失败！")
                    })
            },
            nameCtrl:function () {
                var uname = $("#uname").val();
                if(!uname){
                    this.nameLimit = true;
                }else{
                    this.nameLimit = false;
                }
            },
            pwdCtrl:function () {
                var pwd = $("#pwd").val();
                if (pwd.length<6) {
                    this.pwdLimit = true;
                }else{
                    this.pwdLimit = false;
                }
            },
            pwdTest:function () {
                var pwd = $("#pwd").val();
                var pwdSure = $("#pwdSure").val();
                if(pwd != pwdSure){
                    this.pwdComp = true;
                }else {
                    this.pwdComp = false;
                }
            },
            verificationCode:function () {
                var _self = this;
                var reg = /^1[34578]\d{9}$/;
                if ($('#num').val() == "") {
                    _self.toast('请输入您的手机号码');
                    return
                } else if (!reg.test($('#num').val())) {
                    _self.toast('请输入正确格式的手机号码');
                    return
                } else if ($('#num').val() == "") {
                    $('#btn').attr("disabled",false);
                }
                this.post("/user/sendVerificationCode",{
                    command:'user/sendVerificationCode',
                    mobile:_self.tel,
                }).done(function (data) {
                        if(data.errcode==0){
                            _self.showAlert("已发送验证码 ！")
                            var i = 60;
                            var n = setInterval(function() {
                                var j = i + 's';
                                $('#btn').val(j).attr("disabled",true);
                                i--;
                                if (i < -1) {
                                    clearInterval(n);
                                    $('#btn').val('重新获取验证码!').attr("disabled",false);
                                }
                            }, 1000);
                        }else if (data.errcode==2703) {     //手机号已存在
                            _self.showAlert(data.errdesc)
                            // $('#btn').attr("disabled",true);
                        }
                        else{
                            _self.showAlert("验证码发送失败 ！")
                        }
                    })
            },
            back:function () {
                setTimeout(window.history.go(-1),1500);
            },
        }
    }

</script>

<style lang="scss" scoped>
    .btn-block{
        width: 100%;
        height: auto;
    }
    .redstar{
        color:red;
    }
    #num{
        float:left;
        width:60%;
    }
    .gender{
        display: block;
        width: 100%;
        height: auto;
    }
    .gender label{
        vertical-align: middle;
        display: inline-block;
        width: 40%;
    }
    .gender input{
        vertical-align: middle;
        /*-webkit-appearance: none;*/
    }
    .gender label span{
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

    /*发送验证码按钮*/
    #btn{
        float:left;
        width:40%;
        display: inline-block;
        zoom: 1;
        white-space: nowrap;
        vertical-align: middle;
        text-align: center;
        cursor: pointer;
        -webkit-user-drag: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        font-family: inherit;
        font-size: .22rem;
        padding: .4em .8em;
        line-height: 1.1;
        border: 1px solid #3499db;
        border-radius: .3em;
        color: #FFF;
        background: #3499db;
    }
    ::-webkit-input-placeholder{
        color: #fff;
    }
</style>
