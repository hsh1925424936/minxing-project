<template>
    <div class="g-main">
        <!-- <div class="all">
                <span>{{selectContent}}</span>
                <img @click="select" src="../../assets/images/btn_fenlei.png" alt="">
        </div> -->
        <div class="list" v-for="item in testlist" @click="enterExam(item)" v-if="item.status == 1 ||　item.status == 2">
            <div class="img">
                <img src="../../assets/images/icon_suitang.png" alt="" v-if="item.type == 3">
                <img src="../../assets/images/icon_lilun.png" alt="" v-else>
            </div>
            <div class="testname">
                <p>{{item.testname}}</p>
                <p class="score" v-if="item.score || item.score == 0"><span>{{item.score}}</span>分</p>
                <p class="score" v-else style="color:rgb(254,165,23);border-bottom:solid .03rem rgb(254,165,23);">待评分</p>
            </div>
            <div class="message">
                <ul>
                    <li>
                        <p><span>课&emsp;&emsp;程：</span>{{item.coursename}}</p>
                    </li>
                    <li>
                        <p><span>老&emsp;&emsp;师：</span>{{item.teachername}}</p>
                    </li>
                    <li>
                        <p><span>考试时间：</span>{{item.starttime}}-{{item.endtime}}</p>
                    </li>
                </ul>
            </div>
        </div>
        <!-- <div class="content" v-if="show" @click="show = false">
            <p></p>
            <ul>
                <li @click="selectScore(0)">全部</li>
                <li @click="selectScore(1)">待评分</li>
                <li @click="selectScore(2)">已评分</li>
            </ul>
        </div> -->
        <no-content v-if="noContent"></no-content>
    </div>
</template>
<script>
    import $ from 'jquery'
    import moment from 'moment';
    import methods from '../../methods'
    import noContent from '../no_content'
    import {
        mapState,
        mapActions
    } from 'vuex'
    export default {
        name:'my_test_ready',
        components:{
            noContent,
        },
        data(){
            return{
                selectContent:'全部',
                testlist:[
                    // {testname:'临床医学2班阶段考试',coursename:'临床医学',score:98,teacher:'李娜',starttime:'2017年7月10日14:00',endtime:'15:00',status:0},
                    // {testname:'临床医学2班阶段考试',coursename:'临床医学',score:98,teacher:'李娜',starttime:'2017年7月10日14:00',endtime:'15:00',status:0},
                    // {testname:'临床医学2班阶段考试',coursename:'临床医学',teacher:'李娜',starttime:'2017年7月10日14:00',endtime:'15:00',status:1},
                ],
                noContent:false,
                // show:false,
            }
        },
        mounted(){
            let self = this
            this.init()
            this.registerToNative('goBack', function (data) {
                self.back();
            });
        },
        methods:{
            ...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            back(){
                window.location.href = '/pages/futuredoctorapp/application.html'
            },
            init(){
                let self = this
                this.post('/unifyexam/querytestlist',{
                    command:'unifyexam/querytestlist',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    uid:$.cookie('uid'),
                    status:2,
                    answermode:1,
                }).done(function(data){
                    // console.log(data)
                    if(data && data.errcode == 0){
                        // console.log(data.testlist)
                        if(data.testlist.length == 0){
                            self.noContent = true
                        }else{
                            data.testlist.map((item)=>{
                                if(item.status == 1 || item.status == 2){
                                    self.noContent = false
                                }else{
                                    self.noContent = true
                                }
                            })
                            // self.noContent = false
                            self.testlist = data.testlist
                            self.testlist.map((item)=>{
                                // alert(item.starttime)
                                item.starttime = moment(item.starttime).format('YYYY-MM-DD HH:mm')
                                item.endtime = moment(item.endtime).format('YYYY-MM-DD HH:mm').slice(-5)
                            })
                            // console.log(self.testlist)
                        }
                    }
                }).fail(function(error){
                    
                })
            },
            // select(){
            //     this.show = !this.show
            // },
            // selectScore(index){
            //     if(index == 0){
            //         this.selectContent = '全部'
            //     }else if(index == 1){
            //         this.selectContent = '待评分'
            //     }else if(index == 2){
            //         this.selectContent = '已评分'
            //     }
            //     this.show = false
            // },
            enterExam(item){
                if(item.status == 0){
                    this.toast('该考试还没有开始！')
                }else if(item.status == 1){
                    this.toast('该考试已经过期了！')
                }else{
                    this.$router.push({
                        name: 'fdIntegrated_my_test_detail',
                        query:{
                            id:item.id,
                            name:item.testname,
                            paperid:item.paperid,
                        }
                    })
                }
            }
        }
    }
</script>
<style scoped>
    .list{
        margin-top:.2rem!important;
        margin-bottom: 0;
        padding-bottom:.2rem;
    }
    .img{
        height:.4rem;
    }
    .img img{
        width:1rem;
        position:relative;
        top:-.08rem;
    }
    .testname{
        text-align:center;
        margin-bottom: .3rem;
        color: #333333;
        position:relative;
    }
    .score{
        position:absolute;
        color:rgb(9,203,179);
        /* top:-.2rem; */
        bottom:-.09rem;
        right:0.3rem;
        border-bottom: solid .03rem rgb(9,203,179); 
    }
    .score span{
        font-size:.36rem;
    }
    .message{
        padding:0 .3rem;
    }
    .message ul li{
        padding:.05rem 0;
        color:#333333;
    }
    .message ul li p span{
        margin-right: .1rem;
        color:#666666;
    }
     .all{
        width:100%;
        height:.72rem;
        /* border-bottom: solid 1px gray; */
        display:flex;
        justify-content: space-between;
        align-items: center;
        background: rgb(255,255,255);
        padding:0 .3rem;
        color:#3499db;
        /* margin-bottom: .2rem; */
    }
    .all img{
        width:.5rem;
    }
    .content{
        width: 100vw;
        height: 100vh;
        position:fixed;
        top:0;
        background:rgba(0,0,0,0.2);
    }
    .content ul{
        position:absolute;
        background: rgb(255,255,255);
        width:2rem;
        height:2.1rem;
        /* line-height: 1.8; */
        border-radius: .1rem;
        right:.1rem;
        top:2.2rem;
        padding:0 .2rem;
    }
    .content ul li{
        width:100%;
        height:.7rem;
        text-align: center;
        line-height: .7rem;
        border-bottom: solid 1px rgb(220,220,220);
    }
    .content ul li:nth-last-child(1){
        border-bottom: none;
    }
    .content p{
        width:0;
        height: 0;
        border-left:.15rem solid transparent;
        border-right:.15rem solid transparent;
        border-bottom: .15rem solid #ffffff;
        position: absolute;
        right:.3rem;
        top:2.05rem;
    }
</style>