<template>
    <div class="booking-lab-sel g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            出科考试预约
            <div slot="headerRight">
                <span class="my-booking-btn" @click="forward()">下一步</span>
            </div>
        </c-header>
        <div class="g-main">
            <p class="pageTitle">
                {{ placename }}
            </p>
            <div class="timetable" border="1" cellspacing="0">
                <div>
                <div class="flex">
                    <div class="timetabletd"></div>
                    <div v-for="(value1,index1) in day" class="flex-column timetabletd" style="padding:.12rem 0;box-sizing:border-box;">
                        {{ value1.day.slice(5,10) }}
                        <br>
                        {{ value1.day.slice(0,10) | daytoweek }}
                    </div>
                </div>
                </div>
                <div>
                <div v-for="(value2,index2) in timeslist" class="flex">
                    <div class="flex-column timetabletd">
                        {{ value2.starttime.slice(0,5) }}~
                        </br>
                        {{ value2.endtime.slice(0,5) }}
                    </div>
                    <div v-for="(value3,index3) in timeslist[index2].dayslist" :class="{'grayBack':value3.status==0?false:true}" class="timetabletd">
                        <span v-if='value3.status!=0' v-text="value3.status==0?'':'已预约'"></span>
                        <input v-if='value3.status==0' type='checkbox' v-model='selecttimes' :value='value3' class='timecheckbox' />
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import $ from 'jquery'
    import methods from '../../../methods'
    import cHeader from '../../header.vue'
    import { mapState, mapActions } from 'vuex'
    import xieFn from '../../../vuex/xie'
    export default {
        data() {
            return {
                timeslist: [],//每周预约时间信息数组
                placename:'',
                isChoosed:false,
                selecttimes:[],
                day:[]
            }
        },
        components: {
            cHeader,
        },
        filters: {
            daytoweek: function (oldvalue) {
                var newvalue=xieFn.whichday(oldvalue)
                return newvalue
            }
        },
        created () {//选择预约时间接口
            var self=this
            self.placename=xieFn.getCookie('placename')
            var param = {
                command: 'examapply/queryexamtimesbyplaceid',
                loginid: xieFn.getCookie('uid'),
                placeid: xieFn.getCookie('placeid'),
                sessionid: xieFn.getCookie('sid'),
                learnid:xieFn.getCookie('learnid')
            }
            self.post('/examapply/queryexamtimesbyplaceid',param).done(function(res){
                if(res.errcode==0){
                    console.log(JSON.stringify(res))
                    self.timeslist = res.timeslist
                    self.day=res.timeslist[0].dayslist
                    for(var i=0;i<self.timeslist.length;i++){
                        for(var j=0;j<self.timeslist[i].dayslist.length;j++){
                            self.timeslist[i].dayslist[j].starttime=self.timeslist[i].starttime
                            self.timeslist[i].dayslist[j].endtime=self.timeslist[i].endtime
                        }
                    }
                    console.log(JSON.stringify(self.timeslist))
                }else{
                    self.toast(res.errdesc)
                }
            }).fail(function(){
                self.toast('连接服务失败，请稍后再试')
            })
        },
        mounted () {
            var self = this
            this.registerToNative('goBack', function (data) {
                self.back()
            })
        },
        updated :function(){
            var tdwidth=$('td').width()
            $('td').each(function(){
                $(this).height(tdwidth)
            })
        },
        methods: {
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            ...methods,
            back:function(){
                this.$router.push({
                    name: 'fdnewTest',
                    query: ''
                })
            },
            forward: function () {
                if(this.selecttimes.length==0){
                    this.toast('请选择预约时间')
                    return
                }
                this.selecttimes.forEach(function(a,b){
                    console.log(JSON.stringify(a))
                })
                this.isTimeLegal()
            },
            isTimeLegal:function(){//选择的时间是否合法
                var self=this
                if(self.selecttimes.length==1){//如果只选了一个时段，直接跳转到保存预约页面，不需要判断合并
                    this.$router.push({
                        name: 'fdnewTestSave',
                        query: {
                            selecttimes:self.selecttimes
                        }
                    })
                }else{//如果选择了2个以上时段，先判断是否跨天，同一天内再判断是否可以合并
                    var starttimearr=[]//判断用户选的时间是否跨天
                    self.selecttimes.forEach(function(value){
                        starttimearr.push(value.day.slice(0,11))
                    })
                    var sortarr=starttimearr.sort()
                    for(var i=0;i<sortarr.length-1;i++){
                        if(sortarr[i]!=sortarr[i+1]){
                            self.toast('只能预约一天内的考试，不可跨天')
                            return
                        }
                    }
                    var temp=[]
                    self.selecttimes.forEach(function(value){
                        temp.push({
                            starttime:value.day.slice(0,11)+''+value.starttime,
                            endtime:value.day.slice(0,11)+''+value.endtime
                        })
                    })
                    var param={
                        command:'learn/isschedulemerge',
                        loginid:xieFn.getCookie('uid'),
                        sessionid:xieFn.getCookie('sid'),
                        timelist:temp//starttime,endtime
                    }
                    self.post('/learn/isschedulemerge', param).done(function (res) {
                        if(res.errcode==0){
                            self.$router.push({
                                name: 'fdnewTestSave',
                                query: {
                                    selecttimes:self.selecttimes
                                }
                            })
                        }else if(res.errcode==300001){
                            self.toast('所选时间段不能合并')
                        }else{
                            self.toast(res.errdesc)
                        }
                    }).fail(function () {
                        self.toast('连接服务失败，请稍后再试。')
                    })
                }
            },
        }
    }

</script>
<style lang="scss">
    @import "../../../scss/variables.scss";
    .left{
        float:left;
    }
    .right{
        float:right;
    }
    .grayBack{
        background-color: #C3C3C3;
        color:white;
    }
    .timecheckbox {
        width: 100%;
        height: 100%;
        background-clip: content-box;
        display: block;
        -webkit-appearance: none;
        user-select: none;
        outline: none;
        border:none;
    }
    .timecheckbox:checked {
        background-image: url('../../../assets/images/icon_selected.png');
        background-size: 70%;
        background-repeat: no-repeat;
        background-color:#6Bd969;
        background-position:center;
        border-radius: 0;
    }
    .pageTitle{
        margin:0;
        border-bottom:1px solid #D3D3D3;
        text-align: center;
        padding:16px;
        background-color: #F2F2F2;
        color:#696969;
    }
    .flex{
        display:flex;
    }
    .flex-column{
        display:flex;
        flex-direction: column;
        justify-content: center;
    }
    .timetable{
        text-align: center;
        width:100%;
        margin:0 auto;
        border-color: #D3D3D3;
        font-size:.20rem;
        border-left:none;
        border-right:none;
        background-color: white;
    }
    .timetabletd{
        box-sizing:border-box;
        width:12.5%;
        height:1.1rem;
        /* line-height: 1.1rem; */
        border:solid 1px #c3c3c3;
        border-left:none;
        border-top:none;
        display:flex;
        justify-content: center;
        align-items: center;
        /* -webkit-border:solid .01rem #c3c3c3; */
    }
    /* .timetable th{
        padding:.12rem 0;
        width:12.5%;
        box-sizing:border-box;
    } */
</style>
