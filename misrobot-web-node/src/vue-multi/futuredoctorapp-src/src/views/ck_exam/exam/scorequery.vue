<template>
    <div>
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            成绩查询
            <div slot="headerRight">
                <router-link :to="{name: 'fdscoreanalysis'}"
                             class="my-booking-btn">成绩分析</router-link>
            </div>
        </c-header>
        <div v-show="learnlist" class="select-model" @click="showSelect">
            <span>技能项</span>
            <span v-if="selectname" class="learnname" :class="{ active: this.selectModal.show}">{{selectname.learnname}}</span>
        </div>
        <div v-show="scoreseen">
            <div class="score">
                <p>考生成绩</p>
                <div>
                    <span>平均分：<i>{{avgscore | score}}</i></span>
                    <span>最高分：<i>{{maxscore | score}}</i></span>
                    <span>最低分：<i>{{minscore | score}}</i></span>
                </div>
            </div>
            <ul class="studentlist">
                <li v-for="value in list" @click="showDetails(value.examid,value.stuid)">
                    <span>{{value.stuname}}</span>
                    <span class="scoreicon">{{value.score | score}}</span>
                </li>
            </ul>
        </div>
        <c-modal :config="selectModal">
            <div class="flex-item class-sel-list">
                <div class="list info-list list-inner">
                    <div class="item" v-for="item in items">
                        <label class="flex flex-start flex-row">
                            <div class="fitem">{{item.learnname}}</div>
                            <input type="radio" v-model="selectlearn" :value="item" class="checkbox" />
                        </label>
                    </div>
                </div>
            </div>
            <template slot="buttons">
                <button class="btn" @click="select">确定</button>
                <button class="btn" @click="close">取消</button>
            </template>
        </c-modal>

        <c-modal :config="labInfoModal" class="examDetails">
            <div>
                <ul class="report">
                    <li><span>考生：</span>{{studentname}}</li>
                    <li><span>技能项：</span>{{skillname}}</li>
                    <li><span>得分：</span>{{getscore}}</li>
                </ul>
                <div v-if="seen">
                    <p>错误项</p>
                    <table border="1" class="points">
                        <tr>
                            <th>操作类别</th>
                            <th>错误项</th>
                        </tr>
                        <tr v-for="val in itempoints">
                            <td>{{val.point}}</td>
                            <td>{{val.deficiency}}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </c-modal>
        <no-content v-show="!scoreseen" :txtdescription="txtdescription"></no-content>
    </div>
</template>
<script>
    import $ from 'jquery';
    import methods from '../../../methods';
    import cModal from '../../../components/modal';
    import cHeader from '../../header';
    import xiefn from '../../../vuex/xie';
    import noContent from '../../no_content.vue';
    import { mapState, mapActions } from 'vuex';
    export default {
        data() {
            return {
                txtdescription:'当前技能项暂无考试记录',
                scoreseen:true,
                items:'',
                list:'',
                selectname:'',
                selectlearn:'',
                avgscore:'',
                maxscore:'',
                minscore:'',
                seen:true,
                selectModal: {
                    show: false,
                    title: '选择技能项'
                },
                labInfoModal: {
                    show: false,
                    title: '成绩详情'
                },
                skillname:'',
                studentname:'',
                getscore:'',
                itempoints:'',
                learnlist:false
            }
        },
        components: {
            cHeader,
            cModal,
            noContent
        },
        filters:{
            score: function (val) {
                return val+'分'
            }
        },
        created() {

        },
        mounted () {
            this.init();
            let _this=this;
            this.registerToNative('goBack', function (data) {
                _this.back();
            });
        },
        methods: {
            ...methods,
            init(){
                let _this=this;
                this.post('/examapply/querylearnidbyteacherid', {
                    command: 'examapply/querylearnidbyteacherid',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    teacherid: $.cookie('uid')
                }).done(function (data) {
                    if (data.learnlist==''){
                        _this.learnlist=false;
                        _this.scoreseen=false;
                        _this.txtdescription='您还未进行考官认证~'
                    }else {
                        _this.learnlist=true;
                        _this.items=data.learnlist;
                        _this.selectname=data.learnlist[0];
                        _this.query();
                    }
                });
            },
            query(){
                let _this=this;
                this.post('/examapply/querytechlearnstatistical', {
                    command: 'examapply/querytechlearnstatistical',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    learnid:_this.selectname.learnid
                }).done(function (data) {
                    _this.avgscore='';
                    _this.maxscore='';
                    _this.minscore='';
                    _this.list='';
                    if (data.avgscore){
                        if (data.avgscore%1 === 0){
                            _this.avgscore=data.avgscore;
                        }else {
                            _this.avgscore=data.avgscore.toFixed(1);
                        }
                    }
                    _this.maxscore=data.maxscore;
                    _this.minscore=data.minscore;
                    if (data.studentlist){
                        _this.list=data.studentlist;
                        _this.scoreseen=true
                    }else {
                        _this.scoreseen=false
                    }
                });
            },
            back(){
                this.$router.push({
                    name: 'fdCkExamExamMy'
                })
            },
            showSelect(){
                this.selectModal.show=true;
            },
            close (){
                this.selectModal.show=false;
            },
            select(){
                if (this.selectlearn==''){
                    this.toast('请选择技能项');
                    return
                }
                this.selectModal.show=false;
                this.selectname = "";
                this.selectname = this.selectlearn;
                this.query();
            },
            showDetails(param1,param2){
                let _this=this;
                this.post('/report/querystudentckreport', {
                    command: 'report/querystudentckreport',
                    examid:param1,
                    studentid:param2,
                    scoretype:"1"
                }).done(function (data) {
                    _this.skillname=data.skillname;
                    _this.studentname=data.studentname;
                    _this.getscore=data.getscore;
                    _this.itempoints=data.itempoints;
                    if (data.itempoints==''){
                        _this.seen=false;
                    }
                    _this.labInfoModal.show = true;
                });
            }
        }
    }
</script>
<style  lang="scss" scoped>
   .select-model {
       display: flex;
       justify-content: space-between;
       margin: 0.1rem 0;
       background: #fff;
       span {
           padding:0.2rem;
       }
   }
   .score {
       background:#fff;
       padding:0.2rem;
       div {
           display: flex;
           justify-content: space-between;
           i {
               font-style: normal;
           }
           span:nth-child(2) i {
               color: #94C9EC;
           }
           span:last-child i {
               color: #FFB039;
           }
       }
   }
   ul.studentlist {
       background:#fff;
       padding:0 0.2rem;
       li {
           display: flex;
           justify-content: space-between;
           padding:0.2rem;
           border-top:1px solid #D7D7D7;
       }
   }
   .report {
       margin-bottom: 0.1rem;
       border-bottom: 1px solid #000;
       li {
           span {
               width:1.2rem;
           }
       }
   }
   .points {
       width:100%;
       :first-child {
           width:30%;
       }
       tr {
           text-align: center;
           height:0.5rem;
           td:nth-child(2) {
               text-align: left;
           }
       }
   }
    .learnname:after {
        display: inline-block;
        content: '';
        width:0.26rem;
        height:0.26rem;
        margin-left:0.1rem;
        background: url("../../../assets/images/xia-jiantou.png") 0 0 no-repeat;
        background-size: 0.26rem 0.26rem;
        vertical-align: middle;
    }
   .learnname.active:after {
        background: url("../../../assets/images/shang-jiantou.png") 0 0 no-repeat;
        background-size: 0.26rem 0.26rem;
        vertical-align: middle;
    }
    .scoreicon:after {
        display: inline-block;
        content: '';
        width:0.26rem;
        height:0.26rem;
        margin-left:0.1rem;
        background: url("../../../assets/images/you-jiantou.png") 0 0 no-repeat;
        background-size: 0.26rem 0.26rem;
        vertical-align: middle;
    }
</style>
