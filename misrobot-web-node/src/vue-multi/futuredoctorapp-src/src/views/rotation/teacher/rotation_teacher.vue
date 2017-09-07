<template>
    <div class="g-wrapper">
        <c-header>
             <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            住培轮转
        </c-header>
        <div class="g-main" v-if='!noContent'>
            <div v-for='item in turndoctors' class="list">
                <ul @click='plan(item.id)'>
                    <li class="head">
                        <div class="headDiv">
                            <img src="../../../assets/images/icon_morentoux-.png" alt="">
                            <div>
                                <p class="headerName">
                                    <span>{{item.name}}</span>
                                    <span>年级：{{item.period}}</span>
                                </p>
                                <p>
                                    <span>{{item.mobile}}</span>
                                </p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <span>专业基地：{{item.base}}</span>
                    </li>
                    <li>
                        <span>科&emsp;&emsp;室：{{item.dept}}</span>
                    </li>
                    <li>
                        <span>带教老师：{{item.teaching}}</span>
                    </li>
                    <li>
                        <span>培 训 期 ：{{item.begintime | checkdate}}-{{item.endtime | checkdate}}</span>
                    </li>
                    <li>
                        <span>轮转进度：{{item.progress | progress}}</span>
                    </li>
                </ul>
                <div class="footerBtn">
                    <a @click='dailyExam(item.id,item.realbegintime)'>日常考核</a>
                </div>
            </div>
        </div>
        <no-content v-if='noContent'></no-content>
    </div>
</template>
<script>
    import cHeader from '../../header'
    import methods from '../../../methods'
    import noContent from '../../no_content'
    export default {
        name: 'rotation_teacher',
        components: {
            cHeader,
            noContent
        },
        filters: {
            progress: function (value) {
                if(value){
                    return (value * 100).toFixed(0) + '%'
                }
            },
            checkdate(date) {
                if(date){
                    return date.split('-').join('.')
                }
            }
        },
        data() {
            return {
                turndoctors: [
                    // {
                    //     'name': '章一星',
                    //     'mobile': '15236984366',
                    //     'period': '2016级',
                    //     'begindate': '2016-8-1',
                    //     'enddate': '2017-9-1',
                    //     'base': '神经内科',
                    //     'prof': '神经内科',
                    //     'teaching': '孙小龙',
                    //     'progress': 0.5,
                    // },
                    // {
                    //     'name': '孙小龙',
                    //     'mobile': '15236984366',
                    //     'period': '2016级',
                    //     'begindate': '2016-8-1',
                    //     'enddate': '2017-9-1',
                    //     'base': '神经内科',
                    //     'prof': '神经内科',
                    //     'teaching': '梁好累',
                    //     'progress': 0.5,
                    // },
                ],
                noContent:false 
            }
        },
        mounted() {
            let self = this
            self.init()
            self.registerToNative('goBack', function (data) {
                self.back();
            });
        },
        methods: {
            ...methods,
            // 代教老师学生列表数据展示
            init() {
                let self = this
                self.post('/turn/myturndoctors', {
                    command: 'turn/myturndoctors',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid')
                }).done(function (data) {
                    // console.log(data)
                    self.turndoctors = data.turndoctors
                    if (self.turndoctors.length == 0) {
                        self.noContent = true
                    }
                }).fail(function (error) {
                    // self.noContent = trues
                })
            },
            // 日常考核按钮
            dailyExam: function (id, date) {
                this.$router.push({
                    name: 'fdRotation_teacher_date',
                    query: {
                        id: id,
                        date: date
                    }
                })
            },
            // 点击每一个学生列表调到学生的计划详情页
            plan: function (id) {
                this.$router.push({
                    name: 'fdRotation_doctor_plan',
                    query: {
                        id: id,
                    }
                })
            },
            back(){
                location.href = '/pages/futuredoctorapp/application.html';
            }
        }
    }

</script>
<style scoped>
    .g-main{
        font-size:0.22rem;
        background: #f8f7f9!important;
        color: rgb(100,100,100);
    }
    .list {
        padding-top: 0;
    }

    ul {
        background: white;
        padding: 0 0.3rem 0;
    }

    ul p {
        margin: 0;
    }

    ul li {
        padding: 0.05rem 0;
    }

    ul li:nth-of-type(1) {
        border-bottom: solid 0.01rem rgb(240,240,240);
        padding: 0.1rem 0;
    }

    ul li:nth-of-type(2) {
        padding-top: 0.1rem;
    }

    ul li:nth-last-of-type(1) {
        padding-bottom: 0.1rem;
    }

    .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .headDiv {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .headDiv div {
        width: calc(100% - 1rem);
    }

    .headerName {
        width: 100%;
    }

    .headerName span:nth-of-type(1) {
        margin-bottom: 0.1rem;
    }

    .headerName span:nth-of-type(2) {
        float: right;
    }

    .headDiv img {
        width: 0.66rem;
        height: 0.66rem;
        margin-right: 0.2rem;
    }

    .footerBtn {
        border-top: solid 0.01rem rgb(240,240,240);
        text-align: right;
        padding: .1rem 0;
        margin: 0 0.3rem;
    }

    .footerBtn a {
        background: #3499db;
        color: white;
        padding: 0.1rem 0.05rem;
        border-radius: 0.1rem;
    }

</style>
