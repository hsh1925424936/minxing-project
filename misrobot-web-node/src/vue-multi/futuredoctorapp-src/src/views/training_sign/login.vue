
<template>
    <div>
        <c-header>
            <div slot="headerLeft" v-show="from!='signedlist'">
                <a @click="back();" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            登录
        </c-header>
        <div  class="login_page">
            <div class="login_name">
                <input type="text" placeholder="请输入您的手机号" v-model="name" class="nameInput">
                <img id = "nameIcon" src="../../assets/images/zhanghao.png">
            </div>
            <div class="login_pwd">
                <input type="password" placeholder="请输入你的密码" v-model = "pwd" class="pwdInput">
                <img id = "pwdIcon" src="../../assets/images/mima.png">
            </div>
            <div class="login_button">
                <button @click = "login()" class="btnLoad">{{ btntext }}</button>
            </div>
        </div>
        <p @click="tosignin()" class="passman">新用户注册</p>
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
                comment:this.$route.query.comment,
                orgcode:this.$route.query.orgcode,
                from:this.$route.query.from,
                isneedinvoice:this.$route.query.isneedinvoice,
                invoiceheader:this.$route.query.invoiceheader,
                taxpayernumber:this.$route.query.taxpayernumber,
                address:this.$route.query.address,
                btntext:'登录并报名'
            }
        },
        components: {
            cHeader
        },
        created() {
            $("head").append('<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />'+'<meta http-equiv="Pragma" content="no-cache" />'+'<meta http-equiv="Expires" content="0" />')
        },
        mounted () {
            this.setTitle('登录')
//            console.log(JSON.stringify(this.$route.query))
            if(this.from=='signedlist'){
                this.btntext='登录'
            }
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
                        console.log($.cookie('uid'))
                        if(self.from=='signedlist'){
                            self.toast('登录成功')
                            setTimeout(function(){
                                self.$router.push({
                                    name: 'fdtraining_signedlist',
                                    query: ''
                                })
                            },2000)
                        }else{
                            self.post('/externaltrain/submittraininfo', {
                                command: "externaltrain/submittraininfo",
                                sessionid: $.cookie('sid'),
                                loginid: $.cookie('uid'),
                                planid:$.cookie('training_sign_planid'),
                                orgcode:self.orgcode,
                                uid: $.cookie('uid'),
                                comment:self.comment,
                                isneedinvoice:self.isneedinvoice,
                                invoiceheader:self.invoiceheader,
                                taxpayernumber:self.taxpayernumber,
                                address:self.address,
                            }).done(function(res){
                                if(res.errcode==0){
                                    self.toast('成功为您报名！')
                                    setTimeout(function(){
                                        self.$router.push({
                                            name: 'fdtraining_signedlist',
                                            query: ''
                                        })
                                    },1500)
                                }else if (res.errcode==3001) {
                                    self.toast(res.errdesc)
                                    setTimeout(function(){
                                        self.$router.push({
                                            name: 'fdtraining_signedlist',
                                            query: ''
                                        })
                                    },1500)
                                }
                            }).fail(function () {
                                self.toast('连接服务失败，请稍后再试')
                            })
                        }
                    }else if (data.errcode==1 || data.errcode==47) {
                        self.toast('用户名或密码错误！')
                    }else{
                        self.toast(data.errdesc);
                    }
                }).fail(function () {
                    self.showAlert("连接服务失败，请稍后再试")
                })
            },
            back:function () {
                this.$router.push({
                    name: 'fdtraining_coursedetail',
                    query: ''
                })
            },
            tosignin:function(){
                this.$router.push({
                    name: 'fdtraining_signin',
                    query: {
                        comment:this.comment,
                        orgcode:this.orgcode,
                        isneedinvoice:this.isneedinvoice,
                        invoiceheader:this.invoiceheader,
                        taxpayernumber:this.taxpayernumber,
                        address:this.address,
                    }
                })
            }
        }
    }

</script>
<style lang="scss" scoped>
    template{
        background-color: #f5f5f5;
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
</style>
