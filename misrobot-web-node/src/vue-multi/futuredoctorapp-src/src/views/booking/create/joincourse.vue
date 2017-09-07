<template>
    <div class="booking-lab-sel g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            其它老师预约信息
        </c-header>
        <div class="g-main">
            <div class="list info-list">
                <div class="item valign-center">
                    <label class="joincourselabel">预约时段：</label><div class="auto-width">{{ starttime.slice(0,16) }}~{{ endtime.slice(11,16) }}</div>
                </div>
                <div class="item valign-center">
                    <label class="joincourselabel">最大容量：</label><div class="auto-width">{{volume}}</div>
                </div>
                <div class="item valign-center">
                    <label class="joincourselabel">已预约数：</label><div class="auto-width">{{count}}</div>
                </div>
                <div class="item valign-center">
                    <label class="joincourselabel">训练项：</label><div class="auto-width"><span v-for="value1 in learnlist">{{ value1.learnname }} </span></div>
                </div>
                <div class="item valign-center">
                    <label class="joincourselabel">预约班级：</label><div class="auto-width"><span v-for="value2 in classlist" v-show="value2.classname!=null && value2.classname!='null'">{{ value2.classname }} </span></div>
                </div>
                <div class="item valign-center">
                    <label class="joincourselabel">申请人：</label><div class="auto-width">{{prevteachername}} {{prevteachermobile}}</div>
                </div>
                <div class="item valign-center">
                    <label class="joincourselabel">备注说明：</label><div class="auto-width">{{comment}}</div>
                </div>
            </div>
            <div class="padding">
                <a class="btn btn-blue btn-lg btn-block" @click="confirmjoin()"> 一起上课 </a>
            </div>
        </div>
    </div>
</template>

<script>

    import $ from 'jquery';
    import methods from '../../../methods';
    import cHeader from '../../header';
    import xieFn from '../../../vuex/xie';
    import { mapState, mapActions } from 'vuex';

    export default {
        data() {
            return {
                starttime:'',
                endtime:'',
                volume:'',
                count:'',
                learnlist:[],
                classlist:[],
                prevteachername:'',
                prevteachermobile:'',
                comment:'',
                coursename:''
            }
        },
        components: {
            cHeader
        },
        mounted () {
            let self = this;
            this.post('/learn/queryclassbooking', {
                command: "learn/queryclassbooking",
                sessionid: $.cookie('sid'),
                loginid: $.cookie('uid'),
                placeid:xieFn.getCookie('selLabPlaceId'),
                orderid:xieFn.getCookie('sellabOrderid'),
                scheduleid:xieFn.getCookie('sellabScheduleid')
            }).done(function(data){
                console.log(JSON.stringify(data))
                if(data.errcode==0){
                    self.starttime = data.starttime
                    self.endtime = data.endtime
                    self.volume = data.volume
                    self.count = data.stunum
                    self.learnlist = data.learnlist
                    self.classlist = data.classlist
                    self.prevteachername = data.teachername
                    self.prevteachermobile=data.teachermobile
                    self.comment = data.comment
                    self.coursename=data.coursename
                    self.stunum = data.stunum
                    self.courseid=data.courseid
                }else{
                    self.toast(data.errdesc)
                }
            }).fail(function () {
                self.toast('连接服务失败，请稍后再试')
            })
            this.registerToNative('goBack', function (data) {
                self.back();
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
        back() {
            this.$router.push({
                name: 'fdCreateSelLabTable',
                query: ''
            })
        },
        confirmjoin:function(){
            this.$router.push({
                name: 'fdCreateSubmitsecond',
                query: {
                    classlist:this.classlist,
                    learnlist:this.learnlist,
                    starttime:this.starttime,
                    endtime:this.endtime,
                    coursename:this.coursename,
                    stunum:this.stunum,
                    courseid:this.courseid
                }
            })
        }
    }
    }
</script>
<style lang="scss">
    @import "../../../scss/variables.scss";
    .joincourselabel{
        width:1.3rem
    }
</style>
