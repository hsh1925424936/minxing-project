<template>
    <div class="g-wrapper booking-submit">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            预约信息确认
        </c-header>

        <div class="g-main">
            <div class="list info-list">
                <div class="item valign-center">
                    <span class="xielefttitle">技能项 : </span>{{learnname}}
                </div>
                <div class="item valign-center">
                    <span class="xielefttitle">场地 : </span>{{placename}}
                </div>
            </div>

            <div class="list info-list">
                <div class="item valign-center">
                    <label style="width:1.9rem">考试时间：</label>
                    <div class="auto-width">
                        {{ testconfirminfo.starttime.slice(0,16) }}~{{ testconfirminfo.endtime.slice(11,16) }}
                    </div>
                </div>
                <div class="item valign-center">
                    <label style="width:1.9rem">报名截止时间：</label>
                    <div class="auto-width">
                        {{ testconfirminfo.joinlasttime.slice(0,16) }}
                    </div>
                </div>
                <div class="item valign-center">
                    <label style="width:1.9rem">报名人数上限：</label>
                    <div class="auto-width">
                        {{ testconfirminfo.volumemax }}
                    </div>
                </div>
                <div class="item remark">
                    <label>备注：</label>
                    <div class="text-wrap">
                        <textarea v-model="comment" maxlength="18" placeholder="请输入备注（20字内）"></textarea>
                    </div>
                </div>
            </div>
        </div>
        <div class="padding">
            <a class="btn btn-blue btn-lg btn-block" @click="bookingSubmit()"> 确认预约 </a>
        </div>
    </div>
</template>

<script>
    //new
    import $ from 'jquery'
    import methods from '../../../methods'
    import cHeader from '../../header.vue'
    import { mapState, mapActions } from 'vuex'
    import xieFn from '../../../vuex/xie'

    export default {
        data() {
            return {
                comment:'',
                timeInfo:[],
                learnname:xieFn.getCookie('learnname'),
                learnid:xieFn.getCookie('learnid'),
                placename:xieFn.getCookie('placename'),
                placeid:xieFn.getCookie('placeid'),
                testconfirminfo:{
                    starttime:'',
                    endtime:'',
                    volumemax:0,
                    joinlasttime:'',
                    day:''
                }
            }
        },
        components: {
            cHeader,
        },
        filters:{
            ch(oldvalue){
                var x='一'
                switch (oldvalue)
                {
                    case 1:
                        x="一";
                        break;
                    case 2:
                        x="二";
                        break;
                    case 3:
                        x="三";
                        break;
                    case 4:
                        x="四";
                        break;
                    case 5:
                        x="五";
                        break;
                    case 6:
                        x="六";
                        break;
                    case 7:
                        x="七";
                        break;
                    case 8:
                        x="八";
                        break;
                    case 9:
                        x="九";
                        break;
                    case 10:
                        x="十";
                        break;
                }
                return x
            }
        },
        created() {},
        mounted () {
            var self = this
            this.registerToNative('goBack', function (data) {
                self.back()
            })
            self.timeInfo=this.$route.query.selecttimes
            self.testconfirminfo.day=self.timeInfo[0].day
            self.testconfirminfo.joinlasttime=self.timeInfo[0].joinlasttime
            var temp=[]
            self.timeInfo.forEach(function(value){
                temp.push(value.starttime)
                temp.push(value.endtime)
                self.testconfirminfo.volumemax+=parseInt(value.volumemax)
            })
            var sorttemp=temp.sort()
            self.testconfirminfo.starttime=self.testconfirminfo.day.slice(0,11)+''+sorttemp[0]
            self.testconfirminfo.endtime=self.testconfirminfo.day.slice(0,11)+''+sorttemp[sorttemp.length-1]
        },
        methods: {
            ...mapActions([
                'showAlert',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            ...methods,
            back(){
                this.$router.push({
                    name: 'fdnewTestTime',
                    query: ''
                })
            },
            getFirstAndLastMonthDay:function( year, month){//时间格式函数
                var   firstdate = year + '-' + month + '-01'
                var  day = new Date(year,month,0)
                if(month.toString().length==1){
                    var lastdate = year + '-' + '0'+month + '-' + day.getDate()//获取当月最后一天日期
                }else{
                    var lastdate = year + '-' + month + '-' + day.getDate()//获取当月最后一天日期
                }
                return lastdate
            },
            bookingSubmit:function(){
                var self=this
                var param={
                    command:'examapply/submitexamapply',
                    sessionid:xieFn.getCookie('sid'),
                    loginid:xieFn.getCookie('uid'),
                    teacherid:xieFn.getCookie('uid'),
                    placeid:xieFn.getCookie('placeid'),
                    placeinfo:'',
                    learnid:xieFn.getCookie('learnid'),
                    applyinfolist:[]//starttime,endtime,joinlasttime,volumemax,comment
                }
                param.applyinfolist.push({
                    starttime:self.testconfirminfo.starttime,
                    endtime:self.testconfirminfo.endtime,
                    joinlasttime:self.testconfirminfo.joinlasttime,
                    volumemax:self.testconfirminfo.volumemax,
                    comment:self.comment
                })
                console.log(JSON.stringify(param))
                self.post('/examapply/submitexamapply',param).done(function(res){
                    if(res.errcode==0){
                        self.toast('提交预约成功！')
                        xieFn.setCookie('learnname','')
                        xieFn.setCookie('learnid','')
                        setTimeout(function(){
                            self.$router.push({
                                name: 'fdnewTestRecord',
                                query: ''
                            });
                        },1500)
                    }else{
                        self.toast(res.errdesc)
                    }
                }).fail(function(){
                    self.toast('连接服务失败，请稍后再试')
                })
            }
        }
    }

</script>
<style lang="scss">

    @import "../../../scss/variables.scss";
    .xielefttitle{
        display:inline-block;
        width:1.9rem;
    }
    .booking-submit{
    .info-list{
        margin-bottom:.14rem;

    .btn-item {
        padding-top:.16rem;
        padding-bottom:.16rem;
    }
    .btn{
        padding-top:.3em;
        padding-bottom:.3em;
    }

    .remark{
    label{
        float: left;
        margin-top:.06rem;
    }
    .text-wrap{
        margin-left:.85rem;

    textarea{
        width:100%;
        font-size:.24rem;
    }
    }
    }
    }

    .class-sel-wrap{
        padding-left:.2rem;
    .years{
        padding:.2rem;
    li{
        width:100%;
        color:#888;
        margin-bottom:.1rem;
        padding:.1rem 0;

    &.active{
         color: $blue;
         border-bottom: .02rem solid $blue;
     }
    }
    }
    .class-sel-list{
        width:100%;
    }
    }

    }
</style>
