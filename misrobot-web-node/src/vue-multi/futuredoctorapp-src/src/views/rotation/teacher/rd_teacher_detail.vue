<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            {{date}}
        </c-header>
        <div class="g-main">
            <h1>{{title}}</h1>
            <div v-for='(item,index) in list' class="list">
                <h2>{{item.category}}</h2>
                <div v-for='(pro,key) in item.evaluationitems' class="problems">
                    <h3>{{key+1}}、{{pro.title}}</h3>
                    <ul>
                        <li v-for='v in pro.items'><input type="radio" class="radio" :name='index*10+key' :value='v.id' disabled><span>{{v.name}}、{{v.content}}</span></li>
                    </ul>
                </div>
            </div>
            <div class="evaluate" v-if='!noContent'>
                <h4><span style="color: red;">*</span>住院医师优点（必填）</h4>
                <textarea v-model='advantage' disabled="disabled"></textarea>
                <h4><span style="color: red;">*</span> 对进一步成长的建议（必填）</h4>
                <textarea v-model='advise' disabled="disabled"></textarea>
                <h4>关于此次评估我已经给予该住院医师反馈</h4>
                <div class="footer">
                    <label><input type="radio" class="radio" value='0' v-model='feedback' disabled>是</label>
                    <label><input type="radio" class="radio" value='1' v-model='feedback' disabled>否</label>
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
                date: '',
                advantage: '',
                advise: '',
                feedback: 0,
                itemid: [],
                noContent: false

            }
        },
        mounted() {
            let self = this
            self.date = self.$route.query.date
            self.init()
            self.registerToNative('goBack', function (data) {
                self.back();
            });
        },
        methods: {
            ...methods,
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
                            category: self.unique(arr)[i],
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
                    self.list = list
                    // console.log(self.list)
                    // 成功时调用，得到每一项的具体答案
                    self.detail()
                }).fail(function (error) {
                    self.noContent = true
                })
            },
            detail: function () {
                let self = this
                self.post('/turn/queryevaluateditems', {
                    command: 'turn/queryevaluateditems',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    id: self.$route.query.id
                }).done(function (data) {
                    // console.log($($('.radio')[7]).val())
                    self.advantage = data.advantage
                    self.advise = data.advise
                    self.feedback = data.feedback
                    self.itemid = data.detaillist

                    for (let i = 0; i < self.itemid.length; i++) {
                        for (let j = 0; j < $('.problems').find('input').length; j++) {
                            if ($($('.problems').find('input')[j]).val() == self.itemid[i].itemid) {
                                $('.problems').find('input')[j].checked = true
                            }
                        }
                    }
                }).fail(function (error) {

                })
            },
            back(){
                window.history.back()
            },
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

    h1 {
        text-align: center;
        /*height: 1rem;*/
        /*line-height: 1rem;*/
        background: white;
        margin-top: 0.2rem;
        padding: 0.2rem 0;
    }

    h2 {
        border-bottom: solid 1px rgb(240,240,240);
        padding: 0.1rem 0;
    }

    .list {
        margin-top: 0.2rem;
        background: white;
        padding: 0 0.3rem;
    }

    .problems {
        padding: 0.2rem 0 0.1rem;
        border-bottom: solid 0.01rem rgb(240,240,240);
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
        padding: 0.1rem 0;
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
