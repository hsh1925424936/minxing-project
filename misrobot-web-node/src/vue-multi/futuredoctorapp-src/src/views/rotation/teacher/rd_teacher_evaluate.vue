<template>
    <div class="g-wrapper" @click='close'>
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            评分
            <div slot='headerRight' style="font-size: 0.3rem;" @click='submit'>提交</div>
        </c-header>
         <div v-if='showDate' class="datelist">
             <div class="dateUl">
                 <p class="triangle"></p>
                  <ul :class='[{firstUl:date.length == 1},{secondUl:date.length == 2},{thirdUl:date.length >= 3}]'>
                     <li v-for='item in date' @click='selectTime(item)'>{{item}}</li>
                  </ul>
             </div>
            </div>
        <div class="g-main" v-if='!noContent'>

            <div class="selDate">
                <span>选择日期</span>
                <div class="dateRight" @click.stop='selectDate'>
                    <img src="../../../assets/images/icon_rili.png" alt="">
                </div>
            </div>
            <h1>{{title}}</h1>
            <p class="tip">此问卷为各位住院医师日常考核所用，并存入住培学档案，请大家认真填写。</p>
            <div v-for='(item,index) in list' class="list">
                <h2>{{item.category}}</h2>
                <div v-for='(pro,key) in item.evaluationitems' class="problems">
                    <h3>{{key+1}}、{{pro.title}}</h3>
                    <ul>
                        <li v-for='v in pro.items'><input type="radio" class="radio" :name='index*10+key' :value='v.id' @click='check(v,index,key)'><span>{{v.name}}.{{v.content}}</span></li>
                    </ul>
                </div>
            </div>
            <div class="evaluate">
                <h4><span style="color: red;">*</span> 住院医师优点（必填）</h4>
                <textarea v-model='advantage'></textarea>
                <h4><span style="color: red;">*</span> 对进一步成长的建议（必填）</h4>
                <textarea v-model='advise' @focus='textareaFocus' @blur='textareaBlur'></textarea>
                <h4>关于此次评估我已经给予该住院医师反馈</h4>
                <div class="footer">
                    <label><input type="radio" class="radio" value='0' v-model='feedback'>是</label>
                    <label><input type="radio" class="radio" value='1' v-model='feedback'>否</label>
                </div>
            </div>
            <no-content v-if='noContent'></no-content>
        </div>

    </div>
</template>
<script>
    import $ from 'jquery'
    import cHeader from '../../header'
    import methods from '../../../methods'
    import noContent from '../../no_content'
    import {
        mapState,
        mapActions
    } from 'vuex'
    export default {
        name: 'rd_teacher_evaluate',
        components: {
            cHeader,
            noContent
        },
        data() {
            return {
                title: '武汉大学中南医院住院医师规范化培训评价表',
                evaluationList: [],
                list: [],
                month: '',
                items: [],
                checklist: [],
                advantage: '',
                advise: '',
                feedback: 0,
                showDate: false,
                date: [],
                noContent: false

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
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            init() {
                let self = this
                self.post('/turn/queryevaluationitems', {
                    command: 'turn/queryevaluationitems',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    evaluatedid: self.$route.query.id,
                    type: 4
                }).done(function (data) {
                    self.evaluationList = data.evaluationList
                    // console.log(self.evaluationList)
                    let arr = []
                    let list = []
                    for (let i = 0; i < self.evaluationList.length; i++) {
                        arr.push(self.evaluationList[i].category)
                    }
                    for (let i = 0; i < self.unique(arr).length; i++) {
                        list.push({
                            'category': self.unique(arr)[i],
                             evaluationitems: []
                        })
                    }
                    for (let s in self.unique(arr)) {
                        for (let i = 0; i < self.evaluationList.length; i++) {
                            if (self.unique(arr)[s] == self.evaluationList[i].category) {
                                list[s].evaluationitems.push({
                                    'title': self.evaluationList[i].title,
                                    'id': self.evaluationList[i].id,
                                    'items': self.evaluationList[i].evaluationitems
                                })
                            }
                        }
                    }
                    // console.log(list)
                    self.list = list
                    console.log(self.list)
                }).fail(function (error) {
                    self.noContent = true
                })
            },
            // 点击单选按钮的时候
            check(item, index, key) {
                let self = this
                self.list[index].evaluationitems[key].items.map(function (item, index, arr) {
                    if (item.checked) {
                        delete item.checked
                    }
                })
                if (typeof item.checked == 'undefined') {
                    self.$set(item, 'checked', true)
                }
            },
            // 点击提交按钮
            submit() {
                let self = this
                // self.month = '2016.1.1'
                self.checklist = []
                self.list.map(function (item, index, arr) {
                    item.evaluationitems.map(function (item1, index1, arr1) {
                        item1.items.map(function (item2, index2, arr2) {
                            if (item2.checked) {
                                self.checklist.push({
                                    id: item2.id,
                                    score: ''
                                })
                            }
                        })
                    })
                })
                if (self.checklist.length < self.evaluationList.length) {
                    self.toast('还有' + (self.evaluationList.length - self.checklist.length) + '道题没评')
                } else if (self.advantage == '') {
                    self.toast('请填写住院医师的优点')
                } else if (self.advise == '') {
                    self.toast('请填写您的建议')
                } else if (self.month == '') {
                    self.toast('请选择日期')
                } else {
                    self.post('/turn/submitevaluationitems', {
                        command: 'turn/submitevaluationitems',
                        sessionid: $.cookie('sid'),
                        loginid: $.cookie('uid'),
                        uid: $.cookie('uid'),
                        evaluatedid: self.$route.query.id,
                        type: 4,
                        feedback: self.feedback,
                        advantage: self.advantage,
                        advise: self.advise,
                        month: self.month,
                        items: self.checklist
                    }).done(function (data) {
                        if (data.errcode == '0') {
                            self.$router.push({
                                name: "fdRotation_teacher_date",
                                query: {
                                    id:self.$route.query.id,
                                    date:self.$route.query.date
                                }
                            })
                        } else {
                            self.toast(data.errdesc)
                        }
                    }).fail(function (error) {
                        self.noContent = true
                    })
                }
            },
            textareaFocus(){
                // alert('aaaa')
                $('.g-main').css("padding-bottom",'5rem')
            },
            textareaBlur(){
                $('.g-main').css("padding-bottom",'0')
            },
            // 返回按钮
            back() {
                let self = this
                self.showConfirm({
                    title: '提醒',
                    msg: '你当前评价尚未提交保存，是否确认返回？',
                    theme: 'modal-confirm modal-white',
                    ok: function () {
                        window.history.back()
                    },
                    cancel: function () {

                    }
                })
            },
            // 点击选择日期
            selectDate: function () {
                let self = this
                self.date = []
                self.showDate = !self.showDate
                let year = new Date().getFullYear()
                let month = new Date().getMonth() + 1

                // self.$route.query.date = '2017-1-20'
                let beginYear = new Date(self.$route.query.date).getFullYear()
                let beginMonth = new Date(self.$route.query.date).getMonth() + 1
                // console.log(beginYear)
                // console.log(beginMonth)
                if ((beginYear == year && beginMonth >= month) || beginYear > year) {
                    self.date.push(year + '年' + self.checkDate(month) + '月')
                } else if (beginYear == year && beginMonth < month) {
                    for (let i = 0; i < month - beginMonth + 1; i++) {
                        self.date.push(year + '年' + self.checkDate(month - i) + '月')
                    }
                }else if(beginYear == (year - 1)){
                    for(let i = 0;i<month;i++){
                        self.date.push(year + '年' + self.checkDate(month - i) + '月')
                    }
                    for(let i = 0;i<12-beginMonth+1;i++){
                        self.date.push(beginYear+'年'+self.checkDate(12-i) + '月')
                    }
                }else if(beginYear < (year - 1)){
                    for(let i = 0;i<month;i++){
                        self.date.push(year + '年' + self.checkDate(month - i) + '月')
                    }
                    for(let i = 1;i<year-beginYear;i++){
                        for(let j = 0;j<12;j++){
                            self.date.push((year- i)+'年'+self.checkDate(12-j) + '月')
                        }
                    }
                    for(let i = 0;i<12-beginMonth+1;i++){
                        self.date.push(beginYear+'年'+self.checkDate(12-i) + '月')
                    }
                }
                // console.log(self.date)
            },
            // 选择列表中的日期
            selectTime(item){
                // alert(item)
                // alert(item+'.1')
                let self = this
                self.month = item.replace('年','-').replace('月','-')+'01'
                // alert(self.month)
                $($('.selDate').find('span')[0]).text(item)
            },
            close: function () {
                this.showDate = false
            },
            // 在月份小于10的情况下，前面加上0
            checkDate: function (date) {
                if (date < 10) {
                    return '0' + date
                } else {
                    return date
                }
            },
            // 去重
            unique: function (arr) {
                let res = [];
                let json = {};
                for (var i = 0; i < arr.length; i++) {
                    if (!json[arr[i]]) {
                        res.push(arr[i]);
                        json[arr[i]] = 1;
                    }
                }
                return res;
            },
        }
    }

</script>
<style scoped>
    .g-main{
        font-size: 0.22rem;
        background: #f8f7f9!important;
        color: rgb(100,100,100);
    }
    h1,
    h2,
    h3,
    h4 {
        font-weight: normal;
        font-size: 0.24rem;
    }

    .selDate {
        width: 100%;
        /*height: 1rem;*/
        background: white;
        margin-top: 0.2rem;
        font-size: 0.26rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.1rem 0.2rem;
        position: relative;
    }
    .dateRight img {
        width: 0.4rem;
        height: 0.4rem;
    }

    .datelist {
       position: fixed;
       width: 100vw;
       height: 100vh;
       background: rgba(0,0,0,0.2);
       z-index:1000;
    }
    .triangle{
        width: 0;
        height: 0;
        border:solid 0.15rem white;
        /*background: white;*/
        border-color:transparent transparent white transparent;
        position: absolute;
        right:0.36rem;
        top: 1.7rem;
    }
    .dateUl ul{
        position: absolute;
        width: 2.4rem;
        /*height: 1.8rem;*/
        background: white;
        top: 1.98rem;
        right: 0.2rem;
        border-radius: 0.1rem;
        padding: 0 0.2rem;
        overflow-x: hidden;
        overflow-y: auto;
    }
    /*.datelist ul{
        height: 2rem;
        overflow-x: hidden;
        overflow-y: scroll;
    }*/
    .datelist ul li{
        border-bottom: solid 0.01rem #c3c3c3;
        text-align: center;
        height: 0.6rem;
        line-height: 0.6rem;
        padding: 0;
    }
    .datelist ul li:nth-last-of-type(1){
        border-bottom: none;
    }
    .firstUl{
        height: 0.6rem;
    }
    .secondUl{
        height: 1.2rem;
    }
    .thirdUl{
        height: 1.8rem;
    }
     ::-webkit-scrollbar {
        display: none;
    }
    h1 {
        text-align: center;
        /*height: 1rem;*/
        /*line-height: 1rem;*/
        background: white;
        margin-top: 0.2rem;
        padding: 0.1rem 0;
    }

    .tip {
        background: rgb(245, 227, 199);
        /*height: 1rem;*/
        padding: 0.1rem 0.2rem;
    }

    h2 {
        border-bottom: solid 1px #c3c3c3;
        padding: 0.1rem 0;
    }

    .list {
        margin-top: 0.2rem;
        background: white;
        padding: 0 0.3rem;
    }

    .problems {
        padding: 0.1rem 0 0.1rem;
        border-bottom: solid 0.01rem #c3c3c3;
    }

    .problems:nth-last-of-type(1) {
        border: none;
    }

    .problems ul {
        padding-left: 0.3rem;
    }

    ul li input {
        margin-right: 0.1rem;
        float: left;
    }
    ul li {
        padding: 0.05rem 0;
    }

    ul li span {
        width: 92%;
    }

    .evaluate {
        background: white;
        padding: 0 0.3rem;
    }

    h4 {
        width: 100%;
        padding: 0.2rem 0;
        background: white;
    }

    textarea {
        width: 100%;
        height: 2rem;
        padding: .2rem;
        box-sizing: border-box;
        background: rgb(242, 242, 242);
    }

    .footer {
        /*text-align: center;*/
        background: white;
        border: none;
        padding-top: 0;
    }

    .footer label {
        width: 2rem;
    }

    .footer label input {
        position: relative;
        top: 0.05rem;
        right: 0.1rem;
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
    }

    .radio:checked {
        background-image: url('../../../assets/images/gouxuan_on.png');
        background-size: cover;
    }

</style>
