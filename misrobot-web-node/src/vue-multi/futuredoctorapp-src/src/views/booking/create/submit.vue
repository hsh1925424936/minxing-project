<template>
    <div class="g-wrapper booking-submit">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            预约信息确认
        </c-header>

        <div class="g-main">
            <div class="list info-list">
                <div class="item valign-center">
                    <label>实验室名称：</label><div class="auto-width">{{labInfo.displayname}}</div>
                </div>
                <div class="item valign-center">
                    <label>实验室地址：</label><div class="auto-width">{{labInfo.pname}}</div>
                </div>
                <div class="item valign-center">
                    <label>管理员：</label><div class="auto-width">{{labInfo.uname}}&nbsp;&nbsp;{{labInfo.mobile}}</div>
                </div>
                <div class="item valign-center">
                    <label>预约时间段：</label><div class="auto-width">{{timeInfo.starttime | substr(0, 16)}}-{{timeInfo.endtime | substr(11, 5)}}</div>
                </div>
            </div>

            <div class="list info-list">
                <div class="item btn-item valign-center">
                    <label>课程名称：</label>
                    <div class="auto-width">{{selectedCourse | showLabel('course')}}</div>
                    <a class="btn btn-blue" @click="showSelectCourse()" v-show="showSelectCourseBtn">选择</a>
                </div>
                <div class="item valign-center">
                    <label>训练项名称：</label>
                    <div class="auto-width">{{selectLearns | showLabel('learn')}}</div>
                    <a class="btn btn-blue" @click="showSelectTrain()" v-show="showSelectLearnBtn">选择</a>
                </div>
                <div class="item valign-center">
                    <label>班级：</label>
                    <div class="auto-width">{{selectClasses | showLabel('class')}}</div>
                    <a class="btn btn-blue" @click="showSelectClass()">选择</a>
                </div>
                <div class="item valign-center">
                    <label>人数：</label>
                    <div class="auto-width">
                        <input type="number" v-model="stunumCount" min='0' class="stu-num" v-if='showStuNum'>
                        <div v-else>{{stunum}}</div>
                    </div>
                </div>
                <div class="item remark">
                    <label style="color:#666666;">备注：</label>
                    <div class="text-wrap">
                        <textarea v-model="comment"></textarea>
                    </div>
                </div>
            </div>
        </div>

        <div class="padding">
            <a class="btn btn-blue btn-lg btn-block" @click="bookingSubmit()"> 确认预约 </a>
        </div>

        <c-modal :config="classModal">
            <div class="flex flex-v-start class-sel-wrap">
                <div class="years">
                    <ul>
                        <li v-for="(it, gindex) in grades"
                            @click="gradeIndex = gindex;"
                            :class="{
                                'active': gindex === gradeIndex
                            }">{{it.gradename}}</li>
                    </ul>
                </div>
                <div class="fitem class-sel-list">
                    <template v-for="(it, index) in grades">
                        <div class="list info-list list-inner" v-show="index === gradeIndex">
                            <div class="item" v-for="cl in it.clslist">
                                <label class="flex flex-start flex-row">
                                    <div class="fitem">{{cl.clsname}}</div>
                                    <input type="checkbox" class="checkbox" v-model="selectClassids" :value="cl.clsid" />
                                </label>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            <template slot="buttons">
                <button type="button" class="btn" @click.stop="selectClass()">确定</button>
            </template>
        </c-modal>

        <c-modal :config="courseModal">
            <div class="flex-item class-sel-list">
                <div class="list info-list list-inner">
                    <div class="item" v-for="it in courses">
                        <label class="flex flex-start flex-row">
                            <div class="fitem">{{it.coursename}}</div>
                            <input type="radio" v-model="selectCourseid" :value="it.courseid" class="checkbox" />
                        </label>
                    </div>
                </div>
            </div>
            <template slot="buttons">
                <button type="button" class="btn" @click.stop="selectCourse()">确定</button>
            </template>
        </c-modal>

        <c-modal :config="trainModal">
            <div class="flex-item class-sel-list">
                <div class="list info-list list-inner">
                    <div class="item" v-for="it in learns">
                        <label class="flex flex-start flex-row">
                            <div class="fitem">{{it.name}}</div>
                            <input type="checkbox" v-model="selectLearnids" :value="it.learnid" class="checkbox" />
                        </label>
                    </div>
                </div>
            </div>
            <template slot="buttons">
                <button type="button" class="btn" @click.stop="selectTrain()">确定</button>
            </template>
        </c-modal>
    </div>
</template>

<script>

    import $ from 'jquery';
    import methods from '../../../methods';
    import cHeader from '../../header.vue';
    import cModal from '../../../components/modal';
    import { mapState, mapActions } from 'vuex';

    export default {
        data() {
            return {
                show: false,
                title: '我是一个Title',
                apply: null,
                labInfo: {},
                timeInfo: {},
                classModal: {
                    show: false,
                    title: '选择班级',
                    hideOnClickOut: true,
                    theme: 'hello-world'
                },
                courseModal: {
                    show: false,
                    title: '选择课程',
                    hideOnClickOut: true,
                    theme: 'hello-world'
                },
                trainModal: {
                    show: false,
                    title: '选择训练项',
                    hideOnClickOut: true,
                    theme: 'hello-world'
                },
                courses: [],
                learns: [],
                grades: [],
                gradeIndex: 0,

                scheduleid: null,
                stunum: 0,
                courseid: null,
                selectedCourse: null,
                selectCourseid: null,
                learnids: [],
                selectLearns: [],
                selectLearnids: [],
                classids: [],
                selectClasses: [],
                selectClassids: [],
                comment:'',
                showSelectCourseBtn:true,
                showSelectLearnBtn:true,
                showStuNum:true,
                stunumCount: 0  //用户输入的自定义学生数量
            }
        },
        components: {
            cHeader,
            cModal
        },
        created() {},
        mounted () {
            let self = this;
            //Date.parse(new Date(stringTime))
            var timeobj=[//测试时间对象数组排序
                {
                    starttime:'2017-05-04 11:00:00',
                    endtime:'2017-05-04 12:00:00'
                },{
                    starttime:'2017-05-04 08:00:00',
                    endtime:'2017-05-04 09:00:00'
                },{
                    starttime:'2017-05-04 09:30:00',
                    endtime:'2017-05-04 10:00:00'
                }
            ]
            var sorttimeobj=timeobj.sort(function(a,b){
                console.log(Date.parse(new Date(a.starttime)))
                return Date.parse(new Date(a.starttime))-Date.parse(new Date(b.starttime))
            })
            console.log(JSON.stringify(sorttimeobj))
            if(this.$route.query.from=='seltime'){
                if(this.$route.query.learnlist.length!=0){
                    self.learns=this.$route.query.learnlist;
                    self.showSelectLearnBtn=false;
                    this.$route.query.learnlist.forEach(function(value){
                        self.learnids.push(value.learnid)
                    })
                }
                if(this.$route.query.courseid){
                    self.showSelectCourseBtn=false;

                    /*self.selectedCourse={
                     coursename:this.$route.query.coursename,
                     courseid:this.$route.query.courseid
                     }*/
                    self.courses=[{
                        coursename:this.$route.query.coursename,
                        courseid:this.$route.query.courseid
                    }]
                    self.courseid=this.$route.query.courseid;
                }
            }
            this.init();

            this.registerToNative('goBack', function (data) {
                    if(self.classModal.show){
                        self.classModal.show=false
                    }else if(self.courseModal.show){
                        self.courseModal.show=false
                    }else if(self.trainModal.show){
                        self.trainModal.show=false
                    }else{
                        self.back();
                    }
                });
            },
        watch: {
            '$router': function (val, oldVal) {
                this.init();
            },
            'courseid': function (val, oldVal) {
                let ret = null;
                if(val && this.courses && this.courses.length) {

                    for(let j = 0; j < this.courses.length; j++) {
                        if(val === this.courses[j].courseid) {
                            ret = this.courses[j];
                            break;
                        }
                    }
                }

                this.selectedCourse = ret;
            },
            'learnids': function (val, oldVal) {
                let ret = [];
                if(val && val.length && this.learns && this.learns.length) {
                    for(let i = 0; i < val.length; i++) {

                        for(let j = 0; j < this.learns.length; j++) {
                            if(val[i] === this.learns[j].learnid) {
                                ret.push(this.learns[j]);
                                break;
                            }
                        }
                    }
                }

                this.selectLearns = ret;
            },
            'classids': function (val, oldVal) {

                let self = this;
                let ret = [];
                if(val && val.length && this.grades && this.grades.length) {
                    for(let i = 0; i < val.length; i++) {

                        for(let j = 0; j < this.grades.length; j++) {

                            if(this.grades[j] && this.grades[j].clslist && this.grades[j].clslist.length) {

                                let clslist = this.grades[j].clslist;
                                for(let k = 0; k < clslist.length; k++) {
                                    if(val[i] === clslist[k].clsid) {
                                        ret.push(clslist[k]);
                                    }
                                }
                            }
                        }
                    }

                    self.showStuNum = false;
                } else {
                    self.showStuNum = true;
                }

                this.selectClasses = ret;

                // 统计班级数量

                let promises = [];
                for(let i = 0; i < this.selectClasses.length; i++) {
                    promises.push(this.post('/cls/stulist', {
                        command: "cls/stulist",
                        sessionid: $.cookie('sid'),
                        loginid: $.cookie('uid'),
                        clsid: this.selectClasses[i].clsid
                    }));
                }

                $.when.apply($, promises)
                    .then(function (...rets) {

                        let count = 0;

                        if(rets && rets.length) {
                            for(let i = 0; i < rets.length; i++) {
                                count += (rets[i] && rets[i].stunum) || 0;
                            }
                        }

                        self.stunum = count;
                    });
            }
        },
        filters: {
            showLabel(arr, type) {
                let label = [];

                if(arr && type === 'course') {
                    label.push(arr.coursename);
                } else {
                    if(arr && arr.length) {
                        for(let i = 0; i < arr.length; i++) {
                            if(type === 'class') {
                                label.push(arr[i].clsname);
                            } else if(type === 'learn') {
                                label.push(arr[i].name);
                            }
                        }
                    }
                }

                return label.join('、');
            },
        },
        methods: {
            ...mapActions([
                'showAlert',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            ...methods,
            init() {
                let self = this;
                let learnids = [];
                let classids = [];

                this.labInfo = this.$route.query.labInfo;
                this.timeInfo = this.$route.query.timeInfo;
                this.apply = this.$route.query.apply;

                // 修改
                if(this.apply) {

                    this.labInfo = {
                        admin: this.apply.admin,
                        displayname: this.apply.displayname,
                        mobile: this.apply.mobile,
                        placeid: this.apply.placeid,
                        pname: this.apply.pname,
                        roomnum: this.apply.roomnum,
                        uname: this.apply.uname //,
                        // volume:
                    };

                    this.timeInfo = {
                        openid: this.apply.openid,
                        starttime: this.apply.starttime,
                        endtime: this.apply.endtime
                    };

                    this.selectedCourse = {
                        courseid: this.apply.courseid,
                        coursename: this.apply.coursename
                    };


                    this.scheduleid = this.apply.scheduleid;
                    this.comment = this.apply.comment;
                    this.stunum = this.apply.stunum;
                    this.stunumCount = this.apply.stunum;
                    this.selectLearns = this.apply.learnlist;
                    this.selectClasses = this.apply.classlist;

                    if(this.selectLearns) {
                        for(let i = 0; i < this.selectLearns.length; i++) {
                            learnids.push(this.selectLearns[i].learnid);
                        }
                    }

                    if(this.selectClasses) {
                        for(let i = 0; i < this.selectClasses.length; i++) {
                            classids.push(this.selectClasses[i].classid);
                        }
                    }
                    this.selectLearnids = [].concat(this.learnids);
                    this.selectClassids = [].concat(this.classids);
                } /*else {    //新增

                }*/

                // 课程名
                this.post('/course/querycoursenamelist', {
                    command: "course/querycoursenamelist",
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid')
                }).done(function (data) {
                    self.courses = data.coursenames;

                    if(self.apply) {
                        self.courseid = self.selectCourseid = self.apply.courseid;
                    }
                });

                // 训练项
                this.post('/learn/querylearninfobyplaceid', {
                    command: "learn/querylearninfobyplaceid",
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    placeid:self.labInfo.placeid
                }).done(function (data) {
                    self.learns = data.learnids;

                    if(self.apply) {
                        self.learnids = learnids;
                    }
                });

                // 班级
                this.post('/cls/clslist', {
                    command: "cls/clslist",
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid')
                }).done(function (data) {
                    self.grades = data.gradelist;

                    if(self.apply) {
                        self.classids = classids;
                    }
                });
            },
            back(){

                if(this.apply) {
                    this.$router.push({
                        name: 'fdMy'
                    });
                } else {
                    this.$router.push({
                        name: 'fdCreateSelTime',
                        query: this.labInfo
                    });
                }
            },
            showSelectClass() {
                this.classModal.show = true;
            },
            showSelectCourse(){
                this.courseModal.show = true;
            },
            showSelectTrain() {
                this.trainModal.show = true;
            },
            selectClass(){
                // this.showStuNum = false
                this.classModal.show=false;
                this.classids = [].concat(this.selectClassids);
            },
            selectCourse(){
                this.courseModal.show=false;
                this.courseid = this.selectCourseid;
            },
            selectTrain(){
                this.trainModal.show=false;
                this.learnids = [].concat(this.selectLearnids);
            },
            bookingSubmit(){
                let self = this;
                let learnKeys = [];
                let classKeys = [];
                let url = '/learn/submitapplybyteacher';
                let command = 'learn/submitapplybyteacher';
                let param;

                if(!this.labInfo || !this.labInfo.placeid) {
                    return this.showAlert({
                        msg: '请先选择教室！',
                        cb: function () {
                            self.$router.push({
                                name: 'fdCreate'
                            })
                        }
                    });
                }

                if(!this.timeInfo || !this.timeInfo.starttime) {
                    return this.showAlert({
                        msg: '请先选择时间段！',
                        cb: function () {
                            self.$router.push({
                                name: 'fdCreateSelTime',
                                query: self.labInfo
                            })
                        }
                    });
                }

                if(!this.courseid) {
                    return this.showAlert({
                        msg: '请选择课程！'
                    });
                }

                if(!this.learnids || !this.learnids.length) {
                    return this.showAlert({
                        msg: '请选择训练项！'
                    });
                }

                if(!this.classids || !this.classids.length) {
                    // return this.showAlert({
                    //     msg: '请选择班级！'
                    // });
                }
                for(let i = 0; i < this.learnids.length; i++) {
                    learnKeys.push({learnid: this.learnids[i]});
                }
                for(let i = 0; i < this.classids.length; i++) {
                    classKeys.push({classid: this.classids[i]});
                }

                if( !classKeys || !classKeys.length){
                    classKeys = [{classid: -1}];
                }
                param = {
                    command: command,
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    starttime:self.timeInfo.starttime,
                    endtime:self.timeInfo.endtime,
                    placeid:self.labInfo.placeid,//教室id
                    courseid: self.courseid,    //课程id
                    comment:self.comment,    //备注
                    learnlist: learnKeys,   //训练项数组 [{learnid:},{learnid:}]
                    classlist: classKeys,   //班级数组 [{classid:},{classid:}]
                    teacherid: $.cookie('uid'), //老师id
                    openid: self.timeInfo.openid    //开放时间段id
                };

                if(!self.classlist || !classlist.length) {
                    param.stunum = self.stunumCount  //人数
                }
                if(this.apply) {
                    url = '/learn/updateapplybyteacher';
                    param.command = 'learn/updateapplybyteacher';
                    param.scheduleid = self.scheduleid;
                }

                this.post(url, param).done(function (data) {

                    if(data && data.errcode == 0) {
                        self.showAlert('预约成功');
                        self.$router.push({
                            name: 'fdMy'
                        });
                    } else {
                        self.showAlert((data && data.errdesc) || '预约失败，请稍后再试。')
                    }

                }).fail(function () {
                    self.showAlert('预约失败，请稍后再试。')
                }).always(function () {

                });
            }
        }
    }

</script>
<style lang="scss">

    @import "../../../scss/variables.scss";

    .booking-submit{
        .info-list{
            margin-bottom:.14rem;

            .btn-item {
                padding-top:.16rem;
                padding-bottom:.16rem;
            }
            .btn{
                padding-top:.3em;
                padding-bottom:.3em;
                font-size: .26rem;
            }
            .valign-center{
            	font-size: .26rem;
            	font-weight: 300;

                label{
                    display:inline-block;
                    width: 1.6rem;
                    color:#666666!important;
                }
            }
            .remark{
                label{
                    float: left;
                    margin-top:.06rem;
                }
                .text-wrap{
                    margin-left:.85rem;

                    textarea{
                        width:100%;
                        font-size:.24rem;
                    }
                }
            }
        }

        .class-sel-wrap{
            padding-left:.2rem;
            .years{
                padding:.2rem;
                li{
                    width:100%;
                    color:#888;
                    margin-bottom:.1rem;
                    padding:.1rem 0;

                    &.active{
                         color: $blue;
                         border-bottom: .02rem solid $blue;
                     }
                }
            }
            .class-sel-list{
                width:100%;
            }
        }
        .stu-num{
        -moz-appearance: textfield;
        border: solid 1px #888;
        padding-left: .2rem;
        border-radius: .1rem;
        width: 100%;
    }
    }

</style>
