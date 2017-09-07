<template>
    <div class="g-wrapper booking-submit">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            修改预约信息
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
                    <div class="auto-width">{{ coursename }}</div>
                </div>
                <div class="item valign-center">
                    <label>训练项名称：</label>
                    <div class="auto-width"><span v-for="value in learnlist">{{ value.learnname }} </span></div>
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
            <a class="btn btn-blue btn-lg btn-block" @click="bookingSubmit()"> 确认修改 </a>
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
                classlist:[],//从待审核页面传来的班级
                learnlist:[],//从待审核页面传来的训练项
                coursename:'',//从待审核页面传来的课程名
                courseid:'',//从待审核页面传来的课程id
                labInfo: {//从待审核页面传来的实验室信息
                    displayname:'',
                    pname:'',
                    uname:'',
                    mobile:'',
                    placeid:'',
                    volume:''
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
            }
        },
        components: {
            cHeader,
            cModal
        },
        created() {},
        mounted () {
            console.log(JSON.stringify(this.$route.query))
            let self = this
            this.init()
            this.registerToNative('goBack', function (data) {
                if(self.classModal.show){
                    self.classModal.show=false
                }else{
                    self.back()
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
                    self.stunum = count
                })
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
        self.apply=this.$route.query.apply
        console.log(JSON.stringify(self.apply))
        self.timeInfo=self.apply.starttime.slice(0,16)+'~'+self.apply.endtime.slice(11,16)
        self.learnlist=self.apply.learnlist
        self.coursename=self.apply.coursename
        self.courseid=self.apply.courseid
        self.selectClasses = self.apply.classlist
        self.labInfo.displayname=self.apply.displayname
        self.labInfo.pname=self.apply.pname
        self.labInfo.uname=self.apply.uname
        self.labInfo.mobile=self.apply.mobile
        self.labInfo.placeid=self.apply.placeid
        self.labInfo.volume=self.apply.volume
        self.scheduleid=self.apply.scheduleid
        self.comment=self.apply.comment
        if(self.apply.classlist.length==0){//如果用户没有选班级，就直接展示用户输入的人数
            self.stunumCount=self.apply.stunum
        }
        if(self.selectClasses) {
            for(let i = 0; i < self.selectClasses.length; i++) {
                classids.push(self.selectClasses[i].classid);
            }
        }
        self.selectClassids = [].concat(self.classids);
        this.post('/cls/listsclassbygrade', {
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
        this.$router.push({
            name: 'fdMy'
        });
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
            command: 'learn/updateclassbooking',
            sessionid: $.cookie('sid'),
            loginid: $.cookie('uid'),
            teacherid:$.cookie('uid'),
            scheduleid: self.scheduleid,
            comment:self.comment,    //备注
            classlist: classKeys,   //班级数组 [{classid:},{classid:}]
            //placeid:self.labInfo.placeid
        };
        if(!self.classlist || !self.classlist.length) {
            param.stunum = self.stunumCount  //人数
        }
        var totalstunum1=parseInt(self.stunumCount)//校验人数是否超过教室容量
        var totalstunum2=parseInt(self.stunum)
        if(self.labInfo.volume<totalstunum1 || self.labInfo.volume<totalstunum2){
            self.toast('抱歉，您加入的人数已超过教室容量')
            return
        }
        console.log(JSON.stringify(param))
        this.post('/learn/updateclassbooking', param).done(function (data) {
            if(data && data.errcode == 0) {
                self.toast('成功修改预约');
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
        })
    }
    }
    }
</script>
<style lang="scss">
    @import "../../../scss/variables.scss";
</style>
