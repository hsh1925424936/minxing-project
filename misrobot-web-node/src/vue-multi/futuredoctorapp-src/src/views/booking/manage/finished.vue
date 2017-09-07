<template>

    <div class="s_fin">

        <!--<div class="nav-top">-->
        <!--<p @click="cEnlist(index)"  v-for="(item,index) in navList" :class="{show:current==index}">{{item}}</p>-->
        <!--</div>-->
        <div class="select_box">
            <el-select v-model = "chooseType" @change = sel size="mini">
                <el-option label = "全部类型" value = ""></el-option>
                <el-option label = "班级预约" value = "1"></el-option>
                <el-option label = "个人预约" value = "2"></el-option>
                <el-option label = "出科考试预约" value = "3"></el-option>
            </el-select>
            <el-select v-model = "chooseResult" @change = sel size="mini">
                <el-option label = "全部结果" value = ""></el-option>
                <el-option label = "审批不通过" value = "0"></el-option>
                <el-option label = "审批通过" value = "1"></el-option>
            </el-select>
            <el-select v-model = "chooseTime" @change = sel size="mini">
                <el-option label = "全部时间" value = ""></el-option>
                <el-option label = "今天" value = "0"></el-option>
                <el-option label = "三天内" value = "3"></el-option>
                <el-option label = "一周内" value = "7"></el-option>
            </el-select>
        </div>


        <!--**************************班级预约审批******************************************-->
        <div style="padding-top: .5rem;">
        <div class="contentBox" v-for="(value,index) in finishedList" >
            <template v-if="value.status=='1'">
                <img src="../../../assets/images/label_tonggou.png" class="tgtp">
            </template>
            <template v-else>
                <img src="../../../assets/images/label_butonggou.png" class="btgtp">
            </template>
            <dl>
                <dd style="margin-top: 0;">
                    <span class="d-left"> 实验室名称：</span>
                    <span>{{ value.pname }}</span><span style="padding-top: .05rem;margin-left: .15rem;">
							<img src="../../../assets/images/ke-.png" style="height: .25rem;">
						</span>
                </dd>
                <dd>
                    <span class="d-left">实验室地址：</span>
                    <span>{{ value.displayname }}</span>
                </dd>
                <dd>
                    <span class="d-left">预 约 时 段：</span>
                    <span>{{ value.starttime | substr(0, 16)}}-{{value.endtime | substr(11, 5)}}</span>
                </dd>
                <dd>
                    <span class="d-left">被&nbsp;&ensp;占&nbsp;&ensp;用&ensp;：</span>
                    <span>{{ value.applyconsent }}/{{ value.volume }}</span>
                </dd>
                <dd>
                    <span class="d-left">申 请 人 数：</span>
                    <span>{{ value.applicants }}</span>
                </dd>
                <dd>
                    <span class="d-left">预 约 老 师：</span>
                    <span>{{ value.teachername }}&nbsp;&nbsp;{{value.mobile}}</span>
                </dd>
                <dd>
                    <span class="d-left">预约项名称：</span>
                    <p style="width: 62%;">
                        <span v-for="(value2,index2) in finishedList[index].learnids">{{ value2.learnname }}&nbsp;&nbsp;</span>
                    </p>
                </dd>
                <dd style="display: flex;">
                    <span class="d-left">预 约 备 注：</span>
                    <span style="width: 62%;display: inline-block;">{{ value.comment }}</span>
                </dd>
                <dd class="d_last clearfix">
                    <p class="d-left">审 批 意 见：</p>
                    <p class="d_right">{{ value.description }}</p>

                </dd>
            </dl>
        </div>
        </div>

        <!--*****************************考试预约审批****************************************-->
        <div class="contentBox" v-for="(value,index) in agreeTList">
            <template v-if="value.status=='0'">
                <img src="../../../assets/images/label_tonggou.png" class="tgtp">
            </template>
            <template v-else>
                <img src="../../../assets/images/label_butonggou.png" class="btgtp">
            </template>
            <dl>
                <dd style="margin-top:0;">
                    <span class="d-left"> 实验室名称：</span>
                    <span class="auto-width">{{ value.pname }}</span><span style="padding-top: .05rem;margin-left: .15rem;">
							<img src="../../../assets/images/kao.png" style="height: .25rem;">
						</span>
                </dd>
                <dd>
                    <span class="d-left">实验室地址：</span>
                    <span class="auto-width">{{ value.displayname }}</span>
                </dd>
                <dd>
                    <span class="d-left"> 预&nbsp;&ensp;约&nbsp;&ensp;人&ensp;：</span>
                    <span class="auto-width">{{ value.teachername }}&nbsp;&nbsp;{{value.mobile}}</span>
                </dd>
                <dd>
                    <span class="d-left">训练项名称：</span>
                    <span class="auto-width">{{ value.learnname }}</span>
                </dd>
                <dd>
                    <span class="d-left">审 批 人 数：</span>
                    <span>{{ value.volumemax }}</span>
                </dd>
                <dd>
                    <span class="d-left">预 约 时 段：</span>
                    <span>{{ value.starttime | substr(0, 16)}}-{{value.endtime | substr(11, 5) }}</span>
                </dd>
                <dd>
                    <span class="d-left">预 约 备 注：</span>
                    <span>{{ value.examcomment }}</span>
                </dd>
                <dd class="d_last clearfix" style="display: flex;">
                    <p class="d-left">审 批 意 见：</p>
                    <p class="d_right">{{ value.auditcomment}}</p>

                </dd>
            </dl>
        </div>

        <!--*****************************个人预约审批****************************************-->
        <div class="contentBox" v-for="(value,index) in personalList">
            <template v-if="value.status=='5'">
                <img src="../../../assets/images/label_butonggou.png" class="tgtp">
            </template>
            <template v-else>
                <img src="../../../assets/images/label_tonggou.png" class="btgtp">
            </template>
            <dl>
                <dd style="margin-top: 0;">
                    <span class="d-left"> 实验室名称：</span>
                    <span class="auto-width">{{ value.pname }}</span><span style="margin-left: .15rem;padding-top: .05rem;">
								<img src="../../../assets/images/geren.png" style="height: .25rem;">
							</span>
                </dd>
                <dd>
                    <span class="d-left">实验室地址：</span>
                    <span class="auto-width">{{ value.displayname }}</span>
                </dd>
                <dd>
                    <span class="d-left"> 预&nbsp;&ensp;约&nbsp;&ensp;人&ensp;：</span>
                    <span class="auto-width">{{ value.studentname }}&nbsp;&nbsp;{{value.mobile}}</span>
                </dd>
                <dd>
                    <span class="d-left">训练项名称：</span>
                    <span class="auto-width">{{ value.learnname }}</span>
                </dd>
                <dd>
                    <span class="d-left">预 约 时 段：</span>
                    <span>{{ value.starttime | substr(0, 16)}}-{{value.endtime | substr(11, 5) }}</span>
                </dd>
                <dd>
                    <span class="d-left">预 约 位 置：</span>
                    <span>{{value.code }}</span>
                </dd>
                <dd>
                    <span class="d-left">预 约 类 型：</span>
                    <span>{{value.type }}</span>
                </dd>
                <dd>
                    <span class="d-left">预 约 备 注：</span>
                    <span style="width: 62%;">{{ value.comment }}</span>
                </dd>
                <dd class="d_last clearfix" style="display: flex;">
                    <p class="d-left">审 批 意 见：</p>
                    <p class="d_right">{{ value.description}}</p>
                </dd>
            </dl>
        </div>

        <no-content v-show="personalList.length==0&&agreeTList.length==0&&finishedList.length==0"></no-content>
    </div>
</template>
<script>
    import $ from "jquery";
    import Vue from "vue";
    import { mapState, mapActions } from 'vuex';
    import noContent from '../../no_content.vue';
    import cHeader from '../../header';
    import Element from 'element-ui';
    import 'element-ui/lib/theme-default/index.css';

    Vue.use(Element);

    export default {
        props: ['active'],
        data() {
            return {
                isShadow: false,
                agreeBox: false,
                disagreeBox: false,
                finishedList: '',
                teacherid: '',
                scheduleid: '',
                starttime: '',
                endtime: '',
                placeid: '',
                agreeTList: '',
                sureEnlist: 0,
                personalList: '',
//				current:0,
                chooseType: '',
                chooseResult: this.$route.query.resulttype || '',
                chooseTime: this.$route.query.timetype || '',
            }
        },
        mounted() {
//			this.checked(9);
//			this.agreeT(9);
//          this.personalAgree(9);

            this.selectAll(9);
        },
        components: {
            noContent,
            cHeader,
        },
        watch: {
            'active': function (val, oldVal) {

                if (val) {
                    // 刷新
                    this.checked(9);
                    this.agreeT(9);
                    this.personalAgree(9);
                }
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
            errcodefn: function (res) {
                if (res.errcode == 9904) {
                    this.toast("登录信息已失效，请重新登录");
                    setTimeout(this.futureAppLogout, 2000)
                } else {
                    this.toast(res.errdesc)
                }
            },
            errfn: function () {
                this.toast("连接服务失败")
            },
            post: function (url, data, callback, errcodefn, errfn) {
                var self1 = this;
                data = JSON.stringify({"1": data});
                var req = new XMLHttpRequest();
                req.open('POST', url);
                req.onreadystatechange = function () {
                    if (req.readyState == 4) {
                        if (req.status == 200) {
                            if (typeof(req.responseText) == "string") {
                                var response = JSON.parse(req.responseText)["1"];
                            } else {
                                var response = req.responseText["1"]
                            }
                            ;
                            if (response.errcode == 0) {
                                callback(response)
                            } else {
                                self1.errcodefn(response)
                            }
                        } else {
                            self1.errfn()
                        }
                    }
                };
                req.send(data)
            },

//			cEnlist:function(index){
//				this.sureEnlist=index;
//				this.current=index;
//			},

            setCookie: function (name, value) { //设置cookie
                value = encodeURIComponent(value);
                document.cookie = name + "=" + value;
            },
            getCookie: function (name) { //获取cookie
                var arr = document.cookie.split("; ");
                for (var i = 0; i < arr.length; i++) {
                    var _arr = arr[i].split("=");
                    if (_arr[0] == name) {
                        return decodeURIComponent(_arr[1]);
                    }
                }
                return "";
            },
            sel: function () {
                var _self = this;
                if (_self.chooseType == 1) {
                    _self.finishedList = '';
                    _self.personalList = '';
                    _self.agreeTList = '';
                    _self.checked(9);
                } else if (_self.chooseType == 2) {
                    _self.finishedList = '';
                    _self.personalList = '';
                    _self.agreeTList = '';
                    _self.personalAgree(9);
                } else if (_self.chooseType == 3) {
                    _self.finishedList = '';
                    _self.personalList = '';
                    _self.agreeTList = '';
                    _self.agreeT(9);
                } else {
                    _self.finishedList = '';
                    _self.personalList = '';
                    _self.agreeTList = '';
                    _self.selectAll(9);
                }
            },
            selectAll: function (type) {
                var _self = this;
                _self.finishedList = '';
                _self.personalList = '';
                _self.agreeTList = '';
                _self.checked(type);
                _self.agreeT(type);
                _self.personalAgree(type);
            },
            checked: function (type) {
                //    			alert('checked');
                var self = this;
                self.finishedList = '';
                //alert('checked')
                var data = {
                    command: 'learn/queryapplylist',
                    sessionid: self.getCookie('sid'),
                    loginid: self.getCookie('uid'),
                    status: type, //0：待审批，1：待训练，2，不通过，3，已取消
                    uid: self.getCookie('uid'),
                    timetype: this.chooseTime,
                    isapprovepass: this.chooseResult,
                };
                //alert(JSON.stringify(data))
                function callback (res) {
                    //        			alert(JSON.stringify(res));
                    self.finishedList = res.applylist;
                };
                this.post('/learn/queryapplylist', data, callback, this.errcodefn, this.errfn)
            },
            agreeT: function (type) {
                var self = this;
                self.agreeTList = '';
                var data = {
                    command: 'examapply/queryexamapplylist',
                    sessionid: self.getCookie('sid'),
                    loginid: self.getCookie('uid'),
                    status: type,//1:待审核   9：已审核
                    timetype: this.chooseTime,
                    isapprovepass: this.chooseResult,
                };

                function callback (res) {
                    self.agreeTList = res.examapplylist;
                    for (var i = 0; i < self.agreeTList.length; i++) {
                        if (self.agreeTList[i].placeid == "-1") {
                            self.agreeTList[i].displayname = self.agreeTList[i].placeinfo;
                            self.agreeTList[i].roomnum = self.agreeTList[i].placeinfo;
                        }
                    }

                };
                this.post('/examapply/queryexamapplylist', data, callback, this.errcodefn, this.errfn)
            },
            personalAgree: function (type) {
                var self = this;
                self.personalList = '';
                var data = {
                    command: 'learn/querystuapplylist',
                    sessionid: self.getCookie('sid'),
                    loginid: self.getCookie('uid'),
                    status: type, //1:代审核   9：已审核
                    uid: self.getCookie('uid'),
                    timetype: this.chooseTime,
                    isapprovepass: this.chooseResult,
                };

                function callback (res) {
                    self.personalList = res.stuapplylist;
                    for (var i = 0; i < self.personalList.length; i++) {
                        if (self.personalList[i].type == 0) {
                            self.personalList[i].type = '在线训练';
                        } else if (self.personalList[i].type == 1) {
                            self.personalList[i].type = '模型';
                        } else if (self.personalList[i].type == 2) {
                            self.personalList[i].type = '智能设备';
                        } else {
                            self.personalList[i].type = "出科训练";
                        }
                    }
                };
                this.post('/learn/querystuapplylist', data, callback, this.errcodefn, this.errfn)
            },
        }
    }
</script>
<style lang="scss">
    @import "../../../scss/variables.scss";
    .s_fin dl>dd {
        margin-bottom: .14rem;
        display: flex;
    }
    .s_fin .show{
        color: #3499db;
    }
    .s_fin dd .d-left {
        width: 1.7rem;
        color: #747474;
        display: inline-block;
    }

    .s_fin dd span:nth-child(2) {
        color: #4c4c4c;
    }

    .s_fin dd .d-special {
        color: black;
        font-weight: 400;
    }

    .s_fin .tgtp,
    .btgtp {
        width: 1.1rem;
    }

    .s_fin .d_last {
        margin-bottom: -.4rem;
        display: flex;
        border-top: 1px solid lightgray;
    }

    .s_fin .d_last .d-left {
        line-height: 1rem;
    }

    .s_fin .d_last .d_right {
        margin-top: .13rem;
        padding-top: .2rem;
        width: 62%;
        display: inline-block;
        word-break: break-all;
    }

    .s_fin .nav-top {
        height: .9rem;
        width: 100%;
        background-color: #F8F8F8;
        line-height: .8rem;
        padding-left: .2rem;
        display: flex;
        padding-right: .2rem;
        justify-content: space-around;
        position: fixed;
        top: 1.48rem;
        z-index: 1000000;
    }

    .s_fin .nav-top p {
        font-size: .22rem;
        cursor: pointer;
        line-height: 1rem;
    }

    /***************下拉框********************/
    .select_box{
        width: 100%;
        height:auto;
        box-sizing: border-box;
        position:fixed;
        top:1.48rem;
        background-color: #fff;
        z-index:10;
    }
    .s_fin .el-select{
        text-align: center;
        display: inline-block;
        width: 32.2%;
    }
    .s_fin .el-input__inner{
        border: 1px solid #c0ccda;
    }
    .s_fin .el-select-dropdown__list{
        max-height: .8rem;
    }
    .s_fin .el-select-dropdown__item{
        font-size: .24rem;
        height: .6rem;
    }
    .el-input--mini .el-input__inner {
        height: .5rem !important;
    }
    .el-select-dropdown__item{
        font-size: .2rem !important;
        height: .5rem !important;
    }
    .el-select .el-input .el-input__icon{
        font-size: .2rem !important;
        width: auto !important;
    }
</style>
