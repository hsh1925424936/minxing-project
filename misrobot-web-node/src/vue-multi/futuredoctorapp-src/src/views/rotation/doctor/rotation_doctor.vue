<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            住培轮转
        </c-header>
        <div class="g-main" v-if='!noContent'>
            <div class="headerMes margin flex">
                <img src="../../../assets/images/icon_morentoux-.png" alt="">
                <p class="flex-column">
                    <span>{{messages.name}}</span>
                    <span>年级：{{messages.period}}</span>
                </p>
            </div>
            <div class="main">
                <div class="rotation_plan margin flex" @click='detail'>
                    <span>轮转计划</span>
                    <a>{{messages.term}}<img src="../../../assets/images/bnt_xiangyou.png" alt=""></a>
                </div>
                <div class="rotation_progress margin">
                    <h2>轮转总进度</h2>
                    <div class="progress">
                        <div class="progressLine">
                            <img src="../../../assets/images/icon_guangbiao_on.png" alt="">
                            <img src="../../../assets/images/icon_guangbiao.png" alt="">
                            <p class="progressOn"><img src="../../../assets/images/icon_guangbiao_on.png"><small>还剩{{messages.remaining}}天</small></p>
                        </div>
                        <p class="progressTime flex"><span>开始日期<br>{{messages.begindate}}</span><span>结束日期<br>{{messages.enddate}}</span></p>
                    </div>
                </div>
                <div class="rotationContent">
                    <div class="rotation_place">
                        <span>轮转科室<span class="place">{{messages.deptname}}</span></span>
                        <img v-if='messages.turnstatus == 3' src="../../../assets/images/icon_yi.png" alt="">
                        <img v-if='messages.turnstatus == 1' src="../../../assets/images/icon_zhong.png" alt="">
                        <img v-if='messages.turnstatus == 0' src="../../../assets/images/icon_dairuke-.png" alt="">
                    </div>
                    <div class="rotation_person">
                        <p>
                            <span>科室主任：{{messages.head}}</span>
                        </p>
                        <p>
                            <span>科室秘书：{{messages.secretary}}</span>
                        </p>
                        <p v-if='messages.turnstatus != 0'>
                            <span>带教老师：{{messages.teaching}}</span>
                        </p>
                        
                    </div>
                    <ul>
                        <li><span>培训期：{{messages.begintime}}-{{messages.endtime}}</span></li>
                        <li><span>规定轮转时间：{{messages.settime}}</span><span v-if='messages.turnstatus != 0'>已轮转时间：{{messages.hasturn}}天</span></li>
                    </ul>
                    <div class="rotation_pro" v-if='messages.turnstatus != 0'>
                        <p>轮转科室进度</p>
                        <p class="grayBar"><span class="greenBar"></span><span class="rating">{{messages.progress | rating}}</span></p>
                    </div>
                    <div class="enter" v-if='messages.turnstatus != 0'>
                        <a @click='enter(messages.deptname)'>点击进入</a>
                    </div>
                </div>
            </div>
        </div>
        <no-content v-if='noContent'></no-content>
    </div>
</template>
<script>
    import $ from 'jquery'
    import cHeader from '../../header'
    import methods from '../../../methods'
    import moment from 'moment'
    import noContent from '../../no_content'
    export default {
        name: 'rotation_doctor',
        components: {
            cHeader,
            moment,
            noContent
        },
        filters: {
            rating: function (value) {
                return (value * 100).toFixed(0) + '%'
            }
        },
        data() {
            return {
                messages: {},
                noContent: false,
            }
        },
        created() {
            let self = this
            self.init()
            self.registerToNative('goBack', function (data) {
                self.back();
            });
        },
        methods: {
            ...methods,
            // 初始化获取住院医信息
            init: function () {
                let self = this
                self.post('/turn/turndoctor', {
                    command: 'turn/turndoctor',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    // uid:$.cookie('uid')
                }).done(function (data) {
                    self.messages = data
                    self.messages.begindate = self.checkDate(self.messages.begindate)
                    self.messages.enddate = self.checkDate(self.messages.enddate)
                    self.messages.begintime = self.checkDate(self.messages.begintime)
                    self.messages.endtime = self.checkDate(self.messages.endtime)
                    self.progress()
                }).fail(function (error) {
                    self.noContent = true
                })
            },
            checkDate(date) {
                if(date){
                    return date.split('-').join('.')
                }
            },
            // 返回键
            back: function () {
                location.href = '/pages/futuredoctorapp/application.html';
            },
            // 点击轮转计划箭头
            detail: function () {
                let self  = this
                if(self.messages.term){
                    self.$router.push({
                        name: "fdRotation_doctor_plan",
                        query:{
                            type:0,
                            teachingid:self.messages.teachingid,
                            deptid:self.messages.deptid
                        }
                    })
                }
            },
            // 点击进入按钮
            enter: function (deptname) {
                let self = this
                // alert(self.messages.deptid)
                if(deptname){
                    self.$router.push({
                        name: 'fdRotation_doctor_exam',
                        query: {
                            type: 1,
                            deptname: deptname,
                            teachingid:self.messages.teachingid,
                            deptid:self.messages.deptid
                        }
                    })
                }
            },
            // 进度条
            progress: function () {
                // 设置轮转进度条
                let self = this
                let startTime = moment(self.messages.begindate).format('X')
                let endTime = moment(self.messages.enddate).format('X')
                let nowTime = moment().format('X')
                let totalDays = Math.ceil((endTime - startTime) / 3600 / 24)
                let proTime = (totalDays - self.messages.remaining) / totalDays
                let progressLine = $('.progressLine')
                let progressOn = $('.progressOn')
                let progressOnImg = $('.progressOn').find('img')
                let width = progressLine.width()
                // console.log(width * proTime)
                // console.log(self.messages.remaining)
                let imgWidth = progressOnImg.width()
                // console.log(imgWidth)
                if (nowTime <= startTime) {
                    progressOn.css({
                        'width': '0px'
                    })
                    progressOnImg.css({
                        'display': 'none'
                    })
                } else {
                    progressOn.css({
                        'width': width * proTime + 'px',
                    })
                    progressOnImg.css({
                        'position': 'absolute',
                        'display': 'inline-block',
                        'left': width * proTime - imgWidth / 2 + 'px'
                    })
                }

                // 底部进度条
                let grayBar = $('.grayBar')
                let greenBar = $('.greenBar')
                let rating = $('.rating')
                let grayBarWidth = grayBar.width()
                greenBar.css({
                    'width': grayBarWidth * self.messages.progress + 'px'
                })
                if (self.messages.progress == 0) {
                    rating.css({
                        'left': '0px'
                    })
                } else {
                    rating.css({
                        'left': grayBarWidth * self.messages.progress - imgWidth / 2 + 'px'
                    })
                }
            },

        }
    }

</script>
<style scoped>
    .g-main {
        font-size:0.24rem;
        background: #f8f7f9!important;
        color: rgb(100,100,100);
    }

    .margin {
        margin: 0 auto;
        padding: 0 0.3rem;
    }

    .flex {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .flex-column {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .headerMes p {
        margin: 0;
        padding: 0 0.3rem;
    }

    .headerMes p span:nth-child(1) {
        margin-bottom: 0.1rem;
    }

    .headerMes {
        /*height: 1rem;*/
        background: white;
        padding: 0.1rem 0.3rem;
    }

    .headerMes img {
        width: 0.66rem;
        height: 0.66rem;
    }

    .rotation_plan {
        width: 100%;
        /*height: 0.66rem;*/
        padding: 0.1rem 0.3rem;
        background: white;
        margin-top: 0.15rem;
        justify-content: space-between;
        border-bottom: solid 1px rgb(240,240,240);
    }

    .rotation_plan img {
        position: relative;
        top: 0.03rem;
        width: 0.2rem;
        height: 0.2rem;
        margin-left: 0.1rem;
    }

    .rotation_progress {
        background: white;
        padding: 0.1rem 0.3rem;
    }

    .rotation_progress h2 {
        font-size: 0.22rem;
        font-weight: normal;
        /*padding: 0.1rem 0;*/
    }

    .progressLine {
        margin: 0.5rem 0.6rem 0.2rem 0.6rem;
        /*width: 90%;*/
        height: 0.05rem;
        background: #c3c3c3;
        position: relative;
    }

    .progressLine img {
        position: absolute;
        width: 0.4rem;
        height: 0.4rem;
        top: calc(50% - 0.2rem);
    }

    .progressLine img:nth-of-type(1) {
        left: -0.3rem;
    }

    .progressLine img:nth-of-type(2) {
        right: -0.3rem;
        /*background: lightgray;*/
    }

    .progressOn {
        width: 50%;
        background: #3499db;
        height: 0.05rem;
        position: relative;
    }

    .progressOn img {
        width: 0.4rem;
        height: 0.4rem;
        top: calc(50% - 0.2rem);
    }

    .progressOn small {
        width: 1.2rem;
        position: absolute;
        right: -0.7rem;
        top: -0.4rem;
        color: #3499db;
    }

    .progressTime {
        justify-content: space-between;
        /*padding: 0 0.3rem;*/
        /*color: #666666;*/
        font-size: 0.22rem;
        margin-bottom: 0;
    }

    .progressTime span {
        width: 1.5rem;
        text-align: center;
    }

    .progressTime span:nth-of-type(1) {
        text-align: left;
    }

    .progressTime span:nth-of-type(2) {
        text-align: right;
    }

    .rotationContent {
        margin-top: 0.15rem;
        padding: 0;
        background: white;
    }

    .rotation_place {
        /*height: 0.66rem;*/
        border-bottom: solid 1px rgb(240,240,240);
        line-height: 0.66rem;
        padding: 0.1rem 0.3rem;
        /*color: #333333;*/
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .place {
        margin-left: 0.4rem;
    }

    .rotation_place img {
        width: 1rem;
        height: 0.36rem;
    }

    .rotation_person {
        display: flex;
        flex-direction: column;
        border-bottom: solid 1px rgb(240,240,240);
        padding-top: 0.1rem;
        margin: 0 0.3rem;
        color: #666666;
    }

    .rotation_person p {
       /*padding-bottom: 0.1rem;*/
    }

   /* .rotation_person span {
        padding: 0.05rem 0 0;
    }*/

    .rotationContent ul {
        padding-top: 0.1rem;
        margin: 0 0.3rem;
        /*border-bottom: solid 1px #c3c3c3;*/
    }

    .rotationContent ul li {
        padding-bottom: 0.1rem;
        /*color: #666666;*/
    }

    .rotationContent ul li span:nth-of-type(2) {
        float: right;
    }

    .rotation_pro {
        padding: 0.1rem 0;
        margin: 0 0.3rem;
        border-top: solid 1px rgb(240,240,240);
        /*border-bottom: solid 1px #c3c3c3;*/
    }

    .grayBar {
        position: relative;
        margin: 0.35rem 0.2rem 0.05rem 0.2rem;
        height: 0.2rem;
        background: #c3c3c3;
        border-radius: 0.2rem;
    }

    .greenBar {
        display: inline-block;
        width: 50%;
        background: #3499db;
        height: 0.2rem;
        border-radius: 0.2rem;
        position: absolute;
    }

    .rating {
        position: absolute;
        top: -0.3rem;
        color: #3499db;
    }

    .enter {
        padding: 0.1rem 0.3rem;
        height: 0.66rem;
        border-top: solid 1px rgb(240,240,240);
    }

    .enter a {
        /*width: 1rem;*/
        height: 0.46rem;
        background: #3499db;
        text-align: center;
        line-height: 0.46rem;
        color: white;
        padding: 0 0.2rem;
        border-radius: 0.1rem;
        float: right;
    }

</style>
