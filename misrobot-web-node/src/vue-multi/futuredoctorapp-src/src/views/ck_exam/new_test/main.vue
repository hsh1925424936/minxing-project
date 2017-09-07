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
                <span class="my-booking-btn" @click="viewStu()">学生情况</span>
            </div>
        </c-header>
        <div class="list lab-list g-main">
            <a class="item valign-center">
                <i class="iconfont icon-clock"></i>
                <div class="auto-width">
                    <h3 class="name left">
                        技能项&nbsp;&nbsp;{{ selectlearnname }}
                    </h3>
                </div>
                <a class="btn btn-blue" @click="showSelectSkill()">选择</a>
            </a>
            <a class="item valign-center">
                <i class="iconfont icon-clock"></i>
                <div class="auto-width">
                    <h3 class="name">考试地点</h3>
                </div>
            </a>
            <template v-for="(value,index) in placelist">
                <a class="item valign-center" @click="toChooseTime(value)">
                    <i class="iconfont icon-clock"></i>
                    <div class="auto-width">
                        <h3 class="name">{{value.pname}}</h3>
                        <p class="addr">{{value.displayname}}</p>
                    </div>
                    <a><img class="go-arrow-btn" src="../../../assets/images/icon_xiangyou.png" /></a>
                </a>
            </template>
            <template>
                <a class="item valign-center" @click="newPlaceTime()">
                    <i class="iconfont icon-clock"></i>
                    <div class="auto-width">
                        <h3 class="name">其它</h3>
                    </div>
                    <a><img class="go-arrow-btn" src="../../../assets/images/icon_xiangyou.png" /></a>
                </a>
            </template>
        </div>
        <c-modal :config="stuInfoModal">
            <table class="lab-info-table">
                <tr>
                    <th>技能项</th>
                    <th>应考人数</th>
                    <th>待考人数</th>
                    <th>考试次数</th>
                    <th>考试人数</th>
                </tr>
                <tr v-for="(value,index) in students">
                    <td>{{ value.learnname }}</td>
                    <td>{{ value.neednum }}</td>
                    <td>{{ value.dknum }}</td>
                    <td>{{ value.examnum }}</td>
                    <td>{{ value.alreadynum }}</td>
                </tr>
            </table>
        </c-modal>
        <c-modal :config="skillModal">
            <div class="flex-item class-sel-list">
                <div class="list info-list list-inner">
                    <div class="item" v-for="(value,index) in learnlist">
                        <label class="flex flex-start flex-row">
                            <div class="fitem">{{value.learnname}}</div>
                            <input type="radio" v-model="selectlearn" :value="value" class="checkbox" />
                        </label>
                    </div>
                </div>
            </div>
            <template slot="buttons">
                <button type="button" class="btn" @click.stop="selectSkill()">确定</button>
            </template>
        </c-modal>
    </div>
</template>

<script>

    import $ from 'jquery'
    import methods from '../../../methods'
    import cHeader from '../../header'
    import cModal from '../../../components/modal'
    import { mapState, mapActions } from 'vuex'
    import xieFn from '../../../vuex/xie'
    export default {
        data() {
            return {
                stuInfoModal: {
                    show: false,
                    title: '查看学生情况',
                    hideOnClickOut: true
                },
                skillModal: {
                    show: false,
                    title: '选择技能项',
                    hideOnClickOut: true,
                    theme: 'hello-world'
                },
                placelist: [],//场地数组
                learnlist:[],//技能项数组
                selectlearn:'',//选择的技能项对象
                students:[],//学生情况数组
                selectlearnid:xieFn.getCookie('learnid'),
                selectlearnname:xieFn.getCookie('learnname')
            }
        },
        components: {
            cHeader,
            cModal
        },
        mounted () {//查询所有场地接口
            var self = this
            this.registerToNative('goBack', function (data) {
                if(self.stuInfoModal.show){
                    self.stuInfoModal.show=false
                }else if(self.skillModal.show){
                    self.skillModal.show=false
                }else{
                    self.back();
                }
            })
            var param={
                command: "learn/queryallplaces",
                sessionid: xieFn.getCookie('sid'),
                loginid: xieFn.getCookie('uid')
            }
            self.post('/learn/queryallplaces',param).done(function(res){
                if(res.errcode==0){
                    self.placelist = res.placelist
                }else{
                    self.toast(res.errdesc)
                }
            }).fail(function(){
                self.toast('连接服务失败，请稍后再试')
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
                window.location.href='/pages/futuredoctorapp/application.html'
                xieFn.setCookie('learnname','')
                xieFn.setCookie('learnid','')
            },
            viewStu(){//查询学生情况接口
                var self = this
                var data={
                    command: "examapply/queryexamsituation",
                    sessionid: xieFn.getCookie('sid'),
                    loginid: xieFn.getCookie('uid'),
                    teacherid:xieFn.getCookie('uid')
                }
                function callback(res){
                    self.students = res.situationlist
                }
                xieFn.post('/examapply/queryexamsituation',data,callback,xieFn.errcodefn,xieFn.errfn)
                this.stuInfoModal.show = true
            },
            selectSkill(){
                this.skillModal.show=false
                this.selectlearnid=this.selectlearn.learnid
                this.selectlearnname=this.selectlearn.learnname
            },
            showSelectSkill(){//查询技能项接口
                var self=this
                var param={
                    command:'examapply/querylearnidbyteacherid',
                    loginid:xieFn.getCookie('uid'),
                    teacherid:xieFn.getCookie('uid'),
                    sessionid:xieFn.getCookie('sid')
                }
                self.post('/examapply/querylearnidbyteacherid',param).done(function(res){
                    if(res.errcode==0){
                        self.learnlist=res.learnlist
                    }else{
                        self.toast(res.errdesc)
                    }
                }).fail(function(){
                    self.toast('连接服务失败，请稍后再试')
                })
                this.skillModal.show = true
            },
            toChooseTime:function(paramJson){
                if(!this.selectlearnname){
                    this.toast('请先选择技能项');
                    return
                }else{
                    xieFn.setCookie('learnname',this.selectlearnname)
                    xieFn.setCookie('learnid',this.selectlearnid)
                    xieFn.setCookie('placename',paramJson.pname)
                    xieFn.setCookie('placeid',paramJson.placeid)
                    this.$router.push({
                        name: 'fdnewTestTime',
                        query: ''
                    })
                }
            },
            newPlaceTime:function(){
                if(!this.selectlearnname){
                    this.toast('请先选择技能项');
                    return
                }else{
                    xieFn.setCookie('learnname',this.selectlearnname)
                    xieFn.setCookie('learnid',this.selectlearnid)
                    this.$router.push({
                        name: 'fdnewTestNewPlace',
                        query: ''
                    })
                }
            }
        }
    }

</script>
<style lang="scss">

    @import "../../../scss/variables.scss";
    .booking-lab-sel {
    .lab-list{
        border-top:none;

    .item {
    .name{
        font-size:.26rem;
        font-weight:normal;
        color: #323232;
        margin-bottom:.1rem;
    }
    .addr{
        margin-bottom:0;
        font-size:.22rem;
        color: #666;
    }
    }
    }
    }
    .my-booking-btn{
        font-size: $font-size-md;
        color: #FFF;
    }
    .lab-info-table{

        width:100%;

    tr {
    th, td{
        padding: .2rem;
        font-weight: normal;
        text-align: center;
        border-right:1px solid $line-color;
        border-bottom:1px solid $line-color;

    &:last-child{
         border-right:none;
     }
    }
    td{
        font-size: $font-size-xm;
        color:$gray;
    }

    th{
        width:50%;
        padding:.25rem;
        color:$gray-dark;
    }

    &:last-child {
    td{
        border-bottom:none;
    }
    }
    }
    }
</style>
