<template>
    <div class="booking-lab-sel g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            {{ pagetitle }}
        </c-header>
        <div class="seltimemain">
            <div class="changepagehandlers">
                <span class="pageleftbtn" @click="gettimetableprev()"><img src="../../assets/images/btn_left.png" alt=""></span>
                <span class="pagerightbtn" @click="gettimetablenext()"><img src="../../assets/images/btn_right.png" alt=""></span>
            </div>
            <ul class="seltimethead">
                <li></li>
                <li v-for="(value1,index1) in day">
                    <span class="fcontentgray titleweekday">{{ value1.day.slice(0,10) | daytoweek }}</span>
                    <span class="ftitlegray">{{ value1.day.slice(5,10) }}</span>
                </li>
            </ul>
        </div>
        <div id="labortimetable" class="g-main">
            <div class="timetable" border="1" cellspacing="0">
                <div>
                <div v-for="(value2,index2) in timeslist" class="flex">
                    <section class="flex-column">
                        {{ value2.starttime.slice(0,5) }}~
                        </br>
                        {{ value2.endtime.slice(0,5) }}
                    </section>
                    <section v-for="(value3,index3) in timeslist[index2].dayslist" :class="{'grayBack':value3.status==0?false:true}" @click.stop="queryDetails(value3.day.slice(0,11)+value3.starttime,value3.day.slice(0,11)+value3.endtime)">
                        <span v-if='value3.status!=0'>{{ value3.description }}</span>
                        <!--<input v-if='value3.status==0' type='checkbox' v-model='selecttimes' :value='value3' class='timecheckbox' />-->
                    </section>
                </div>
                </div>
            </div>
        </div>

        <c-modal :config="examModal">
            <ul class="box" v-for="value in exam">
                <li>
                    <span>时段：</span>
                    <span>{{value.starttime | substr(0, 16)}}-{{value.endtime | substr(11, 5)}}</span>
                </li>
                <li>
                    <span>教室容量：</span>
                    <span>{{value.volume}}</span>
                </li>
                <li>
                    <span>考试项目：</span>
                    <span>{{value.learnname}}</span>
                </li>
                <li>
                    <span>监考老师：</span>
                    <span>{{value.teacher}}</span>
                </li>
                <li>
                    <span>考生人数：</span>
                    <span>{{value.stunum}}</span>
                </li>
            </ul>
        </c-modal>

        <c-modal :config="courseModal">
            <ul class="box" v-for="value2 in course">
                <li>
                    <span>时段：</span>
                    <span>{{value2.starttime | substr(0, 16)}}-{{value2.endtime | substr(11, 5)}}</span>
                </li>
                <li>
                    <span>教室容量：</span>
                    <span>{{value2.volume}}</span>
                </li>
                <li>
                    <span>课程名称：</span>
                    <span>{{value2.learnname}}</span>
                </li>
                <li>
                    <span>上课老师：</span>
                    <span>{{value2.teacher}}</span>
                </li>
                <li>
                    <span>学生人数：</span>
                    <span>{{value2.stunum}}</span>
                </li>
            </ul>
        </c-modal>

        <c-modal :config="classModal">
            <ul class="box">
                <li>
                    <span>时段：</span>
                    <span>{{booking.starttime | substr(0, 16)}}-{{booking.endtime | substr(11, 5)}}</span>
                </li>
                <li>
                    <span>教室容量：</span>
                    <span>{{booking.volume}}</span>
                </li>
                <li>
                    <span>已预约数：</span>
                    <span>{{bookednum}}</span>
                </li>
                <li>
                    <span>训练项：</span>
                    <span>{{booking.learnname}}</span>
                </li>
                <li>预约记录：</li>
            </ul>
            <div class="teacherlistinfo">
                <ul v-for="(val,index) in booking.list">
                    <li>
                        <span>申请人{{index+1}}：</span>
                        <span>{{val.teacher}}</span>
                    </li>
                    <li>
                        <span>人数：</span>
                        <span>{{val.stunum}}</span>
                    </li>
                    <li>
                        <span>备注：</span>
                        <span>{{val.comment}}</span>
                    </li>
                </ul>
            </div>
        </c-modal>

        <c-modal :config="personalModal">
            <table class="studenttable" border="1">
                <tr>
                    <th>学生姓名</th>
                    <th>训练项目</th>
                    <th>位置</th>
                </tr>
                <tr v-for="value4 in personal">
                    <td>{{value4.student}}<br>{{value4.mobile}}</td>
                    <td>{{value4.learnname}}</td>
                    <td>{{value4.position}}</td>
                </tr>
            </table>
        </c-modal>
    </div>
</template>

<script>
    import $ from 'jquery'
    import methods from '../../methods'
    import cHeader from '../header'
    import cModal from '../../components/modal'
    import { mapState, mapActions } from 'vuex'
    import xieFn from '../../vuex/xie'
    export default {
        data() {
            return {
                pagetitle:this.$route.query.placename,
                placeid:this.$route.query.placeid,
                timeslist: [],//每周预约时间信息数组
                isChoosed:false,
                selecttimes:[],
                day:[],
                week:0,
                ispagehandlers:false,
                examModal: {
                    show: false,
                    title: '预约详情'
                },
                courseModal: {
                    show: false,
                    title: '预约详情'
                },
                classModal: {
                    show: false,
                    title: '预约详情'
                },
                personalModal: {
                    show: false,
                    title: '个人预约记录'
                },
                exam:[{
                    'starttime':'2014-01-01 18:05:20',
                    'endtime':'2014-01-01 18:05:20',
                    'volume':'60',
                    'learnname':'测试训练项1',
                    'teacher':'谢印东 1850840189',
                    'stunum':'20'
                }],
                course:[],
                booking:[
                    {
                        'starttime':'',
                        'endtime':'',
                        'volume':'',
                        'learnname':'',
                        'list':[]
                    }
                ],
                personal:[],
                bookednum:''
            }
        },
        components: {
            cHeader,
            cModal
        },
        filters: {
            daytoweek: function (oldvalue) {
                var newvalue=xieFn.whichday(oldvalue)
                return newvalue
            }
        },
        created() {
            this.gettimetable(this.week)
        },
        updated :function(){
            var tdwidth=$('.timetable td').width()
            $('.timetable td').each(function(){
                $(this).height(tdwidth)
            })
        },
        mounted () {
            var self = this
            this.registerToNative('goBack', function (data) {
                if(self.examModal.show){
                    self.examModal.show=false
                }else if(self.courseModal.show){
                    self.courseModal.show=false
                }else if(self.examModal.show){
                    self.classModal.show=false
                }else if(self.personalModal.show){
                    self.personalModal.show=false
                }else{
                    self.back()
                }
            })
            self.initscroll()
        },
        methods: {
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            ...methods,
            gettimetableprev:function(){
                this.week--
                this.gettimetable(this.week)
            },
            gettimetablenext:function(){
                this.week++
                this.gettimetable(this.week)
            },
            gettimetable:function(whichweek){//后台获取时间表
                console.log(whichweek)
                let self=this
                self.showLoading('加载中，请稍后...')
                setTimeout(function(){
                    self.hideLoading()
                },1000)
                this.post('/examapply/caledarmanage', {
                    command: 'examapply/caledarmanage',
                    loginid: $.cookie('uid'),
                    placeid: this.placeid,
                    sessionid: $.cookie('sid'),
                    type:whichweek//1是前一周，2是本周，3是下周
                }).done(function (data) {
                    self.timeslist = data.timeslist
                    self.day=data.timeslist[0].dayslist
                    for(var i=0;i<self.timeslist.length;i++){
                        for(var j=0;j<self.timeslist[i].dayslist.length;j++){
                            self.timeslist[i].dayslist[j].starttime=self.timeslist[i].starttime
                            self.timeslist[i].dayslist[j].endtime=self.timeslist[i].endtime
                        }
                    }
                });
            },
            back:function(){
                this.$router.push({
                    name: 'fdlaborquery',
                    query: ''
                })
            },
            forward: function () {
                if(this.selecttimes.length==0){
                    this.toast('请选择预约时间')
                    return
                }
                this.$router.push({
                    name: 'fdnewTestSave',
                    query: this.selecttimes
                })
            },
            initscroll:function(){//监听滑动事件
                var sw=document.body.clientWidth//页面宽度
                var self=this
                var startxpos=''
                var endxpos=''
                var area=document.getElementById('labortimetable')
                area.addEventListener('touchstart',function(e){
                    var touch = event.targetTouches[0]
                    startxpos=touch.pageX
                })
                area.addEventListener('touchmove',function(e){
                    var touch = event.targetTouches[0]
                    endxpos=touch.pageX
                })
                area.addEventListener('touchend',function(e){
                    if(endxpos!=''){//如果touchmove
                        if(startxpos-endxpos>=0){//用户向左滑,self. week++
                            if((startxpos-endxpos)/sw>=0.6){//滑动距离超过1/2屏
                                self.week++
                                self.gettimetable(self.week)
                                startxpos=''
                                endxpos=''
                            }else{
                                startxpos=''
                                endxpos=''
                            }
                        }else{//用户向右滑，self.week--
                            if((endxpos-startxpos)/sw>=0.6){//滑动距离超过1/2屏
                                self.week--
                                self.gettimetable(self.week)
                                startxpos=''
                                endxpos=''
                            }else{
                                startxpos=''
                                endxpos=''
                            }
                        }
                    }
                })
            },
            queryDetails:function(prama1,prama2){
                let self=this
                this.post('/examapply/labbookingdetail', {
                    command: 'examapply/labbookingdetail',
                    sessionid: $.cookie('sid'),
                    placeid: this.placeid,
                    loginid: $.cookie('uid'),
                    starttime:prama1,
                    endtime:prama2
                }).done(function (data) {
                    if (data.bookingtype==1){//课程预约
                        self.course=[];
                        self.course=data.bookinglist;
                        self.courseModal.show=true
                    }else if (data.bookingtype==2){//个人预约
                        self.personal=[];
                        self.personal=data.bookinglist;
                        self.personalModal.show=true
                    }else if (data.bookingtype==3){//出科考试预约
                        self.exam=[];
                        self.exam=data.bookinglist;
                        self.examModal.show=true
                    }else if (data.bookingtype==4){//班级预约
                        self.bookednum=[];
                        self.bookednum=data.bookednum;
                        self.booking.starttime=data.bookinglist[0].starttime;
                        self.booking.endtime=data.bookinglist[0].endtime;
                        self.booking.volume=data.bookinglist[0].volume;
                        self.booking.learnname=data.bookinglist[0].learnname;
                        self.booking.list=data.bookinglist;
                        self.classModal.show=true
                    }
                });
            }
        }
    }

</script>
<style lang="scss">
    .flex{
        display:flex;
    }
    .flex-column{
        display:flex;
        flex-direction: column;
        justify-content: center;
    }
    .timetable{
        border-color:#E2E2E2
    }
    /* .timetable section{
        box-sizing:border-box;
        width:12.5%;
        height:1.1rem;
        border:solid .01rem #c3c3c3;
        border-left:none;
        border-top:none;
        display:flex;
        justify-content: center;
        align-items: center;
    } */
    #labortimetable{
        height:86%;
    }
    .xieck_changepage{
        position:fixed;
        width:100%;
        top:40%;
        left:0;
    }
    .xieck_changepage>span{
        background-color: rgba(0,0,0,0.5);
        padding:.2rem .02rem;
    }
    .xieck_changepage>span>img{
        height:.8rem
    }
    .xieck_pageleft{
        float:left;
        border-radius:0 .1rem .1rem 0;
    }
    .xieck_pageright{
        float:right;
        border-radius:.1rem 0 0 .1rem;
    }
    ul.box {
       li {
           display: flex;
           border-bottom: 1px solid #ddd;
           margin:0.2rem;
           padding:0.1rem;
           span:first-child {
               width:1.2rem;
           }
       }
    }
    .teacherlistinfo {
        padding:0 0.2rem;
        font-size:0.2rem;
        ul {
            border:1px solid #eee;
            margin-bottom:0.2rem;
            li {
                border:none;
                padding:0.1rem;
                span:first-child {
                    width:1.2rem;
                    margin-left: 0.5rem;
                }
            }
        }
    }
    .studenttable {
        width:90%;
        margin:0.2rem auto;
        :first-child {
            width:30%;
        }
        :last-child {
            width:30%;
        }
        tr {
            text-align: center;
            height:0.5rem;
        }
    }
</style>
