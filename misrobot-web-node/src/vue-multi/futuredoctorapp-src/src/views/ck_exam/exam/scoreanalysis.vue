<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            成绩分析
            <div slot="headerRight">
                <router-link :to="{name: 'fdscorequery'}"
                             class="my-booking-btn">成绩查询</router-link>
            </div>
        </c-header>
        <div v-show="learnlist" class="select-model" @click="showSelect">
            <span>技能项</span>
            <span v-if="selectname" class="learnname" :class="{ active: this.selectModal.show}">{{selectname.learnname}}</span>
        </div>
        <div class="g-main" style="background: rgb(248,248,248)!important;">
            <div v-show="scoreseen">
                <div class="score">
                    <div class="total">
                        <span>总人数：<i>{{totalnum}}人</i></span>
                        <span>总课时：<i>{{totaltime}}小时</i></span>
                    </div>
                    <div>
                        <span>平均分：<i>{{avgscore | score}}</i></span>
                        <span>最高分：<i>{{maxscore | score}}</i></span>
                        <span>最低分：<i>{{minscore | score}}</i></span>
                    </div>
                </div>
                <template>
                    <div class="content">
                        <div id="echart"></div>
                    </div>
                </template>
            </div>
            <div v-show="errseen" class="err">
                <p>错误详情</p>
                <table border="1" class="points">
                    <tr>
                        <th>评分项</th>
                        <th>错误人数</th>
                    </tr>
                    <tr v-for="item in errorinfolist">
                        <td>{{item.learnitem}}</td>
                        <td>{{item.incorrectnum}}</td>
                    </tr>
                </table>
            </div>
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

        <no-content v-show="!scoreseen&&!errseen" :txtdescription="txtdescription"></no-content>
    </div>
</template>
<script>
    import $ from 'jquery';
    import methods from '../../../methods';
    import cModal from '../../../components/modal';
    import cHeader from '../../header';
    import noContent from '../../no_content.vue';
    import { mapState, mapActions } from 'vuex';
    import echarts from'echarts/lib/echarts';
    import 'echarts/lib/component/tooltip';
    import 'echarts/lib/component/legend';
    import 'echarts/lib/chart/pie'
    export default {
        data() {
            return {
                txtdescription:'当前技能项暂无考试记录',
                scoreseen:true,
                errseen:true,
                items:'',
                list:'',
                selectname:'',
                selectlearn:'',
                avgscore:'',
                maxscore:'',
                minscore:'',
                totalnum:'',
                totaltime:'',
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
                opinion: [],
                opinionData: [],
                errorinfolist:'',
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
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
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
                        _this.errseen=false;
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
                this.post('/examapply/queryreportbyteacherid', {
                    command: 'examapply/queryreportbyteacherid',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    teacherid: $.cookie('uid'),
                    learnid:_this.selectname.learnid
                }).done(function (data) {
                    if (data.averagescore){
                        if (data.averagescore%1 === 0){
                            _this.avgscore=data.averagescore;
                        }else {
                            _this.avgscore=data.averagescore.toFixed(1);
                        }
                    }
                    _this.errorinfolist=data.errorinfolist;
                    _this.maxscore=data.maxscore;
                    _this.minscore=data.minscore;
                    _this.totalnum=data.totalnum;
                    _this.totaltime=data.totaltime;
                    _this.opinionData='';
                    _this.opinionData=[{'value':data.firststage,'name':'0~20分:'+data.firststage+'人'},
                        {'value':data.secondstage,'name':'20~40分:'+data.secondstage+'人'},
                        {'value':data.thirdstage,'name':'40~60分:'+data.thirdstage+'人'},
                        {'value':data.fourthstage,'name':'60~80分:'+data.fourthstage+'人'},
                        {'value':data.fifthstage,'name':'80~100分:'+data.fifthstage+'人'}];
                    _this.opinion=[];
                    _this.opinionData.forEach(function(value,index){
                        _this.opinion.push(value.name);
                    });
                    _this.$nextTick(function() {
                        _this.drawGraph('echart')
                    });
                    if (data.firststage=='0'&&data.secondstage=='0'&&data.thirdstage=='0'&&data.fourthstage=='0'&&data.fifthstage=='0'){
                        _this.scoreseen=false;
                    }else {
                        _this.scoreseen=true;
                    }
                    if (data.errorinfolist==''){
                        _this.errseen=false
                    }else {
                        _this.errseen=true
                    }
                });
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
            drawGraph(id){
                // 绘图方法
                this.chart = echarts.init(document.getElementById(id));
                this.chart.showLoading();
                this.chart.setOption({
                    legend: {
                        orient: 'vertical',
                        x:'60%',
                        y:'20%',
                        data: this.opinion,
                        itemHeight:15,
                        itemWidth:15,
                        itemGap:10,
                        textStyle:{fontSize:16}
                    },
                    calculable: false,
                    series: [{
                        selectedOffset:0,
                        legendHoverLink:false,
                        hoverAnimation:false,
                        name: '分数',
                        type: 'pie',
                        // 位置，左右，上下
                        center: ['30%', '50%'],
                        radius:[0,'70%'],
                        label:{normal:{position:'inner',formatter:"{d}%"}},
                        data: this.opinionData
                    }]
                });
                this.chart.hideLoading();
            },
            back(){
                this.$router.push({
                    name: 'fdscorequery'
                })
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
        i {
            font-style: normal;
        }
        div:first-child {
            display: flex;
            justify-content: flex-start;
            span:first-child {
                margin-right: 0.2rem;
            }
        }
        div:nth-child(2) {
            display: flex;
            justify-content: space-between;
            span:nth-child(2) i {
                color: #94C9EC;
            }
            span:last-child i {
                color: #FFB039;
            }
        }
        .total {
            span {
                width:33.3%;
            }
        }
    }
    .content {
        height:4rem;
        padding:0.2rem;
        background:#fff;
        #echart {
            /*需要制定具体高度，以px为单位*/
            height: 100%;
            width:100%;
            border-top:1px solid #000;
        }
    }
    .err {
        background: #fff;
        margin-top: 0.1rem;
        padding:0.1rem;
        text-align: center;
    }
    .points {
        width:90%;
        margin:0.2rem auto;
        :nth-child(2) {
            width:10%;
        }
        tr {
            text-align: center;
            height:0.5rem;
            td:first-child {
                text-align: left;
            }
        }
        th {
            background: #C3C3C3;
        }
        td {
            height:0.6rem;
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
</style>
