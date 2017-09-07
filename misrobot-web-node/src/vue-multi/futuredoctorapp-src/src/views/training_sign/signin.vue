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
                    <label style="width:1.4rem">职称：</label>
                    <div class="auto-width">{{ prof.name }}</div>
                    <a class="btn btn-blue" @click="showSelectTitle()">选择</a>
                </div>

                <div class="item valign-center">
                    <label style="width:1.4rem">学历：</label>
                    <div class="auto-width">{{ edu.name }}</div>
                    <a class="btn btn-blue" @click="showSelectEdu()">选择</a>
                </div>

                <div class="item valign-center">
                    <label  style="width:1.4rem">出生年月：</label>
                    <div class="auto-width" style="text-align: center">{{ selYear }}年</div>
                    <a class="btn btn-blue" @click="showSelectBirthdayY()">选择年</a>
                    <div class="auto-width" style="text-align: center">{{ selMonth }}月</div>
                    <a class="btn btn-blue" @click="showSelectBirthdayM()">选择月</a>
                </div>

                <div class="item valign-center">
                    <label style="width:1.4rem">工作单位：</label>
                    <div class="auto-width">
                        <input type="text" id="position" v-model="position" placeholder="请输入工作单位">
                    </div>
                </div>

                <div class="item valign-center">
                    <label style="width:1.4rem">医院等级：</label>
                    <div class="auto-width">{{ hisGrade.name }}</div>
                    <a class="btn btn-blue" @click="showSelectHospital()">选择</a>
                </div>
            </div>
            <div class="padding">
                <button @click = "sign()" class="btn btn-blue btn-lg btn-block">注册并报名</button>
            </div>
        </div>
        <c-modal :config="zhicheng">
            <div class="flex-item class-sel-list">
                <div class="list info-list list-inner">
                    <div class="item" v-for="it in titlelist">
                        <label class="flex flex-start flex-row">
                            <div class="fitem">{{it.name}}</div>
                            <input type="radio" v-model="prof" :value="it" class="checkbox" />
                        </label>
                    </div>
                </div>
            </div>
            <template slot="buttons">
                <button type="button" class="btn" @click.stop="selectTitle()">确定</button>
            </template>
        </c-modal>
        <c-modal :config="xueli">
            <div class="flex-item class-sel-list">
                <div class="list info-list list-inner">
                    <div class="item" v-for="it in edulist">
                        <label class="flex flex-start flex-row">
                            <div class="fitem">{{it.name}}</div>
                            <input type="radio" v-model="edu" :value="it" class="checkbox" />
                        </label>
                    </div>
                </div>
            </div>
            <template slot="buttons">
                <button type="button" class="btn" @click.stop="selectEdu()">确定</button>
            </template>
        </c-modal>
        <c-modal :config="yiyuandengji">
            <div class="flex-item class-sel-list">
                <div class="list info-list list-inner">
                    <div class="item" v-for="it in hospitallist">
                        <label class="flex flex-start flex-row">
                            <div class="fitem">{{it.name}}</div>
                            <input type="radio" v-model="hisGrade" :value="it" class="checkbox" />
                        </label>
                    </div>
                </div>
            </div>
            <template slot="buttons">
                <button type="button" class="btn" @click.stop="selectHospital()">确定</button>
            </template>
        </c-modal>
        <c-modal :config="chushengnian">
            <div class="flex-item class-sel-list">
                <div class="list info-list list-inner">
                    <div class="item" v-for="it in years">
                        <label class="flex flex-start flex-row">
                            <div class="fitem">{{it}}</div>
                            <input type="radio" v-model="selYear" :value="it" class="checkbox" />
                        </label>
                    </div>
                </div>
            </div>
            <template slot="buttons">
                <button type="button" class="btn" @click.stop="selectBirthdayY()">确定</button>
            </template>
        </c-modal>
        <c-modal :config="chushengyue">
            <div class="flex-item class-sel-list">
                <div class="list info-list list-inner">
                    <div class="item" v-for="it in 12">
                        <label class="flex flex-start flex-row">
                            <div class="fitem">{{it}}</div>
                            <input type="radio" v-model="selMonth" :value="it<10?('0'+it):it" class="checkbox" />
                        </label>
                    </div>
                </div>
            </div>
            <template slot="buttons">
                <button type="button" class="btn" @click.stop="selectBirthdayM()">确定</button>
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
                zhicheng:{
                    show: false,
                    title: '选择职称',
                    hideOnClickOut: true,
                },
                xueli:{
                    show: false,
                    title: '选择学历',
                    hideOnClickOut: true,
                },
                yiyuandengji:{
                    show: false,
                    title: '选择医院等级',
                    hideOnClickOut: true,
                },
                chushengnian:{
                    show:false,
                    title:'选择出生年份',
                    hideOnClickOut:true,
                },
                chushengyue:{
                    show:false,
                    title:'选择出生月份',
                    hideOnClickOut:true,
                },
                id:"",
                uname:"",
                tel:"",
                validateCode:"",
                upwd:"",
                repassword:"",
                email:"",
                prof:"",
                edu:"",
                code:"",
                years:[],
                selYear:'',
                selMonth:'',
                title:"",
                birthday:"",
                position:"",
                hisGrade:"",
                selectModal:"",
                pickerOptions:{},
                pwdComp:false,
                nameLimit:false,
                pwdLimit:false,
                comment:this.$route.query.comment,
                orgcode:this.$route.query.orgcode,
                isneedinvoice:this.$route.query.isneedinvoice,
                invoiceheader:this.$route.query.invoiceheader,
                taxpayernumber:this.$route.query.taxpayernumber,
                address:this.$route.query.address,
                titlelist:[],//职称
                edulist:[],//学历
                hospitallist:[],//医院等级
            }
        },
        components: {
            cHeader,
            cModal,
        },
        mounted () {
            this.setTitle('注册')
            var self=this
            self.post('/hr/querylevellist',{//职称
                command:'hr/querylevellist',
                code:'title'
            }).done(function(res){
                self.titlelist=res.levellist
            })
            self.post('/hr/querylevellist',{//学历
                command:'hr/querylevellist',
                code:'education'
            }).done(function(res){
                self.edulist=res.levellist
            })
            self.post('/hr/querylevellist',{//医院等级
                command:'hr/querylevellist',
                code:'hospital'
            }).done(function(res){
                self.hospitallist=res.levellist
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
            showSelectTitle:function(){
                this.zhicheng.show=true
            },
            showSelectEdu:function(){
                this.xueli.show=true
            },
            showSelectHospital:function(){
                this.yiyuandengji.show=true
            },
            showSelectBirthdayY:function(){
                this.chushengnian.show = true;
                var presentYear = new Date().getFullYear();
                for(var i=presentYear - 60 ;i <= presentYear - 16; i++) {
                    this.years.push(i);
                }
            },
            showSelectBirthdayM:function(){
                this.chushengyue.show = true;
            },
            selectTitle:function(){
                this.zhicheng.show=false
            },
            selectEdu:function(){
                this.xueli.show=false
            },
            selectHospital:function(){
                this.yiyuandengji.show=false
            },
            selectBirthdayY:function () {
                this.chushengnian.show=false
            },
            selectBirthdayM:function () {
                this.chushengyue.show=false
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
                    title:_self.prof.id,
                    education:_self.edu.id,
                    birthday: (_self.selYear && _self.selMonth) ? _self.selYear+'-'+_self.selMonth+'-01' : '',
                    workunit:_self.position,
                    hospital:_self.hisGrade.id,
                }).done(function (data) {
                    if(data.errcode==0){
                        $.cookie("uid",data.userid)
                        $.cookie("sid",data.sessionid)
                        if($.cookie('training_sign_planid')){//如果已选planid就调报名接口
                            _self.post('/externaltrain/submittraininfo', {
                                command: "externaltrain/submittraininfo",
                                sessionid: $.cookie('sid'),
                                loginid: $.cookie('uid'),
                                planid:$.cookie('training_sign_planid'),
                                orgcode:_self.orgcode,
                                uid: $.cookie('uid'),
                                comment:_self.comment,
                                isneedinvoice:_self.isneedinvoice,
                                invoiceheader:_self.invoiceheader,
                                taxpayernumber:_self.taxpayernumber,
                                address:_self.address,
                            }).done(function(res){
                                if(res.errcode==0){
                                    _self.toast('注册成功，已为您报名！')
                                    setTimeout(function(){
                                        _self.$router.push({
                                            name: 'fdtraining_signedlist',
                                            query: ''
                                        })
                                    },1500)
                                }else{
                                    _self.toast(res.errdesc)
                                }
                            }).fail(function () {
                                _self.toast('连接服务失败，请稍后再试')
                            })
                        }else{//如果没选planid就跳转到课程列表页面让用户去选
                            _self.$router.push({
                                name: 'fdtraining_courselist',
                                query: ''
                            })
                        }
                    }else if(data.errcode==2701){
                        _self.toast(data.errdesc)
                        setTimeout(function(){
                            _self.$router.push({
                                name: 'fdtraining_login',
                                query: {
                                    orgcode:_self.orgcode,
                                    comment:_self.comment,
                                    isneedinvoice:_self.isneedinvoice,
                                    invoiceheader:_self.invoiceheader,
                                    taxpayernumber:_self.taxpayernumber,
                                    address:_self.address,
                                }
                            })
                        },2000)
                    }else if (data.errcode==47) {
                        _self.toast('存在未填写的必填项！')
                    }
                    else{
                        _self.showAlert(data.errdesc)
                    }
                })
                    .fail(function () {
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
                })
                    .done(function (data) {
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
//                            $('#btn').attr("disabled",true);
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
