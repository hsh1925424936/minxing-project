<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            {{deptname}}
        </c-header>
        <div class="g-main">
            <div v-if='show' @click='evaluate'>
                <p class="left">
                    <img src="../../../assets/images/icon_richangpingjia.png" alt="">
                    <span>日常评价</span>
                </p>
                <img class="right" src="../../../assets/images/bnt_xiangyou.png" alt="">
            </div>
            <div @click='check'>
                <p class="left">
                    <img src="../../../assets/images/icon_richangkaoke.png" alt="">
                    <span>日常考核查看</span>
                </p>
                <img class="right" src="../../../assets/images/bnt_xiangyou.png" alt="">
            </div>
        </div>
    </div>
</template>
<script>
    import cHeader from '../../header'
    import methods from '../../../methods'
    export default {
        name: 'rotation_doctor_exam',
        components: {
            cHeader
        },
        data() {
            return {
                show: false,
                deptname: ''
            }
        },
        mounted() {
            let self = this
            // 1.点击首页的进入按钮进入
            // 2.点击轮转计划的轮转中进入
            // 显示日常评价这一项
            if (self.$route.query.type == 1) {
                self.show = true
            }
            self.deptname = self.$route.query.deptname
            self.registerToNative('goBack', function (data) {
                self.back();
            });
        },
        methods: {
            ...methods,
            // 日常考核查看
            check: function () {
                let self = this
                this.$router.push({
                    name: "fdRotation_doctor_exam_date",
                    query: {
                        booking:0,
                        type: self.$route.query.type,
                        teachingid:self.$route.query.teachingid,
                        deptname:self.$route.query.deptname,
                        detail:self.$route.query.detail
                    }
                })
            },
            // 评价带教老师
            evaluate: function () {
                let self = this
                this.$router.push({
                    name: 'fdRotation_doctor_evaluate',
                    query:{
                        teachingid:self.$route.query.teachingid,
                        type:1,
                        deptname:self.$route.query.deptname,
                        detail:self.$route.query.detail,
                        deptid:self.$route.query.deptid
                    }
                })
            },
            back(){
                let self = this
                if(self.$route.query.detail == 0){
                      this.$router.push({
                        name: 'fdRotation_doctor_plan',
                        query:{
                            type:0,
                            teachingid:self.$route.query.teachingid,
                            deptid:self.$route.query.deptid
                        }
                    })
                }else{
                     this.$router.push({
                        name: 'fdRotation_doctor'
                    })
                }
               
            }
        }
    }

</script>
<style scoped>
    .g-main {
        font-size:0.24rem;
        background: #f8f7f9!important;
        color: rgb(100,100,100);
    }

    .g-main div {
        width: 100%;
        background: white;
        /*border-bottom: solid 1px rgb(230,230,230);*/
        /*height: 1rem;*/
        /*line-height: 1rem;*/
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.1rem 0.3rem;
        margin-top: 0.1rem;
    }

    .left {
        margin: 0;
        /*color: #333333;*/
        /*font-size: .3rem;*/
        display: flex;
        align-items: center;
    }

    .left img {
        width: 0.66rem;
        height: 0.66rem;
        margin-right: 0.2rem;
    }

    .right {
        width: 0.2rem;
        height: 0.2rem;
    }

    .g-main div:nth-of-type(2) {
        border: none;
    }

</style>
