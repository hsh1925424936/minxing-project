
<template>
    <div>
        <c-header>
            <div slot="headerLeft" v-show="false">
                <a @click="back();" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            登录
        </c-header>
        <div  class="login_page">
            <div class="login_name">
                <input id="uname" type="text" placeholder="请输入您的手机号/学号" v-model="name" class="nameInput">
                <img id = "nameIcon" src="../../assets/images/zhanghao.png">
            </div>
            <div class="login_pwd">
                <input id="upwd" type="password" placeholder="请输入你的密码" v-model = "pwd" class="pwdInput">
                <img id = "pwdIcon" src="../../assets/images/mima.png">
            </div>
            <div class="login_button">
                <button @click = "login()" class="btnLoad">登录</button>
            </div>
        </div>
        <p @click="tosignin()" class="passman">新用户注册</p>
        <p class="point">注：</p>
        <p class="point">1、因系统升级，您的用户密码已初始化为123456；可到明日良医app中，进入“我的”页面修改密码；</p>
        <p class="point">2、如果您通过初始密码登录不了，请注册新用户再预约。</p>
        <div id = "ad" class="padding" style="padding: 0;position: absolute;bottom: -.1rem;" v-show="removePicture">
            <a href="http://139.196.6.204:8090/misrobot-edms/chksys/" style="width: 100%;">
                <img src="../../assets/images/广告.png" style="width: 100%;"/>
            </a>
            <img src="../../assets/images/btn_closed.png" id="deleteBtn" @click="deleteBtn"/>
        </div>

    </div>

</template>

<script>
    import $ from 'jquery';
    import methods from '../../methods';
    import cHeader from '../header.vue';
    import { mapState, mapActions } from 'vuex';

    export default {
        data() {
            return {
                name:'',
                pwd:'',
                removePicture:true
            }
        },
        components: {
            cHeader
        },
        created() {
          $("head").append('<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />'+'<meta http-equiv="Pragma" content="no-cache" />'+'<meta http-equiv="Expires" content="0" />');
          $("body").css("position","relative").css("min-height",$("body").height());
        },
        mounted () {
            this.setTitle('登录')
        },
        methods: {
            ...methods,
            ...mapActions([
                'showAlert',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            login:function () {
                var self = this
                if(!self.name || !self.pwd){
                    self.toast('请填写用户名或密码')
                    return
                }
                self.post("/usr/login",{
                    command:"usr/login",
                    accountname:self.name,
                    password:self.pwd,
                    type:0
                }).done(function (data) {
                    if(data.errcode==0){
                        $.cookie("uid",data.userid)
                        $.cookie("sid",data.sessionid)
                        $.cookie("where",'myappoint_weixin_login')
                        console.log($.cookie('uid'))
                            self.toast('登录成功')
                            setTimeout(function(){
                                self.$router.push({
                                    name: 'fdpersonal',
                                    query: {
                                      from:'myappoint_weixin_login'
                                    }
                                })
                            },2000)
                    }else if (data.errcode==1 || data.errcode==47) {
                        self.toast('用户名或密码错误！')
                    }else{
                        self.toast(data.errdesc);
                    }
                }).fail(function () {
                    self.showAlert("连接服务失败，请稍后再试")
                })
            },
            tosignin:function(){
                this.$router.push({
                    name: 'fdMyAppoint_Weixin_signin',
                    query: {
                        comment:this.comment,
                        orgcode:this.orgcode
                    }
                })
            },
            deleteBtn:function(){
                this.removePicture=false;
            }
        }
    }

</script>
<style lang="scss" scoped>
    template{
        background-color: #f5f5f5;
    }
    .point{
        padding:0 .5rem;
        color: #9F9FA1;
    }
    .login_page img{
        width: .38rem;
    }
    .login_page input{
        padding-left: 1rem;
    }
    .login_page .nameInput,
    .login_page .pwdInput{
        width:100%;
        height: .78rem;
        margin:.2rem 0;
        border-color: rgb(51,51,51);
    }
    .login_name,.login_pwd{
        position: relative;
        margin: 0 .3rem;
    }
    #nameIcon,#pwdIcon{
        position:absolute;
        top:.2rem;
        left:.2rem;
    }
    .login_button {
        margin:.2rem .3rem;
    }
    .btnLoad{
        background-color: #3499db;
        text-align: center;
        font-size: .3rem;
        height: .78rem;
        width:100%;
        color:rgb(245,245,245);
        border-radius: .1rem;
    }
    .passman{
        text-align: right;
        margin-right: .3rem;
        font-size: .26rem;
        color: rgb(111,147,219);
    }
    .point{
        font-size: .23rem;
    }
    .logo{
        position: fixed;
        bottom: 0;
    }
    #deleteBtn{
        position: absolute;
        top: .2rem;
        right: .2rem;
        width: 8%;
    }
</style>
