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
                    <label>教室容量：</label><div class="auto-width"><span class="fcontentblue">{{ prevcoursestunum }}</span>/{{labInfo.volume}}</div>
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
                    <div class="auto-width">{{ coursename }}</div>
                </div>
                <div class="item valign-center">
                    <label>训练项名称：</label>
                    <div class="auto-width"><span v-for="value in learnlist">{{ value.learnname }}</span></div>
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
                classlist:[],
                learnlist:[],
                coursename:'',//上一个老师预约的课程详情页传来的课程信息
                courseid:'',//上一个老师预约的课程详情页传来的课程信息
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
                grades: [],
                gradeIndex: 0,

                scheduleid: null,
                stunum: 0,
                classids: [],
                selectClasses: [],
                selectClassids: [],
                comment:'',
                showSelectCourseBtn:true,
                showSelectLearnBtn:true,
                showStuNum:true,
                stunumCount: 0,  //用户输入的自定义学生数量
                prevcoursestunum:'',//前一个老师预约的学生人数
            }
        },
        components: {
            cHeader,
            cModal
        },
        created() {},
        mounted () {
            let self = this
            this.init();
            this.registerToNative('goBack', function (data) {
                if(self.classModal.show){
                    self.classModal.show=false
                }else{
                    self.back();
                }
            });
        },
        watch: {
            '$router': function (val, oldVal) {
                this.init();
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
        let classids = [];
        self.timeInfo=this.$route.query.starttime.slice(0,16)+'~'+this.$route.query.endtime.slice(11,16)
        self.learnlist=this.$route.query.learnlist
        self.coursename=this.$route.query.coursename
        self.prevcoursestunum=this.$route.query.stunum
        self.courseid=this.$route.query.courseid
        this.post('/cls/listsclassbygrade', {//查询班级列表
            command: "cls/listsclassbygrade",
            sessionid: $.cookie('sid'),
            loginid: $.cookie('uid'),
            pagenum:1,
            perpagenum:1000,
            courseid:self.courseid
        }).done(function (data) {
            self.grades = data.sclassList;

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
                name: 'fdCreateJoinCourse',
                query: ''
            });
        }
    },
    showSelectClass() {
        this.classModal.show = true;
    },
    selectClass(){
        // this.showStuNum = false
        this.classModal.show=false;
        this.classids = [].concat(this.selectClassids);
    },
    bookingSubmit(){
        let self = this;
        let classKeys = [];
        let url = '/learn/togetherclassbooking';
        let command = 'learn/togetherclassbooking';
        let param;
        if(self.stunumCount==0 && self.stunum==0){
            return self.showAlert({
                msg: '请选择班级或输入学生人数！'
            });
        }
        for(let i = 0; i < this.classids.length; i++) {
            classKeys.push({classid: this.classids[i]});
        }

        if( !classKeys || !classKeys.length){
            classKeys = [];
        }
        param = {
            command: command,
            sessionid: $.cookie('sid'),
            loginid: $.cookie('uid'),
            orderid: $.cookie('sellabOrderid'),
            comment:self.comment,    //备注
            classlist: classKeys,   //班级数组 [{classid:},{classid:}]
        };
        if(!self.classlist || !self.classlist.length) {
            param.stunum = self.stunumCount  //人数
        }
        var totalstunum1=parseInt(self.stunumCount)+parseInt(self.prevcoursestunum)//校验人数是否超过教室容量
        var totalstunum2=parseInt(self.stunum)+parseInt(self.prevcoursestunum)
        console.log(totalstunum1)
        console.log(totalstunum2)
        console.log(self.prevcoursestunum)
        if(self.labInfo.volume<totalstunum1 || self.labInfo.volume<totalstunum2){
            self.toast('抱歉，您加入的人数已超过教室容量')
            return
        }
        console.log(JSON.stringify(param))
        this.post(url, param).done(function (data) {
            if(data && data.errcode == 0) {
                self.toast('预约提交成功，请耐心等待管理员审核！');
                setTimeout(function(){
                    self.$router.push({
                        name: 'fdMy'
                    });
                },1500)
            } else {
                self.toast((data && data.errdesc) || '预约失败，请稍后再试。')
            }
        }).fail(function () {
            self.toast('预约失败，请稍后再试。')
        }).always(function () {

        });
    }
    }
    }
</script>
<style lang="scss">
    @import "../../../scss/variables.scss";
</style>
