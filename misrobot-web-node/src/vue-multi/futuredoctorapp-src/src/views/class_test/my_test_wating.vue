<template>
    <div class="g-main">
        <div class="list" v-for="(item,index) in testlist" @click="enterExam(item,index)" v-if="item.status == -1">
            <div class="img">
                <img src="../../assets/images/icon_suitang.png" alt="" v-if="item.type == 3">
                <img src="../../assets/images/icon_lilun.png" alt="" v-else>
            </div>
            <div class="testname">
                <p>{{item.testname}}</p>
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
                        <p><span>考试时间：</span>{{item.starttime}}~{{item.endtime}}</p>
                    </li>
                </ul>
                <img src="../../assets/images/icon_yiguoqi.png" alt="" v-if="item.showTime">
            </div>
        </div>
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
        mapActions,
    } from 'vuex'
    export default {
        name:'my_test_ready',
        components:{
            noContent,
        },
        data(){
            return{
                testlist:[
                    // {testname:'临床医学2班阶段考试',coursename:'临床医学',teachername:'李娜',starttime:'2017年7月10日14:00',endtime:'2017年7月10日15:00',status:0},
                    // {testname:'临床医学2班阶段考试',coursename:'临床医学',teacher:'李娜',starttime:'2017年7月10日14:00',endtime:'15:00',status:0},
                    // {testname:'临床医学2班阶段考试',coursename:'临床医学',teacher:'李娜',starttime:'2017年7月10日14:00',endtime:'15:00',status:1},
                ],
                noContent:false,
                nowTime:0,
                showTime:[],
                times:[]
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
                this.nowTime = new Date()
                this.post('/unifyexam/querytestlist',{
                    command:'unifyexam/querytestlist',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    uid:$.cookie('uid'),
                    status:-1,
                    answermode:1,
                }).done(function(data){
                    if(data && data.errcode == 0){
                        if(data.testlist.length == 0){
                            self.noContent = true
                        }else{
                            data.testlist.map((item)=>{
                                if(item.status != -1){
                                    self.noContent = true
                                }else{
                                    self.noContent = false
                                }
                            })
                            self.testlist = data.testlist
                            self.testlist.map((item)=>{
                                self.times.push({
                                    starttime:item.starttime,
                                    endtime:item.endtime
                                })
                                if(moment(item.endtime).format('X') < moment(self.nowTime).format('X')){
                                    item.showTime = true
                                }
                                item.starttime = moment(item.starttime).format('YYYY-MM-DD HH:mm')
                                item.endtime = moment(item.endtime).format('YYYY-MM-DD HH:mm').slice(-5)
                            })
                        }
                    }
                }).fail(function(error){
                    console.log(error)
                })
            },
            enterExam(item,index){
                this.nowTime = new Date()
                if(moment(this.times[index].starttime).format('X') > moment(this.nowTime).format('X')){
                    this.toast('该考试还没有开始考试！')
                }else if(moment(this.times[index].endtime).format('X') < moment(this.nowTime).format('X')){
                    this.toast('该考试已经过期！')
                }else{
                     this.$router.push({
                        name: 'fdIntegrated_my_test_exam',
                        query:{
                            id:item.id,
                            name:item.testname,
                            paperid:item.paperid,
                        }
                    })
                }
                   
            },
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
        /* font-size:.3rem; */
    }
    .message{
        padding:0 .3rem;
        position:relative;
    }
    .message img{
        width:1.8rem;
        position:absolute;
        top:-.3rem;
        right:.3rem;
    }
    .message ul li{
        padding:.05rem 0;
        color:#333333;
    }
    .message ul li p span{
        margin-right: .1rem;
        color:#666666;
    }
</style>