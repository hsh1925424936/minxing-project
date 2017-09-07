<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            成绩统计
        </c-header>

        <div class="g-main">
            <div class="info_box">
                <span>课程名称：</span>{{coursename}}<br/>
                <span>技能项：</span>{{learnname}}
            </div>
                
            <div class="tr clearfix tr1">
                <div class="td">
                    平均分:<span style="color:black;">{{parseFloat(avgscore).toFixed(1)}}</span>
                </div>
                <div class="td">
                    最高分:<span style="color:#4BA4DF;">{{parseFloat(maxscore).toFixed(1)}}</span>
                </div>
                <div class="td">
                    最低分:<span style="color:#FFB33E">{{parseFloat(minscore).toFixed(1)}}</span>
                </div>
            </div>
            <div class="tr clearfix tr2 th">
                <div class="td">
                    序号
                </div>
                <div class="td">
                    姓名
                </div>
                <div class="td">
                    得分<img src="../../assets/images/btn_px.png" @click="sort_stu()">
                </div>
            </div>
            <div class="table">
                <!-- <div class="tr clearfix tr2">
                    <div class="td">
                        01
                    </div>
                    <div class="td">
                        侯文浩
                    </div>
                    <div class="td">
                        20<img src="../../assets/images/turnRight.jpg">
                    </div>
                </div> -->
                <div class="tr clearfix tr2" v-for="(value,index) in studentlist">
                    <div class="td">
                        {{index+1}}
                    </div>
                    <div class="td">
                        {{value.stuname}}
                    </div>
                    <div class="td">
                        {{value.score}}
                        <img src="../../assets/images/turnRight.jpg" @click="show_detail(value.stuid,value.stuname,value.score,value.examid)">
                        
                    </div>
                </div>
            </div>
        </div>

        <c-modal :config="errordetail" id="errordetail">
            <div class="errordetail_outer" style="border-bottom:1px solid;">
                <div class="info_box2">
                    <span>学生姓名：</span>{{selected.stuname}}<br/>
                    <span>技能项：</span>{{learnname}}<br/>
                    <span>考试得分：</span>{{selected.score}}分<br/>
                </div>
            </div>
            <div class="errordetail_outer">
                <div class="table_tit">错误项</div>
                <table>
                    <tr style="background:#DBDBDB;">
                        <td style="text-align:center;">操作类别</td>
                        <td style="text-align:center;">错误项</td>
                    </tr>
                    <tr v-for="(value,index) in selected.errorlist">
                        <td class="wrongitem">{{value.type}}</td>
                        <td class="wrongitem">{{value.descp}}</td>
                    </tr>
                </table>
            </div>
        </c-modal>

    </div>
</template>

<script>

    import $ from 'jquery';
    import methods from '../../methods';
    import cHeader from '../header.vue';
    import cModal from '../../components/modal';
    import { mapState, mapActions } from 'vuex';
    export default {
        data() {
            return {
                learnname:'',
                coursename:'',

                errordetail: {
                    show: false,
                    title: '错误详情',
                    hideOnClickOut: true,
                    theme: 'hello-world'
                },
                avgscore:'',
                maxscore:'',
                minscore:'',
                studentlist:[],
                sorttype:2,
                selected:{//记录当前选中的学生信息
                    stuname:'',
                    score:'',
                    errorlist:[]
                }

            }
        },
        components: {
            cHeader,
            cModal
        },
        created() {},
        mounted () {
            let _this=this;
            this.registerToNative('goBack', function (data) {
                _this.back();
            });
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
                this.query_stuscoredetail('desc');
            },
            query_stuscoredetail(orderby){
                let self = this;
                this.post('/score/querytechlearnscore', {
                    command: "score/querytechlearnscore",
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    learnid:self.$route.query.learnid,
                    scheduleid:self.$route.query.scheduleid,
                    orderby:orderby,
                    courseid:self.$route.query.courseid,
                    teacherid:$.cookie('uid')
                }).done(function (data) {
                    self.avgscore = data.avgscore;
                    self.maxscore = data.maxscore;
                    self.minscore = data.minscore;
                    self.learnname = data.learnname;
                    self.coursename = data.coursename;
                    self.studentlist = data.studentlist;
                });
            },
            back(){
                this.$router.push({
                    name: 'fdsk_grade',
                    query:{
                        type:2
                    }
                })
                
            },
            show_detail( stuid,stuname,score,examid ){//显示单个学生错误详情
                let self = this;
                self.errordetail.show = true;
                self.selected.stuname = stuname;
                self.selected.score = score;
                this.post('/score/liststuerror', {
                    command: "score/liststuerror",
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    examid:examid,
                    stuid:stuid,
                    teacherid:$.cookie('uid')
                }).done(function (data) {
                    self.selected.errorlist = data.errorlist;
                });
            },
            sort_stu(){//切换排序方法
                if( this.sorttype == 2 ){
                    this.sorttype = 1;
                    this.query_stuscoredetail('asc');
                }else{
                    this.sorttype = 2;
                    this.query_stuscoredetail('desc');
                }
                
            }

        },
        computed:{
            

        }
    }

</script>
<style type="text/css" scoped>

    .info_box{
        width:100%; padding:0.25rem;
        background-color:#3499db;
        color:white; line-height:0.5rem;
        padding-top:0.4rem;
    }

    .tr{
        width:100%; height:0.75rem; background-color:white;
    }
    .td{
        float:left; text-align:center; line-height:0.75rem;
        color:#868686;
    }

    .tr1{
        margin-top:calc( 10rem / 60 ); margin-bottom:calc( 10rem / 60 );
    }
    .tr1 .td{
        width:calc( 100% / 3 );
    }

    .th{
        background-color:#DBDBDB;
    }
    .tr2 .td:nth-child(1){
        width:23%;
    }
    .tr2 .td:nth-child(2){
        width:48%;
    }
    .tr2 .td:nth-child(3){
        width:29%;
    }
    .tr2{
        position:relative;
    }

    .table{
        width:100%; max-height:6rem; overflow:auto;
    }

    .th .td img{
        width:calc(16rem / 60); height:calc(16rem / 60); margin-left:calc(5rem / 60);
        display:inline-block; margin-top:calc(-8rem / 60); top:50%; position:absolute;
    }
    .table .td img{
        width:calc(16rem / 60); height:calc(16rem / 60); margin-left:calc(20rem / 60);
        display:inline-block; margin-top:calc(-8rem / 60); top:50%; position:absolute;
    }

    /*弹出框*/
    .errordetail_outer{
        padding-left:0.25rem; padding-right:0.25rem;
    }
    .info_box2{
        width:100%; padding-top:0.25rem; padding-bottom:0.25rem; line-height:0.5rem;
    }
    .info_box span,.info_box2 span{
        width:26%;
    }
    .table_tit{
        font-size:0.25rem; padding-top:0.25rem; padding-bottom:0.25rem;
    }

    table{
        width:100%; border-right:1px solid #797979; border-bottom:1px solid #797979;
        margin-bottom:0.2rem;
    }
    th:nth-child(1),td:nth-child(1){
        width:31%;
    }
    th:nth-child(2),td:nth-child(2){
        width:69%;
    }
    td{
        border-left:1px solid #797979; border-top:1px solid #797979;
        padding:0.1rem;
    }
    .wrongitem{
        text-align:center;
    }
</style>
