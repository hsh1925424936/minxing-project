<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            日常考核查看
            <div slot='headerRight' style="font-size: 0.3rem" @click='evaluateStudent'>
                评分
            </div>
        </c-header>
        <div class="g-main">
            <div>
                <div class="list" v-for='item in evaluatedlist' @click='detail(item.month,item.id)'>
                    <span>{{item.month}}</span>
                    <p class="score">
                        <span>{{item.score}}</span>
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
            self.evaluateMonth()
            self.registerToNative('goBack', function (data) {
                self.back();
            });
        },
        methods: {
            ...methods,
            // 查看日常考核详情
            detail: function (date, id) {
                this.$router.push({
                    name: "fdRotation_teacher_detail",
                    query: {
                        date: date,
                        id: id
                    }
                })
            },
            // 带教老师登录，点击评分按钮
            evaluateStudent: function () {
                let self = this
                this.$router.push({
                    name: "fdRotation_teacher_evaluate",
                    query: {
                        id: self.$route.query.id,
                        date: self.$route.query.date
                    }
                })
            },
            // 初始化页面发送请求
            evaluateMonth: function () {
                let self = this
                self.data = {
                    command: 'turn/queryevaluatedmonths',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    uid: $.cookie('uid'),
                    evaluatedid: self.$route.query.id,
                    type: 4,
                }
                self.post('/turn/queryevaluatedmonths', self.data)
                    .done(function (data) {
                        console.log(data)
                        self.evaluatedlist = data.evaluatedlist
                        if (self.evaluatedlist.length == 0) {
                            self.noContent = true
                        }
                    }).fail(function (error) {
                        self.noContent = true
                    })
            },
            back() {
                let self = this
                self.$router.push({
                        name: "fdRotation_teacher",
                        // query: {
                        //     id:self.$route.query.id,
                        //     date:self.$route.query.date
                        // }
                    })
            }
        }
    }

</script>
<style scoped>
    .g-main{
        font-size: 0.24rem;
        color: rgb(100,100,100);
    }
    .list {
        margin: 0;
        padding: 0.2rem 0.3rem;
        /*height: 0.88rem;*/
        /*line-height: 0.88rem;*/
        /*font-size: 0.3rem;*/
        /*color: #333333;*/
        display: flex;
        align-items: center;
        justify-content: space-between;
        /*border-bottom: solid 1px #c3c3c3;*/
    }
/*
    .list:nth-last-of-type(1) {
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
