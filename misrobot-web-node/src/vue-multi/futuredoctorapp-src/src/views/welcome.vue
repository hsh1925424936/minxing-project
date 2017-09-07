<template>
    <div class="g-wrapper booking-submit">

        <div class="g-main">


            <div class="list info-list">

                <div class="item btn-item valign-center">
                    <label>选择分数：</label>
                    <div class="auto-width">固定数据:</div>
                    <a class="btn btn-blue" @click="showScore()">选择</a>
                </div>

                <div class="item btn-item valign-center">
                    <label>课程名称：</label>
                    <div class="auto-width">固定数据:</div>
                    <a class="btn btn-blue" @click="showSelectCourse()">选择</a>
                </div>
                <div class="item valign-center">
                    <label>训练项名称：</label>
                    <div class="auto-width">加载数据</div>
                    <a class="btn btn-blue" @click="showSelectTrain()">选择</a>
                </div>
            </div>
        </div>


        <c-modal :config="score" id="scores">
            <div class="flex-item class-sel-list" id="aaa">
                <div class="list info-list list-inner">
                    <div class="item">
                        <label class="flex flex-start flex-row">
                            <div class="fitem">测试测试测试</div>
                            <input type="radio" class="checkbox" />
                        </label>
                        <label class="flex flex-start flex-row">
                            <div class="fitem">测试测试测试111</div>
                            <input type="radio" class="checkbox" />
                        </label>
                        <label class="flex flex-start flex-row">
                            <div class="fitem">测试测试测试222</div>
                            <input type="radio" class="checkbox" />
                        </label>
                    </div>
                </div>
            </div>
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
    import methods from '../methods';
    import cHeader from './header.vue';
    import cModal from '../components/modal';
    import { mapState, mapActions } from 'vuex';

    export default {
        data() {
            return {
                show: false,
                title: '我是一个Title',
                apply: null,
                labInfo: {},
                timeInfo: {},
                score: {
                    show: false,
                    title: '选择分数',
                    hideOnClickOut: true,
                    theme: 'hello-world'
                },
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
                courses: [{
                    coursename: '11111'
                }, {
                    coursename: '222222'
                }, {
                    coursename: '222222'
                }, {
                    coursename: '222222'
                }, {
                    coursename: '222222'
                }, {
                    coursename: '222222'
                }],
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
                comment:''
            }
        },
        components: {
            cHeader,
            cModal
        },
        created() {},
        mounted () {
            this.init();
        },
        watch: {
            '$router': function (val, oldVal) {
                this.init();
            }
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

                // 训练项
                this.post('/learn/querylearninfo', {
                    command: "learn/querylearninfo",
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid')
                }).done(function (data) {
                    self.learns = data.learnids;
                    alert(JSON.stringify(self.learns));
                });
            },
            back(){

            },
            showSelectClass() {
                this.classModal.show = true;
            },
            showScore() {
                this.score.show = true;

                this.$nextTick(function () {
                    alert($('#aaa').html());
                    this.showAlert("深刻理解方式登录可见发了多少快捷方式老师肯定放假圣诞快乐副经理开始的减肥")
                });
            },
            showSelectCourse(){
                this.courseModal.show = true;
            },
            showSelectTrain() {
                this.trainModal.show = true;
            },
            selectClass(){
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
            }
        }
    }

</script>
<style lang="scss" scoped>
    #scores .modal-body {
        height:500px;
    }
</style>
