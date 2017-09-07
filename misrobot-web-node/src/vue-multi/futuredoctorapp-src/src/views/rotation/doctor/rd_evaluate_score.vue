<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft" v-if='showEvaluate'>
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            <div v-if='showDetail'>{{date}}</div>
            <div v-if='showEvaluate'>评分</div>
            <div slot='headerRight' v-if='showEvaluate' style="font-size: 0.3rem;" @click='submit'>提交</div>
        </c-header>
        <div class="g-main" v-if='!noContent'>
            <div class="title">
                <p>{{hospital}}</p>
                <p>{{title}}</p>
            </div>
            <div class="explain">
                <span>*</span>尊敬的学员：请对您的带教老师进行评价，本问卷仅用于综合评价带教老师的带教情况，不会公开问卷结果，请放心填写！
            </div>
            <!--查看詳情時顯示-->
            <div class="evaluateDetail" v-if='showDetail'>
                <ul>
                    <li v-for='(item,index) in detaillist'>
                       <p>{{index+1}}、{{item.title}}</p>
                       <p>
                          {{item.content}}
                       </p>
                    </li>
                </ul>
                
            </div>
            <div class="teacher" v-if='showDetail'>
                <p>是否推选其为优秀带教老师</p>
                <label><input type="radio" class="radio" value='0' v-model='recommend' disabled>是</label>
                <label><input type="radio" class="radio" value='1' v-model='recommend' disabled>否</label>
            </div>
            <div class="advise" v-if='showDetail'>
                <p><span style="color: red">*</span> 意见和建议（必填）</p>
                <textarea v-model='advise' placeholder="请填写您的建议或意见..." disabled="disabled"></textarea>
            </div>
            <!--評分時顯示-->
            <div class="evaluateDetail" v-if='showEvaluate'>
                <ul>
                    <li v-for='(item,index) in evaluationList'>
                        <p>{{index+1}}、{{item.title}}</p>
                        <p class="flex" style="justify-content: space-around;">
                            <label @click='check(v,index)' v-for='v in item.evaluationitems'><input type="radio" class="radio" :name="index" :value="v.id">{{v.content}}</label>
                        </p>
                    </li>
                </ul>
            </div>
            <div class="teacher" v-if='showEvaluate'>
                <p>是否推选其为优秀带教老师</p>
                <label><input type="radio" class="radio" value='0' v-model='recommend'>是</label>
                <label><input type="radio" class="radio" value='1' v-model='recommend'>否</label>
            </div>
            <div class="advise" v-if='showEvaluate'>
                <p><span style="color: red">*</span> 意见和建议（必填）</p>
                <textarea v-model='advise' placeholder="请填写您的建议或意见..." @focus='textareaFocus' @blur='textareaBlur'></textarea>
            </div>
            <div class="remark">
                <p>备注：</p>
                <div>
                    <p><span>优&emsp;(5分):</span><span>对我的帮助很大</span></p>
                    <p><span>良&emsp;(4分):</span><span>对我有较大的帮助</span></p>
                    <p><span>中&emsp;(3分):</span><span>对我有些帮助</span></p>
                    <p><span>差&emsp;(2分):</span><span>对我的帮助一般</span></p>
                    <p><span>很差(1分):</span><span>对我几乎无帮助</span></p>
                    <p><span>&emsp;&emsp;(0分):</span><span>该项没有做到</span></p>
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
    import { mapState,mapActions } from 'vuex'
    export default {
        name: 'rd_evaluate_score',
        components: {
            cHeader,
            noContent
        },
        data() {
            return {
                showDetail: false,
                showEvaluate: false,
                hospital: '武汉大学中南医院',
                title: '住院医师规范化培训科室带教综合评价表',
                answer: [],
                evaluationList: [],
                checkedlist: [],
                date: '',
                recommend:0,
                advise:'',
                detaillist:[],
                noContent: false
            }
        },
        mounted() {
            let self = this
            self.date = self.$route.query.date
            // booking = 0;是查看详情
            // booking = 1;是评分页
            if (self.$route.query.booking == 0) {
                self.showDetail = true
                self.queryevaluateditems()
            } else if (self.$route.query.booking == 1) {
                self.showEvaluate = true
                self.evaluateScore(1)
            }
            self.registerToNative('goBack', function (data) {
                self.back();
            });
        },
        methods: {
            ...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            // 点击提交的时候
            submit: function () {
                let self = this
                let date = new Date()
                let year = date.getFullYear()
                let month = date.getMonth() + 1
                let day = date.getDate()

                self.checkedlist = []
                self.evaluationList.map(function (item, index, arr) {
                    item.evaluationitems.map(function (item1, index1, arr1) {
                        if (item1.checked) {
                            self.checkedlist.push({
                                id: item1.id,
                                score: item1.score
                            })
                        }
                    })
                })
                if (self.checkedlist.length != self.evaluationList.length) {
                    self.toast('还有' + (self.evaluationList.length - self.checkedlist.length) + '项没有评')
                }else if(self.advise == ''){
                    self.toast('请填写您的建议或意见！')
                }else {
                    self.post('/turn/submitevaluationitems', {
                        command: 'turn/submitevaluationitems',
                        sessionid: $.cookie('sid'),
                        loginid: $.cookie('uid'),
                        type: 1,
                        uid: $.cookie('uid'),
                        evaluatedid: self.$route.query.teachingid + '',
                        items: self.checkedlist,
                        month: year + '-' + month + '-' + day,
                        recommend:self.recommend,
                        advise:self.advise,
                        deptid:self.$route.query.deptid
                    }).done(function (data) {
                        if(data.errcode == '0'){
                            self.$router.push({
                            name: "fdRotation_doctor_exam_date",
                            query: {
                                booking: 1,
                                teachingid: self.$route.query.teachingid,
                                type:self.$route.query.type,
                                deptname:self.$route.query.deptname,
                                detail:self.$route.query.detail
                            }
                        })
                        }else{
                            self.toast(data.errdesc)
                        }
                    }).fail(function (error) {
                        self.noContent = true
                    })
                }
            },
            evaluateScore: function (type) {
                let self = this
                self.post('/turn/queryevaluationitems', {
                    command: 'turn/queryevaluationitems',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    type: type
                }).done(function (data) {
                    self.evaluationList = data.evaluationList
                }).fail(function (error) {
                    self.noContent = true
                })
            },
            queryevaluateditems(){
                let self = this
                this.post('/turn/queryevaluateditems',{
                    command:'turn/queryevaluateditems',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    id:self.$route.query.id
                }).done(function(data){
                    self.recommend = data.recommend
                    self.advise = data.advise
                    self.detaillist = data.detaillist
                    // console.log(self.detaillist)
                    if(self.detaillist.length == 0){
                        self.noContent = true
                    }
                }).fail(function(error){
                    self.noContent = true
                })
            },
            // 点击评分的时候点击每个选项的时候
            check(item, index) {
                // console.log(item)
                // console.log(index)
                let self = this
                self.evaluationList[index].evaluationitems.map(function (item, index, arr) {
                    if (item.checked) {
                        delete item.checked
                    }
                })
                if (typeof item.checked == 'undefined') {
                    self.$set(item, 'checked', true)
                }
                // console.log(self.evaluationList)
            },
            textareaFocus(){
                $('.g-main').css("padding-bottom",'5rem')
            },
            textareaBlur(){
                $('.g-main').css("padding-bottom",'0')
            },
            back: function () {
                let self = this
                if(self.showEvaluate){
                    self.showConfirm({
                    title: '提醒',
                    msg: '你当前评价尚未提交保存，是否确认返回？',
                    theme: 'modal-confirm modal-white',
                    ok: function () {
                        self.$router.push({
                            name: "fdRotation_doctor_exam_date",
                            query: {
                                type: self.$route.query.type,
                                teachingid:self.$route.query.teachingid,
                                deptname:self.$route.query.deptname,
                                booking:self.$route.query.booking,
                                detail:self.$route.query.detail,
                                deptid:self.$route.query.deptid
                            }
                        })
                    },
                    cancel: function () {

                    }
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
        background: #f8f7f9!important;
        color: rgb(100,100,100);
    }
    .title {
        color: black;
        text-align: center;
        /*height: 1rem;*/
        background: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        /*padding-top: 0.1rem;*/
        margin-bottom: 0;
        font-size: 0.26rem;
    }

    .explain {
        /*margin-top: 0.2rem;*/
        height: auto;
        /*background: #ffa81d;*/
        padding: 0.1rem;
        font-size: 0.24rem;
        background: rgb(244,226,198);
        /*opacity: 0.2;*/
    }

    .explain span {
        color: red;
    }

    .evaluateDetail {
        margin-top: 0.1rem;
        background: white;
        padding: 0 0.2rem;
        /*font-size: 0.24rem;*/
    }

   .evaluateDetail ul li{
       border-bottom: solid 0.01rem rgb(240,240,240);
       padding: 0.1rem 0;
       font-size: 0.22rem;
   }
   .evaluateDetail ul li:nth-last-of-type(1){
       border: none;
   }
    .evaluateDetail ul li p:nth-last-of-type(1) input {
        position: relative;
        top: 0.06rem;
        /*left:0.05rem;*/
    }
     .radio {
        width: .25rem;
        height: .25rem;
        position: relative;
        box-shadow: #dfdfdf 0 0 0 0 inset;
        border-radius: .15rem;
        border-top-left-radius: .15rem;
        border-top-right-radius: .15rem;
        border-bottom-left-radius: .15rem;
        border-bottom-right-radius: .15rem;
        background-clip: content-box;
        display: inline-block;
        -webkit-appearance: none;
        user-select: none;
        outline: none;

        background-image: url('../../../assets/images/gouxuan.png');
        background-size: cover;
        margin-right: 0.05rem;
    }

    .radio:checked {
        background-image: url('../../../assets/images/gouxuan_on.png');
        background-size: cover;
    }
    .teacher{
        margin: 0.1rem 0;
        /*display: flex;*/
        /*justify-content: space-between;*/
        /*height: 1rem;*/
        /*align-items: center;*/
        /*border-bottom: solid 0.01rem #c3c3c3;*/
        padding: 0.1rem;
        background: white;
    }
    .teacher label{
        position: relative;
        top:-0.08rem; 
        margin-top: 0.1rem;
        margin-left: 0.2rem;
    }
    .teacher label:nth-last-of-type(1){
        margin-left: 1.2rem;
    }
    .teacher label input{
        position: relative;
        top: 0.08rem;
    }
    .advise{
        padding: 0.1rem;
        background: white;
    }
    .advise textarea{
        width: 100%;
        height: 2rem;
        border: solid 0.01rem #c3c3c3;
        padding: 0.1rem;
    }
    .remark{
        padding: 0.1rem;
        font-size: 0.2rem;
    }
    .remark div{
        padding-left: 0.5rem;
    }
    .remark div p{
        width: 50%;
        float: left;
        /*color: #666666;*/
    }
</style>
