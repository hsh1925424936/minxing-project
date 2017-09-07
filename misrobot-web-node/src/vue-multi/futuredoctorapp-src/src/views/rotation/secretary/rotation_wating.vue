<template>
        <div class="g-wrapper">
            <div class="title">
                <span>{{condition}}</span>
                <img @click.stop='selectDate' src="../../../assets/images/icon_rili.png" alt="">
            </div>
            <div class="g-main" v-if='!noContent'>
            <div v-for='(item,key) in turndoctors' class="list">
                <ul @click='plan(item.id)'>
                    <li class="head">
                        <div class="headDiv">
                            <img src="../../../assets/images/icon_morentoux-.png" alt="">
                            <div>
                                <p class="headerName">
                                    <span>{{item.name}}</span>
                                    <span>年级：{{item.period}}</span>
                                </p>
                                <p>
                                    <span>{{item.mobile}}</span>
                                </p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <span>专业基地：{{item.base}}</span>
                    </li>
                    <li>
                        <span>科&emsp;&emsp;室：{{item.dept}}</span>
                    </li>
                    <li>
                        <span>带教老师：{{item.teaching}}</span>
                    </li>
                    <li>
                        <span>培 训 期 ：{{item.begintime | date}}-{{item.endtime | date}}</span>
                    </li>
                </ul>
                <div class="footerBtn">
                    <a @click='confirmCourse(item)'>入科确认</a>
                </div>
            </div>
        </div>
         <transition name='fade'>
                <div v-show='showDate' class="date" @click='close'>
                    <!--<span class="triangle"></span>-->
                    <transition name='slide'>
                        <div class="modelCont" v-show='showDate' @click.stop='showDate = true'>
                            <div class="modelHeader">
                                <a @click.stop='close'>取消</a>
                                <a @click.stop='ok'>完成</a>
                            </div>
                            <div class="modelWating">
                                <p id="centerp"></p>
                                <!--<div class="first">-->
                                    <ul>
                                        <li v-for='item in years'>{{item}}年</li>
                                    </ul>
                                <!--</div>-->
                                <!--<div class="second">-->
                                    <ul>
                                        <li v-for='item in 12'>{{item}}月</li>
                                    </ul>
                               <!--</div>-->
                               
                            </div>
                        </div>
                    </transition>
                </div>
            </transition>
        <no-content v-if='noContent'></no-content>
        </div>

</template>
<script>
    import Vue from 'vue'
    import $ from 'jquery'
    import methods from '../../../methods'
    import noContent from '../../no_content'
    import {
        mapState,
        mapActions
    } from 'vuex'
    import bus from '../../../bus.js'
    export default {
        name: 'rotation_admin_right',
        components: {
            noContent,
        },
        filters: {
            date: function (value) {
                if(value){
                    return value.split('-').join('.')
                }else{
                    return
                }
                
            }
        },
        data() {
            return {
                turndoctors: [],
                showDate: false,
                years:['2014','2015','2016','2017','2018','2019'],
                condition: '入科日期选择',
                tpdid: 0,
                uid: '',
                num: '',
                year:2000,
                month:1,
                Year:0,
                Month:0,
                key:0,
                showCurrentYear:true,
                showCurrentMonth:true,
                noContent: false,
                enterNum:0
            }
        },
        mounted() {
            this.$nextTick(function(){
                let self = this
                self.init()
            })
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
            // 待入科数据
            init(date) {
                let self = this
                self.post('/turn/querytoturndoctors', {
                    command: 'turn/querytoturndoctors',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    month:date
                }).done(function (data) {
                    self.turndoctors = data.turndoctors
                    if (self.turndoctors.length == 0) {
                        self.noContent = true
                    }else{
                        self.noContent = false
                    }
                }).fail(function (error) {
                    self.noContent = true
                })
            },
            // 处理日期
            checkdate: function (value) {
                if(val){
                    return value.split('-').join('.')
                }
            },
            // 点击日历图片事件
            selectDate: function () {
                let self = this
                self.enterNum++
                this.showDate = true
                self.queryturnyears()
            },
            // 点击列表去计划页面
            plan: function (id) {
                this.$router.push({
                    name: 'fdRotation_doctor_plan',
                    query: {
                        id: id,
                    }
                })
            },
            // 在月份小于10的情况下，前面加上0
            checkDate: function (date) {
                if (date < 10) {
                    return '0' + date
                } else {
                    return date
                }
            },
            // 选择日期后点击遮罩层关闭弹出内容
            close: function () {
                this.showDate = false
            },
            // 选择年份
            queryturnyears(){
                let self = this
                 self.post('/turn/queryturnyears', {
                    command: 'turn/queryturnyears',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                }).done(function(data){
                    if(data.years){
                        self.years = data.years
                        if(self.enterNum == 1){
                            self.Year = self.years[0] + '年'
                            self.Month = '1月'
                            $($($('.modelWating').find('ul')[0]).find('li')[0]).css('color','black')
                            $($($('.modelWating').find('ul')[1]).find('li')[0]).css('color','black')
                        }
                        // 选择年份
                        $($('.modelWating').find('ul')[0]).on('scroll', function () {
                            let height = $('#centerp').offset().top
                            $($('.modelWating').find('ul')[0]).find('li').each(function () {
                                if ($(this).offset().top <= height + 10 && $(this).offset().top >= height - 10) {
                                    $(this).css('color','black').siblings().css('color','#c3c3c3')
                                    self.Year = $(this).text()
                                }
                            })
                            })
                        // 选择月份
                        $($('.modelWating').find('ul')[1]).on('scroll', function () {
                                let height = $('#centerp').offset().top
                                $($('.modelWating').find('ul')[1]).find('li').each(function () {
                                    if ($(this).offset().top <= height + 10 && $(this).offset().top >= height - 10) {
                                        $(this).css('color','black').siblings().css('color','#c3c3c3')
                                        self.Month = $(this).text()
                                    }
                                })
                        })
                    }
                }).fail(function(error){
                    console.log(error)
                })
            },
            // 选择日期后点击完成
            ok(){
                let self = this
                self.condition = self.Year + self.Month
                this.showDate = false
                self.init(self.Year.substr(0,self.Year.length-1)+'-'+self.checkDate(self.Month.substr(0,self.Month.length-1)))
            },
            // 点击入科确认按钮
            confirmCourse: function (item) {
                let self = this
                self.tpdid = item.tpdid
                self.uid = item.id
                self.num = item.num
                this.showConfirm({
                    title: '入科确认',
                    msg: '确认该住院医生入科吗？',
                    theme: 'modal-confirm modal-white',
                    cancel: function () {},
                    ok: function () {
                        // 入科确认
                        self.confirm(self.tpdid, self.uid, self.num)
                    },
                })
            },
            confirm: function (tpdid, uid, num) {
                let self = this
                self.post('/turn/updateturnstatus', {
                    command: 'turn/updateturnstatus',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    turnstatus: 1,
                    tpdid: tpdid,
                    uid: uid,
                    num: num
                }).done(function (data) {
                    // console.log(data)
                    if(data.errcode == '4002'){
                        self.showAlert({
                            msg:'之前的科室未轮转！',
                            cb: function () {
                                
                            }
                        });
                    }else if(data.errcode == '4003'){
                        self.showAlert({
                            msg: '之前的科室未出科！',
                            cb: function () {
                                
                            }
                        });
                    }else if(data.errcode == '0'){
                        bus.$emit('confirmDept')
                        self.init()
                    }      
                })
            }
        }
    }

</script>
<style scoped>
    .g-main {
        height: 100vh;
        margin-top: 0.8rem;
        font-size:0.22rem;
        background: #f8f7f9!important;
        color: rgb(100,100,100);
    }

    .modal-body {
        text-align: center!important;
    }

    .title {
        height: 0.8rem;
        line-height: 0.8rem;
        background: rgb(253,253,253);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.2rem 0.3rem;
        position: fixed;
        top: 1.47rem;
        border-top: solid 1px #c3c3c3;
        z-index: 5;
        font-size: 0.24rem;
    }

    .title img {
        width: 0.4rem;
        height: 0.4rem;
    }
    .fade-enter-active,
    .fade-leave-active {
        transition: all .5s;
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0;
    }

    .slide-enter-active,
    .slide-leave-active {
        transition: all .5s;
    }

    .slide-enter,
    .slide-leave-active {
        transform: translateY(100%);
        opacity: 0;
    }
    .date {
        position: fixed;
        top: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.2);
        z-index: 10;
    }
    .modelCont{
        width: 100%;
        height: 4rem;
        background: white;
        position: absolute;
        bottom: 0;
    }
    .modelHeader{
        width: 100%;
        height: 0.8rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: solid 1px #c3c3c3;
        padding: 0 0.2rem;
    }
    .modelHeader a:nth-last-of-type(1){
        color: #3499db;
    }
    #centerp{
        border-top: solid 1px #c3c3c3;
        border-bottom: solid 1px #c3c3c3;
        width: calc(100% - 0.4rem);
        height: 0.6rem;
        position: absolute;
        z-index: 5000;
        bottom: 1.3rem;
        margin-bottom: 0;
        /*margin-right: 0.2rem;*/
    }
    .modelWating{
        width: 100%;
        height: 3.2rem;
        overflow:hidden;
        /*overflow-y: auto;*/
        display: flex;
        justify-content: center;
    }
    /*.first,.second{
        width: 32%;
        height: 3.2rem;
        overflow: auto;
        padding: 1.3rem 0;
    }*/
    .modelWating ul{
        width: 32%;
        /*height: 100%;*/
        height: 3.2rem;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 1.3rem 0;
    }
    .modelWating ul li{
        width: 100%;
        height: 0.6rem;
        line-height: 0.6rem;
        text-align: center;
        color: #c3c3c3;
        position: relative;
    }
    .active{
        color: black!important;
    }
     ::-webkit-scrollbar {
        display: none;
    }
    /*.triangle {
        position: absolute;
        z-index: 100;
        top: 2.1rem;
        right: 0.4rem;
        width: 0;
        height: 0;
        border-left: 0.15rem solid transparent;
        border-right: 0.15rem solid transparent;
        border-bottom: 0.15rem solid white;
    }

    .date ul {
        width: 2.4rem;
        background: white;
        position: absolute;
        right: 0.1rem;
        top: 2.22rem;
        z-index: 1000;
        font-size: 0.24rem;
        z-index: 10;
        color: #333333;
        border: solid 1px #c3c3c3;
        border-radius: 0.15rem;
    }

    .date ul li {
        border-bottom: solid 1px #c3c3c3;
        text-align: left;
        height: 0.56rem;
        line-height: 0.56rem;
        margin-left: 0.4rem;
    }

    .date ul li:nth-last-of-type(1) {
        border: none;
    }*/

    .list {
        padding-top: 0;
        background: rgb(252,252,252);
    }

    .list ul {
        /*background: white;*/
        padding: 0 0.3rem 0;
        /*font-size: 0.24rem;*/
    }

    .list ul p {
        margin: 0;
    }

    .list ul li {
        padding: 0.05rem 0;
    }

    .list ul li:nth-of-type(1) {
        border-bottom: solid 1px rgb(240,240,240);
        padding: 0.1rem 0;
    }

    .list ul li:nth-of-type(2) {
        padding-top: 0.1rem;
    }

    .list ul li:nth-last-of-type(1) {
        /*border-bottom: none;*/
        padding-bottom: 0.1rem;
    }

    .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .headDiv {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        /*padding: 0.05rem 0;*/
    }

    .headDiv div {
        width: calc(100% - 1rem);
    }

    .headerName {
        width: 100%;
    }

    .headerName span:nth-of-type(1) {
        margin-bottom: 0.1rem;
    }

    .headerName span:nth-of-type(2) {
        float: right;
    }

    .headDiv img {
        width: 0.66rem;
        height: 0.66rem;
        margin-right: 0.2rem;
    }
    .footerBtn {
        border-top: solid 1px rgb(240,240,240);
        text-align: right;
        padding: .1rem 0;
        margin: 0 0.3rem;
    }
    .footerBtn a {
        background: #3499db;
        color: white;
        padding: 0.1rem 0.05rem;
        border-radius: 0.1rem;
    }
</style>
