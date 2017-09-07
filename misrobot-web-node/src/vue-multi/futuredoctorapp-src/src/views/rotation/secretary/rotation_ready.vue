<template>
    <div class="g-wrapper">

        <!--<div class="doctorsDiv">
            <c-tabs :bus="bus" @change-tab="changeTab">
                <template v-for='(it,index) in periods' class="tab">
                    <c-tab :title="it" :bus="bus" :data="it" :active='index == 0'></c-tab>
                </template>
            </c-tabs>
            <div>
                <a v-for='(item,index) in periods' @click='period(item,index)'>{{item}}</a>
            </div>

        </div>-->
        <div class="g-main">
            <!--待分配-->
            <div class="allotTeacher fixed" @click='allotTeacherAll'>
                <div>
                    <img v-show='assingning' src="../../../assets/images/icon_xiangxia-.png" alt="">
                    <img v-show='!assingning' src="../../../assets/images/bnt_xiangyou.png" alt="">
                    <span>待&ensp;分&ensp;配</span>
                </div>
                <span>{{assignteachlist.length}}</span>
            </div>
            <!-- <transition name='slide'> -->
            <div class="main assignMain" v-show='assingning'>
            <div v-for='(item,key) in assignteachlist' class="list" >
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
                        <span>培&ensp;训&ensp;期：{{item.begintime | date}}-{{item.endtime | date}}</span>
                    </li>
                    <li v-if='item.teaching'>
                        <span>轮转进度：{{item.progress | rating}}</span>
                    </li>
                </ul>
                <div class="footerBtn">
                    <a @click='allotTeacher(item.tpdid,item.turningdeptid)' v-if='item.teaching == null'>分配带教老师</a>
                    <a @click='finishTrain(item.tpdid,item.num,item.id)' v-else>出科确认</a>
                </div>
            </div>
            </div>
            <!-- </transition> -->
            <!--全部学员-->
            <div class="allotTeacher allStudent" @click='showAllStudent'>
                <div>
                     <img v-show='allStudent' src="../../../assets/images/icon_xiangxia-.png" alt="">
                     <img v-show='!allStudent' src="../../../assets/images/bnt_xiangyou.png" alt="">
                     <span>待&ensp;出&ensp;科</span>
                </div>
                <span>{{deptOutDoctors.length}}</span>
            </div>
            <div class="main allStuMain" v-show='allStudent'>
            <div v-for='(item,key) in deptOutDoctors' class="list">
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
                        <span>培&ensp;训&ensp;期：{{item.begintime | date}}-{{item.endtime | date}}</span>
                    </li>
                    <li>
                        <span>轮转进度：{{item.progress | rating}}</span>
                    </li>
                </ul>
                <div class="footerBtn">
                    <a @click='allotTeacher(item.tpdid,item.turningdeptid)' v-if='item.teaching == null'>分配带教老师</a>
                    <a @click='finishTrain(item.tpdid,item.num,item.id)' v-else>出科确认</a>
                </div>
            </div>
             </div>
        </div>
        <no-content v-if='noContent'></no-content>
        <!--<c-model :config='selTeacherModel'>
            <ol class="modelol">
                <li v-for='(item,index) in teachers'>
                    <span>{{item.name}}</span>
                    <input type="radio" :value='item.id' v-model='train' class="checkbox">
                </li>
            </ol>
            <template slot="buttons" style='position: fixed;top:0;'>
                <button type="button" class="btn btn-blue btn-sure" style="color:black;font-size: 0.3rem;" @click='close'>取消</button>
                <button type="button" class="btn btn-blue btn-false" style="color:black;font-size: 0.3rem;" @click='ok'>确认</button>
            </template>
        </c-model>-->
        <transition name='fade'>
            <div class="modelDiv" v-show='selTeacherShow' @click='close'>
                <transition name='slide'>
                    <div class="modelCont" v-show='selTeacherShow' @click.stop='selTeacherShow = true'>
                        <p class="modelHead">
                            <a @click.stop='close'>取消</a>
                            <a @click.stop='ok'>完成</a>
                        </p>
                        <p class="center"></p>
                        <ol class="teacherOl">
                            <li v-for='(item,index) in teachers' :data-id='item.id' :class='{teacherLi:index==0}'>{{item.name}}</li>
                        </ol>
                    </div>
                </transition>
            </div>
        </transition>
    </div>
</template>
<script>
    import $ from 'jquery'
    import Vue from 'vue'
    // import cTab from '../../../components/tab'
    // import cTabs from '../../../components/tabs'
    import cModel from '../../../components/modal'
    import methods from '../../../methods'
    import noContent from '../../no_content'
    import { mapState,mapActions } from 'vuex'
    import bus from '../../../bus.js'
    export default {
        name: 'rotation_admin_left',
        components: {
            // cTab,
            // cTabs,
            cModel,
            noContent,
        },
        filters: {
            date: function (value) {
                if(value){
                    return value.split('-').join('.')
                }
            },
            rating: function (value) {
                if(value || value == 0){
                    return (value * 100).toFixed(0) + '%'
                } 
            }
        },
        data() {
            return {
                teachers: [],
                totalDoctor: [],
                turndoctors: [],
                assignteachlist:[],
                deptOutDoctors:[],
                periods: ['全部', '2014级', '2015级', '2016级', '2017级', '2018级'],
                tpdid: 0,
                value: '全部',
                selTeacherShow: false,
                teacherid:0,
                slide:false,
                allStufixed:false,
                assingning:false,
                allStudent:true,
                noContent: false
                // enterNum:0
            }
        },
        watch: {
            // 'type': function (val, oldval) {
            //     this.value = val
            //     if (oldval == 1) {
            //         return
            //     } else {
            //         this.init(val)
            //     }
            // }
            // 分配带教老师
            // 'selTeacherShow':function(val,oldval){
            //     if(val == true){
            //         $($('ol>li')[0]).css('color','black')
            //     }
            // },
            // 监视待分配学员是否展开
            'assingning':function(val,oldval){
                if(val == true){
                    this.allStudent = false
                }
            },
            // 监视所有学员是否展开
            'allStudent':function(val,oldval){
                // console.log(oldval)
                // console.log(val)
                if(val == true){
                    this.assingning = false
                    $('.allStudent').css({
                        'position':'fixed',
                        'top':'2.14rem',
                        'z-index':'10'
                    })
                    $('.allStuMain').css('margin-top','0.66rem');
                }
            }
        },
        mounted() {
            let self = this
            this.$nextTick(function(){
                self.init('全部')
                bus.$on('confirmDept',function(){
                    self.init('全部')
                })
                $('.allStudent').css({
                    'position':'fixed',
                    'top':'2.14rem',
                    'z-index':'10'
                })
                $('.allStuMain').css('margin-top','0.66rem');
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
            // 选择相应的年级
            // period(item, index) {
            //     let self = this
            //     let $divA = $('.doctorsDiv').find('div').find('a')
            //     $($divA[index]).css('color','#3497db').siblings().css('color','black')
            //     self.init(item)
            // },
            // 点击待分配
            allotTeacherAll(){
                $('.allStudent').css('position','inherit')
                $('.assignMain').css('margin-top','0px')
                this.assingning = !this.assingning
            },
            // 点击所有学员
            showAllStudent(){
                $('.allStuMain').css('margin-top','0.66rem');
                this.allStudent = !this.allStudent

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
            // 初始化轮转中学生数据
            init(period) {
                let self = this
                let postdata = {
                    command: 'turn/queryturningdoctors',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                }
                if (period == '全部') {
                    postdata = postdata
                } else {
                    postdata.period = period
                }
                self.post('/turn/queryturningdoctors', postdata)
                    .done(function (data) {
                        if (data.periods) {
                            data.periods.unshift('全部')
                            self.periods = data.periods
                            // 动态的判断级数导航条的宽度
                            // let $dDiv = $($('.doctorsDiv')[0])
                            // let $dDivD = $dDiv.find('div')
                            // let $dDivA = $dDiv.find('a')
                            // let dWidth = $dDiv.width()
                            // let aWidth = $dDivA.width()
                            // aWidth = dWidth / 5
                            // $dDivA.width(aWidth)
                            // $dDivD.width(self.periods.length * aWidth)
                            // console.log(dWidth)
                            // console.log(aWidth)
                            // console.log($dDivA.text())
                            // $($dDivA[0]).css({
                            //     'color': '#3499db'
                            // })
                        }
                        // self.turndoctors = []
                        self.turndoctors = data.turndoctors
                        self.assignteachlist = []
                        self.deptOutDoctors = []
                        self.turndoctors.map(function(item,index,arr){
                            if(item.teaching == null){
                                self.assignteachlist.push(item)
                            }else{
                                self.deptOutDoctors.push(item)
                            }
                        })
                        

                        if (self.turndoctors.length == 0) {
                            self.noContent = true
                        } else {
                            self.noContent = false
                        }

                    }).fail(function (error) {
                        self.noContent = true
                    })
            },
            // 分配带教老师
            allotTeacher: function (tpdid,deptid) {
                // this.enterNum++
                this.selTeacherShow = true
                this.tpdid = tpdid
                this.getTeacher(deptid)
                // console.log(this.tpdid)
            },
            // 带教老师数据请求
            getTeacher: function (id) {
                let self = this
                this.post('/turn/queryteaching', {
                    command: 'turn/queryteaching',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    deptid:id
                }).done(function (data) {
                    if(data.teachinglist && data.teachinglist.length != 0){
                    self.teachers = data.teachinglist
                    // 选择分配带教老师时
                    self.teacher = self.teachers[0]
                    // 默认teacherid 为第一个数据的id
                    self.teacherid = self.teachers[0].id
                    $('ol').on('scroll', function () {
                        let height = $($('.center')[0]).offset().top
                        $($('ol>li')[0]).removeClass('teacherLi')
                        $('ol>li').each(function () {
                            if ($(this).offset().top <= height + 10 && $(this).offset().top >= height - 10) {
                                $(this).css('color','black').siblings().css('color','#c3c3c3')
                                self.teacherid = $(this).attr('data-id')
                            }
                        })
                    })
                }
                })
            },
            // 取消按钮
            close() {
                this.selTeacherShow = false
            },
            // 确定按钮
            ok() {
                let self = this
                if (self.teacher == '') {
                    self.toast('至少选择一个带教老师')
                    self.selTeacherShow = true
                } else {
                    self.selectTeacher()
                    this.selTeacherShow = false
                }
            },
            // 分配带教老师接口
            selectTeacher() {
                let self = this
                self.post('/turn/assignteaching', {
                    command: 'turn/assignteaching',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    teachingid: self.teacherid,
                    tpdid: self.tpdid
                }).done(function (data) {
                    self.init(self.value)
                })
            },
            // 出科确认
            finishTrain(tpdid,num,uid) {
                let self = this
                this.showConfirm({
                    title: '出科确认',
                    msg: '是否确认该学员出科？',
                    theme: 'modal-confirm modal-white',
                    cancel: function () {},
                    ok: function () {
                        // 入科确认
                        self.post('/turn/updateturnstatus', {
                            command: 'turn/updateturnstatus',
                            sessionid: $.cookie('sid'),
                            loginid: $.cookie('uid'),
                            turnstatus: 3,
                            tpdid: tpdid,
                            num:num,
                            uid:uid
                        }).done(function (data) {
                            self.init(self.value)
                        }).fail(function (error) {

                        })
                    },
                })

            },
            // 数组去重
            unique: function (arr) {
                let res = [];
                let json = {};
                for (var i = 0; i < arr.length; i++) {
                    if (!json[arr[i]]) {
                        res.push(arr[i]);
                        json[arr[i]] = 1;
                    }
                }
                return res.sort();
            },
            // changeTab(tab) {
            //     this.type = tab.data;
            // },
        }
    }
</script>
<style scoped>
    .g-main{
        padding-top: 0.66rem;
        font-size:0.22rem;
        background: #f8f7f9!important;
        color: rgb(100,100,100);
    }
    .allotTeacher{
        width: 100%;
        height: 0.66rem;
        background: rgb(253,253,253);
        /*border-bottom: solid 1px #c3c3c3;*/
        /*color: #3499db;*/
        line-height: 0.66rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0.3rem;
    }
    .fixed{
        position: fixed;
        top: 1.48rem;
        z-index: 10;
    }
    .allotTeacher img{
        width: 0.2rem;
        height: 0.2rem;
        margin-right: 0.2rem;
        /*float: right;*/
    }
    /*.main{
        margin-bottom: 0.2rem;
    }*/
    /*.main:nth-last-of-type(1){
        margin-top: .2rem;
    }*/
    .list {
        padding-top: 0;
        /*background: white;*/
        background: rgb(252,252,252);
    }
    .doctorsDiv {
        width: 100%;
        height: 0.6rem;
        overflow-x: auto;
    }

    .doctorsDiv a {
        display: inline-block;
        height: 0.6rem;
        line-height: 0.6rem;
        text-align: center;
    }

    ul {
        background: rgb(252,252,252);
        padding: 0 0.3rem 0;
        
    }

    ul p {
        margin: 0;
    }

    ul li {
        padding: 0.05rem 0;
    }

    ul li:nth-of-type(1) {
        border-bottom: solid 1px rgb(240,240,240);
        padding: 0.1rem 0;
    }

    ul li:nth-of-type(2) {
        padding-top: 0.1rem;
    }

    ul li:nth-last-of-type(1) {
        padding-bottom: 0.1rem;
        border-bottom: solid 1px rgb(240,240,240);
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
        padding: 0.05rem 0;
    }

    .headDiv div {
        width: calc(100% - 1rem);
    }

    .headerName {
        width: 100%;
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
        width: 100%;
        height: 0.66rem;
        padding: .15rem 0.3rem;
        background: rgb(252,252,252);
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .footerBtn a {
        background: #3499db;
        color: white;
        padding: 0.1rem 0.05rem;
        border-radius: 0.1rem;
    }

    .modelol {
        height: 2rem;
        overflow-y: auto;
    }

    .modelol li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 0.5rem;
        padding: 0 0.5rem;
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

    .modelDiv {
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.2);
        position: fixed;
        top: 0;
        z-index: 100;
    }

    .modelCont {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 4rem;
        background: white;
    }

    .modelHead {
        width: 100%;
        height: 0.8rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0.2rem;
        border-bottom: solid 1px #c3c3c3;
        margin: 0;
    }

    .modelHead a:nth-last-of-type(1) {
        color: #3499db;
    }

    .modelCont ol {
        width: 100%;
        height: 3.2rem;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 1.3rem;
    }

    .modelCont ol li {
        width: 100%;
        height: 0.6rem;
        line-height: 0.6rem;
        text-align: center;
        color: #c3c3c3;
    }

    .center {
        border-top: solid 1px #c3c3c3;
        border-bottom: solid 1px #c3c3c3;
        width: calc(100% - 0.4rem);
        height: 0.6rem;
        position: absolute;
        z-index: 5000;
        bottom: 1.3rem;
        margin: 0 0.2rem;
    }

     ::-webkit-scrollbar {
        display: none;
    }
    /*.slide-enter-active,.slide-leave-active{
        transition: all .5s ease;
    }
    .slide-enter,.slide-leave-active{
        transform: translateY(-100%);
        opacity: 0;
    }*/
    .teacherLi{
        color: black!important;
    }
</style>
