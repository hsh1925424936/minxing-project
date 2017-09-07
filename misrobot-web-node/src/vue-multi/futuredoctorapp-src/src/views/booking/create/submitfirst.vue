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
                    <label>实验室名称：</label><div class="auto-width">{{labInfo.pname}}</div>
                </div>
                <div class="item valign-center">
                    <label>实验室地址：</label><div class="auto-width">{{labInfo.displayname}}</div>
                </div>
                <div class="item valign-center">
                    <label>教室容量：</label><div class="auto-width">{{labInfo.volume}}</div>
                </div>
                <div class="item valign-center">
                    <label>管理员：</label><div class="auto-width">{{labInfo.uname}}&nbsp;&nbsp;{{labInfo.mobile}}</div>
                </div>
                <div class="item valign-center">
                    <label>预约时段：</label><div class="auto-width">{{ timeInfo }}</div>
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
                    <label>上课班级：</label>
                    <div class="auto-width">{{selectClasses | showLabel('class')}}</div>
                    <a class="btn btn-blue" @click="showSelectClass()">选择</a>
                </div>
                <div class="item valign-center">
                    <label>训练人数：</label>
                    <div class="auto-width">
                        <input type="number" v-model="stunumCount" min='0' class="stu-num" v-if='showStuNum'>
                        <div v-else>{{stunum}}</div>
                    </div>
                </div>
                <div class="item remark">
                    <label>备注说明：</label>
                    <div class="text-wrap" style="margin-left:1.6rem">
                        <textarea v-model="comment"></textarea>
                    </div>
                </div>
            </div>
        </div>

        <div class="padding">
            <a class="btn btn-blue btn-lg btn-block" @click="istogetherfn()"> 确认预约 </a>
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
                            <div class="item" v-for="cl in it.classlist">
                                <label class="flex flex-start flex-row">
                                    <div class="fitem">{{cl.classname}}</div>
                                    <input type="checkbox" class="checkbox" v-model="selectClassids" :value="cl.id" />
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
        <c-modal :config="istogether">
            <div class="flex-item class-sel-list">
                <div class="list info-list list-inner">
                    <div class="item">
                        <label class="flex flex-start flex-row">
                            <div class="fitem">允许</div>
                            <input type="radio" v-model="confirmtogether" :value="1" class="checkbox" />
                        </label>
                    </div>
                    <div class="item">
                        <label class="flex flex-start flex-row">
                            <div class="fitem">不允许</div>
                            <input type="radio" v-model="confirmtogether" :value="0" class="checkbox" />
                        </label>
                    </div>
                </div>
            </div>
            <template slot="buttons">
                <button type="button" class="btn" @click.stop="bookingSubmit()">确定</button>
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
    import xieFn from '../../../vuex/xie'
    export default {
        data() {
            return {
                show: false,
                title: '我是一个Title',
                apply: null,
                labInfo: {
                    displayname:xieFn.getCookie('selLabPlaceAddress'),
                    pname:xieFn.getCookie('selLabPlaceName'),
                    uname:xieFn.getCookie('selLabAdminName'),
                    mobile:xieFn.getCookie('selLabAdminMobile'),
                    placeid:xieFn.getCookie('selLabPlaceId'),
                    volume:xieFn.getCookie('selLabVolume')
                },
                timeInfo: '',//赋值到页面的时间段
                timelist:[],//传给后台的时间段数组
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
                istogether:{
                    show: false,
                    title: '教室还有空位，是否允许其他老师一起上课？',
                    hideOnClickOut: true,
                    theme: 'hello-world'
                },
                confirmtogether:1,//用户选择是否与其他老师一起上课，0-不允许，1-允许，默认为1
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
            let self = this
//            if(this.$route.query.from=='seltime'){
//                if(this.$route.query.learnlist.length!=0){
//                    self.learns=this.$route.query.learnlist;
//                    self.showSelectLearnBtn=false;
//                    this.$route.query.learnlist.forEach(function(value){
//                        self.learnids.push(value.learnid)
//                    })
//                }
//                if(this.$route.query.courseid){
//                    self.showSelectCourseBtn=false;
//
//                    /*self.selectedCourse={
//                     coursename:this.$route.query.coursename,
//                     courseid:this.$route.query.courseid
//                     }*/
//                    self.courses=[{
//                        coursename:this.$route.query.coursename,
//                        courseid:this.$route.query.courseid
//                    }]
//                    self.courseid=this.$route.query.courseid;
//                }
//            }
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

                            if(this.grades[j] && this.grades[j].classlist && this.grades[j].classlist.length) {

                                let classlist = this.grades[j].classlist;
                                for(let k = 0; k < classlist.length; k++) {
                                    if(val[i] === classlist[k].id) {
                                        ret.push(classlist[k]);
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
                    promises.push(this.post('/cls/listsclassStd', {
                        command: "cls/listsclassStd",
                        sessionid: $.cookie('sid'),
                        loginid: $.cookie('uid'),
                        id: this.selectClasses[i].id,
                        pagenum:1,
                        perpagenum:1000
                    }));
                }

                $.when.apply($, promises)
                    .then(function (...rets) {

                    let count = 0;

                    if(rets && rets.length) {
                        for(let i = 0; i < rets.length; i++) {
                            count += (rets[i] && rets[i].stdlist.length) || 0;
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
                                label.push(arr[i].classname);
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
        this.apply = this.$route.query.apply;//修改
        var choosedtimearr=this.$route.query.selecttimes
        var timearr=[]
        choosedtimearr.forEach(function(value){
            timearr.push(value.starttime)
            timearr.push(value.endtime)
            self.timelist.push({
                starttime:value.day.slice(0,11)+''+value.starttime,
                endtime:value.day.slice(0,11)+''+value.endtime
            })
        })
        var sortedtimearr=timearr.sort()
        self.timeInfo=this.$route.query.selecttimes[0].day.slice(0,11)+''+sortedtimearr[0].slice(0,5)+'~'+sortedtimearr[sortedtimearr.length-1].slice(0,5)
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
        })
    },
    back(){
        if(this.apply) {
            this.$router.push({
                name: 'fdMy'
            });
        } else {
            this.$router.push({
                name: 'fdCreateSelLabTable',
                query: this.labInfo
            });
        }
    },
    showSelectClass() {//用户点击蓝色选择班级按钮
        var self=this
        if(self.selectCourseid){//选班级前，必须要求用户选课程
            self.classModal.show = true
            self.post('/cls/listsclassbygrade', {
                command: "cls/listsclassbygrade",
                sessionid: $.cookie('sid'),
                loginid: $.cookie('uid'),
                pagenum:1,
                perpagenum:1000,
                courseid:self.selectCourseid
            }).done(function (data) {
                self.grades = data.sclassList
            })
        }else{
            self.toast('请先选择课程')
        }
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
        console.log(this.classids)
    },
    selectCourse(){
        this.courseModal.show=false;
        this.courseid = this.selectCourseid;
    },
    selectTrain(){
        this.trainModal.show=false;
        this.learnids = [].concat(this.selectLearnids);
    },
    istogetherfn(){//点确认预约，校验人数是否超过教室容量，如果容量还有空余，提示用户是否允许其他老师一起上课
        var self=this
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
        if(self.stunumCount==0 && self.stunum==0){
            return this.showAlert({
                msg: '请选择班级或输入学生人数！'
            });
        }
        var totalstunum1=parseInt(self.stunumCount)
        var totalstunum2=parseInt(self.stunum)
        console.log(totalstunum1)
        console.log(totalstunum2)
        console.log()
        if(self.labInfo.volume<totalstunum1 || self.labInfo.volume<totalstunum2){
            self.toast('抱歉，您加入的人数已超过教室容量')
            return
        }else if(self.labInfo.volume==totalstunum1 || self.labInfo.volume==totalstunum2){//如果选择的人数等于教室容量，直接提交预约
            self.confirmtogether=0//0表示不允许其它老师加入
            self.bookingSubmit()
        }else{//如果还有空位，让用户选择是否允许其它老师加入
            self.istogether.show=true
        }
    },
    bookingSubmit(){
        let self = this;
        let learnKeys = [];
        let classKeys = [];
        let url = '/learn/firstclassbooking';
        let command = 'learn/firstclassbooking';
        let param;

        for(let i = 0; i < this.learnids.length; i++) {
            learnKeys.push({learnid: this.learnids[i]});
        }
        for(let i = 0; i < this.classids.length; i++) {
            classKeys.push({classid: this.classids[i]});
        }

        if( !classKeys || !classKeys.length){
            classKeys = [];
        }
        var sortedtimearr=self.timelist.sort(function(a,b){
            return Date.parse(new Date(a.starttime))-Date.parse(new Date(b.starttime))
        })
        param = {
            command: command,
            sessionid: $.cookie('sid'),
            loginid: $.cookie('uid'),
            timelist:sortedtimearr,
            placeid:self.labInfo.placeid,//教室id
            courseid: self.courseid,    //课程id
            comment:self.comment,    //备注
            learnlist: learnKeys,   //训练项数组 [{learnid:},{learnid:}]
            classlist: classKeys,   //班级数组 [{classid:},{classid:}]
            teacherid: $.cookie('uid'), //老师id
            together:self.confirmtogether
        }

        if(!self.classlist || !classlist.length) {
            param.stunum = self.stunumCount  //人数
        }
        console.log(JSON.stringify(param))
        this.post(url, param).done(function (data) {
            if(data && data.errcode == 0) {
                self.istogether.show=false//关闭是否允许其他老师加入的提示框
                self.toast('预约提交成功，请耐心等待管理员审核！');
                self.$router.push({
                    name: 'fdMy'
                })
            } else {
                self.toast((data && data.errdesc) || '预约失败，请稍后再试。')
            }
        }).fail(function () {
            self.toast('预约失败，请稍后再试。')
        })
    }
    }
    }
</script>
<style lang="scss">
    @import "../../../scss/variables.scss";
</style>
