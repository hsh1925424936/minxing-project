<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            轮转计划
        </c-header>
        <div class="g-main">
            <div v-for='item in list' class="contentDiv">
                <p class="progress" :class='{green:item.turnstatus == 1,orange:item.turnstatus == 0}'>
                    <img v-if='item.turnstatus == 3' src="../../../assets/images/icon_hui.png" alt="">
                    <img v-if='item.turnstatus == 1' src="../../../assets/images/icon_lv.png" alt="">
                    <img v-if='item.turnstatus == 0' src="../../../assets/images/icon_ju.png" alt="">
                </p>
                <ul v-if='item.turnstatus == 1 || item.turnstatus == 3' @click='detail(item.turnstatus,item.deptname)' class="list">
                    <li class="listTitle">
                        <span>{{item.deptname}}</span>
                        <img v-if='item.turnstatus == 3' src="../../../assets/images/icon_yi.png" alt="">
                        <img v-if='item.turnstatus == 1' src="../../../assets/images/icon_zhong.png" alt="">
                    </li>
                    <li>
                        <span>科主任：</span>
                        <span>{{item.head}}</span>
                    </li>
                    <li>
                        <span>科秘书：</span>
                        <span>{{item.secretary}}</span>
                    </li>
                    <li>
                        <span>带教老师：</span>
                        <span>{{item.teaching}}</span>
                    </li>
                    <li>
                        <span>规定轮转时间：</span>
                        <span>{{item.settime}}</span>
                    </li>
                    <li>
                        <span>实际轮转天数：</span>
                        <span>{{item.actualdays}}</span>
                    </li>
                    <li>
                        <span>实际轮转时间：</span>
                        <span v-if='item.realbegintime'>{{item.realbegintime | date}}-{{item.realendtime | date}}</span>
                    </li>
                </ul>
                <ul v-else class="list">
                    <li class="listTitle">
                        <span>{{item.deptname}}</span>
                        <img v-if='item.turnstatus == 0' src="../../../assets/images/icon_dairuke-.png" alt="">
                    </li>
                    <li>
                        <span>规定轮转时间：</span>
                        <span>{{item.settime}}</span>
                    </li>
                    <li>
                        <span>计划轮转时间：</span>
                        <span v-if='item.planbegintime'>{{item.planbegintime | date}}-{{item.planendtime | date}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <no-content v-if='noContent'></no-content>
    </div>
</template>
<script>
    import methods from '../../../methods'
    import cHeader from '../../header'
    import noContent from '../../no_content'
    import moment from 'moment'
    export default {
        name: 'rotation_doctor_detail',
        components: {
            cHeader,
            noContent,
            moment
        },
        filters:{
            date:function(value){
                if(value){
                    return value.split('-').join('.')
                }
            }
        },
        data() {
            return {
                list: [
                    // {'deptname':'B超（腹部组）','head':'马艳','secretary':'star','teaching':'梁好累','settime':'9个月','actualdays':'273天','begintime':'2016.07.05','endtime':'2016.10.20','turnstatus':0},
                    // {'deptname':'B超（妇产组）','head':'马超','secretary':'star','teaching':'梁好累','settime':'9个月','actualdays':'273天','begintime':'2016.07.05','endtime':'2016.10.20','turnstatus':0},
                    // {'deptname':'B超（斜管组）','head':'马梁','secretary':'star','teaching':'梁好累','settime':'9个月','actualdays':'273天','begintime':'2016.07.05','endtime':'2016.10.20','turnstatus':1},
                    // {'deptname':'B超（腹部组）','head':'马艳','secretary':'star','teaching':'梁好累','settime':'9个月','actualdays':'273天','begintime':'2016.07.05','endtime':'2016.10.20','turnstatus':2},
                    // {'deptname':'B超（妇产组）','head':'马超','secretary':'star','teaching':'梁好累','settime':'9个月','actualdays':'273天','begintime':'2016.07.05','endtime':'2016.10.20','turnstatus':2},
                ],
                noContent: false,
                data: {}
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
            // 点击每一个具体的详情内容
            detail: function (index, deptname) {
                let self = this
                if (index == 3 && self.$route.query.type == 0) {
                    this.$router.push({
                        name: "fdRotation_doctor_exam",
                        query: {
                            deptname: deptname,
                            teachingid:self.$route.query.teachingid,
                            detail:0
                        }
                    })
                } else if (index == 1 && self.$route.query.type == 0) {
                    this.$router.push({
                        name: "fdRotation_doctor_exam",
                        query: {
                            booking: 0,
                            deptname: deptname,
                            teachingid:self.$route.query.teachingid,
                            type:1,
                            detail:0,
                            deptid:self.$route.query.deptid
                        }
                    })
                }
            },
            // 初始化获取轮转计划详情信息
            init: function () {
                let self = this
                self.data = {
                    command: 'turn/turnplan',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    uid: $.cookie('uid')
                }
                // 由带教老师页面跳转过来
                if (self.$route.query.id) {
                    self.data.uid = self.$route.query.id
                }
                self.post('/turn/turnplan', self.data)
                    .done(function (data) {
                        // self.list = self.sort(data.plandetaillist)
                        if(data.plandetaillist){
                            self.list = data.plandetaillist
                        }
                        self.list.map(function (item, index, arr) {
                            if (item.realendtime == null) {
                                item.realendtime = '目前'
                            }
                        })
                        if (self.list.length == 0) {
                            self.noContent = true
                        }
                    }).fail(function (error) {
                        self.noContent = true
                    })
            },
            // 倒叙
            // sort: function (elements) {
            //     for (var i = 0; i < elements.length - 1; i++) {
            //         for (var j = 0; j < elements.length - i - 1; j++) {
            //             if (moment(elements[j].realbegintime).format('X') > moment(elements[j + 1].realbegintime).format(
            //                     'X')) {
            //                 var swap = elements[j];
            //                 elements[j] = elements[j + 1]
            //                 elements[j + 1] = swap
            //             }
            //         }
            //     }
            //     return elements
            // },
            // 返回键
            back() {
                if(this.$route.query.type == 0){
                    this.$router.push({
                        name:'fdRotation_doctor'
                    })
                }else{
                    window.history.back()
                }
                
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
        margin-left: 0.4rem;
        margin-right: 0.2rem;
        padding: 0.05rem 0.3rem;
    }

    .contentDiv {
        position: relative;
    }

    .progress {
        position: absolute;
        background: #c3c3c3;
        width: 0.02rem;
        height: calc(100% - 0.24rem);
        top: 0.34rem;
        left: 0.2rem;
        z-index: 10;
    }

    .progress img {
        position: absolute;
        top: -0.34rem;
        left: calc(50% - 0.12rem);
        width: 0.24rem;
        height: 0.24rem;
    }
    .green {
        background: rgb(32, 219, 154);
    }

    .orange {
        background: orange;
    }

    .list:nth-of-type(1) {
        margin-top: 0.2rem;
    }

    .list li {
        padding: 0.05rem 0;
        /*font-size: 0.24rem;*/
        /*color: #666666;*/
    }

    .listTitle {
        padding-right: 0.3rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.26rem;
        color: #333333;
    }

    .listTitle img {
        height: 0.36rem;
        width: 1rem;
    }
    .progress:nth-last-of-type(1){
        height: calc(100% - 0.34rem);
    }
</style>
