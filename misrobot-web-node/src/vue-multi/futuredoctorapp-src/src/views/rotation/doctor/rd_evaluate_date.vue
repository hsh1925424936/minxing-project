<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            <span v-if='showExam' style="font-size: 0.36rem;">日常考核查看</span>
            <span v-if='showEvaluate' style="font-size: 0.36rem;">评价带教老师</span>
            <!--住院生为带教老师评分-->
            <div slot='headerRight' v-if='showEvaluate' style="font-size: 0.3rem" @click='evaluateTeacher'>
                评分
            </div>
        </c-header>
        <div class="g-main">
            <!--日常考核查看-->
            <div v-if='showExam' class="main">
                <div class="list" v-for='item in evaluatedlist' @click='detail(item)'>
                    <span>{{item.month}}</span>
                    <img src="../../../assets/images/bnt_xiangyou.png" alt="">
                </div>
                <no-content v-if='noContent'></no-content>
            </div>
            <!--评价带教老师-->
            <div v-if='showEvaluate' class="main">
                <div class="list" v-for='item in evaluatedlist' @click='evaluateDetail(item)'>
                    <span>{{item.month}}</span>
                    <p class="score">
                        <span>{{item.totalscore}}分</span>
                        <img src="../../../assets/images/bnt_xiangyou.png" alt="">
                    </p>
                </div>
                <no-content v-if='noContent'></no-content>
            </div>
        </div>

    </div>
</template>
<script>
    import cHeader from '../../header'
    import methods from '../../../methods'
    import noContent from '../../no_content';
    export default {
        name: 'rotation_doctor_date',
        components: {
            cHeader,
            noContent
        },
        filters: {
            score: function (value) {
                return value + '分'
            }
        },
        data() {
            return {
                showExam: false,
                showEvaluate: false,
                showTeacher: false,
                evaluatedlist: [
                    // {'month':'2017年11月','score':28},
                    // {'month':'2017年10月','score':28},
                    // {'month':'2017年9月','score':28},
                    // {'month':'2017年8月','score':28},
                    // {'month':'2017年7月','score':28},
                ],
                noContent: false,
                data: {}
            }
        },
        mounted() {
            let self = this
            // booking=0是住院医日常考核查看
            // booking=1是住院医评价带教老师
            if (self.$route.query.booking == 0) {
                self.showExam = true
                self.evaluateMonth(4,self.$route.query.teachingid,$.cookie('uid'))
            } else if (self.$route.query.booking == 1) {
                self.showEvaluate = true
                self.evaluateMonth(1,$.cookie('uid'),self.$route.query.teachingid)
            }
            self.registerToNative('goBack', function (data) {
                self.back();
            });
        },
        methods: {
            ...methods,
            back(){
                let self = this
                 if(self.$route.query.booking == 0){
                    this.$router.push({
                        name: 'fdRotation_doctor_exam',
                        query:{
                            teachingid:self.$route.query.teachingid,
                            type:self.$route.query.type,
                            deptname:self.$route.query.deptname,
                            detail:self.$route.query.detail,
                            deptid:self.$route.query.deptid
                        }
                    })
                 }else if(self.$route.query.booking == 1){
                    this.$router.push({
                        name: 'fdRotation_doctor_evaluate',
                        query:{
                            teachingid:self.$route.query.teachingid,
                            type:self.$route.query.type,
                            deptname:self.$route.query.deptname,
                            detail:self.$route.query.detail,
                            deptid:self.$route.query.deptid
                        }
                    })
                }
                 
            },
            // 查看日常考核详情
            detail: function (item) {
                let self = this
                this.$router.push({
                    name: "fdRotation_teacher_detail",
                    query: {
                        // booking: date
                        date:item.month,
                        id:item.id,
                        type:self.$route.query.type,
                        deptname:self.$route.query.deptname,
                        teachingid:self.$route.query.teachingid,
                        detail:self.$route.query.detail
                    }
                })
            },
            // 评价代教老师
            evaluateDetail: function (item) {
                let self = this
                this.$router.push({
                    name: "fdRotation_doctor_evaluate_score",
                    query:{
                        booking:0,
                        id:item.id,
                        date:item.month,
                        type:self.$route.query.type,
                        deptname:self.$route.query.deptname,
                        teachingid:self.$route.query.teachingid,
                        detail:self.$route.query.detail
                    }
                })
            },
            // 住院医登录，评价带教老师时，点击导航栏的评分按钮
            evaluateTeacher: function () {
                let self = this
                this.$router.push({
                    name: "fdRotation_doctor_evaluate_score",
                    query:{
                        booking:1,
                        teachingid:self.$route.query.teachingid,
                        type:self.$route.query.type,
                        deptname:self.$route.query.deptname,
                        teachingid:self.$route.query.teachingid,
                        detail:self.$route.query.detail,
                        deptid:self.$route.query.deptid
                    }
                })
            },
            // 初始化页面发送请求
            evaluateMonth: function (type,uid,evaluatedid) {
                let self = this
                self.data = {
                    command: 'turn/queryevaluatedmonths',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    uid:uid,
                    evaluatedid:evaluatedid,
                    type: type,
                }
                self.post('/turn/queryevaluatedmonths', self.data)
                    .done(function (data) {
                        // console.log(data)
                        self.evaluatedlist = data.evaluatedlist
                        if (self.evaluatedlist.length == 0) {
                            self.noContent = true
                        }
                    }).fail(function (error) {
                        self.noContent = true
                    })
            }
        }
    }

</script>
<style scoped>
    .g-main{
        font-size:0.26rem;
        background: #f8f7f9!important;
        color: rgb(100,100,100);
    }
    /*.main{
        margin-top:0.2rem;
    }*/
    .list {
        margin-top: 0.1rem;
        padding: 0.2rem 0.3rem;
        height: 0.8rem;
        line-height: 0.8rem;
        /*font-size: 0.3rem;*/
        /*color: #333333;*/
        display: flex;
        align-items: center;
        justify-content: space-between;
        /*border-bottom: solid 1px rgb(230,230,230);*/

    }

   /* .list:nth-last-of-type(1) {
        border: none;
    }*/

    .list img {
        width: 0.2rem;
        height: 0.2rem;
    }

    .score {
        margin: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

</style>
