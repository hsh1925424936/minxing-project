<template>
    <div>
        <div class="test">
            <ul v-for="item in items" class="iswait" @click="doing(item)">
                <li><span>考试科目：</span>{{item.learnname}}</li>
                <li><span>考官姓名：</span>{{item.teachername}}</li>
                <li><span>考生姓名：</span><i v-for="val in item.stunames">{{val.name}}&nbsp;&nbsp;</i></li>
                <li><span>考试时间：</span>{{item.starttime | substr(0, 16)}}-{{item.endtime | substr(11, 5)}}</li>
                <li v-if="item.placeid==-1"><span>考试场地：</span>{{item.placeinfo}}</li>
                <li v-else><span>考试场地：</span>{{item.displayname}}</li>
            </ul>
        </div>
        <no-content v-show="items.length==0"></no-content>
    </div>
</template>
<script>
    import Vue from 'vue';
    import $ from 'jquery';
    import methods from '../../../methods';
    import cModal from '../../../components/modal';
    import noContent from '../../no_content.vue';
    let bus = new Vue();
    export default {
        props: ['active'],
        data() {
            return {
                place:'',
                items:[]
            }
        },
        components: {
            noContent
        },
        created() {

        },
        mounted () {
            this.init();
        },
        watch: {
            'active': function(val, oldVal){

                if(val) {
                    // 刷新
                    this.init();
                }
            }
        },
        methods:{
            ...methods,
            init(){
                let _this=this;
                this.post('/ckevaluation/queryevaluationlist', {
                    command: 'ckevaluation/queryevaluationlist',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    content:2
                }).done(function (data) {
                    _this.items=data.evaluations;
                });
            },
            doing(prama){
                let _this=this;
                this.post('/ckevaluation/queryevaluationinfo', {
                    command: 'ckevaluation/queryevaluationinfo',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    paraentscore:0
                }).done(function (data) {
                    if(data.evaluations[0].type==2){
                        _this.$router.push({
                            name:'fdgrade',query:{examinfo:prama}
                        });
                    }else {
                        _this.$router.push({
                            name:'fdgrade2',query:{examinfo:prama}
                        });
                    }
                });
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../../scss/studentTest.css";
    .test>ul {
        position: relative;
    }
    .test>ul.iswait:after {
        position: absolute;
        top:0;
        right:0;
        display: inline-block;
        content: '';
        width:1.1rem;
        height:1.1rem;
        background: url("../../../assets/images/tips_dpj.png") 0 0 no-repeat;
        background-size: 1.1rem 1.1rem;
    }
</style>

