<template>
    <div>
        <div class="test">
            <ul v-for="item in items">
                <li><span>技能项：</span>{{item.name}}</li>
                <li><span>考试地点：</span>{{item.placeinfo}}</li>
                <li><span>考试时间：</span>{{item.starttime | substr(0, 16)}}-{{item.endtime | substr(11, 5)}}</li>
                <li><span>考试成绩：</span>{{item.score}}</li>
                <li class="detail"><a @click="showDetails(item.examid)">成绩详情</a></li>
            </ul>
        </div>
        <c-modal :config="labInfoModal" class="examDetails">
            <div>
                <ul class="report">
                    <li><span>考生：</span>{{studentname}}</li>
                    <li><span>技能项：</span>{{skillname}}</li>
                    <li><span>得分：</span>{{getscore | num}}</li>
                </ul>
                <div v-if="seen">
                    <p>错误项</p>
                    <table border="1" class="points">
                        <tr>
                            <th>操作类别</th>
                            <th>错误项</th>
                        </tr>
                        <tr v-for="val in itempoints">
                            <td>{{val.point}}</td>
                            <td>{{val.deficiency}}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </c-modal>
        <no-content v-show="items.length==0"></no-content>
    </div>
</template>
<script>
    import Vue from 'vue';
    import $ from 'jquery';
    import methods from '../../../methods';
    import xiefn from '../../../vuex/xie';
    import cModal from '../../../components/modal';
    import { mapState, mapActions } from 'vuex';
    import noContent from '../../no_content.vue';
    let bus = new Vue();
    export default {
        props: ['active'],
        data() {
            return {
                items:[],
                labInfoModal: {
                    show: false,
                    title: '成绩详情'
                },
                skillname:'',
                studentname:'',
                getscore:'',
                itempoints:'',
                seen:true
            }
        },
        components: {
            cModal,
            noContent
        },
        created() {

        },
        mounted () {
            this.query();
            let _this=this;
            this.registerToNative('goBack', function (data) {
                if(_this.labInfoModal.show){
                    _this.labInfoModal.show=false
                }else{
                    window.location.href='/pages/futuredoctorapp/application.html'
                }
            });
        },
        watch: {
            'active': function(val, oldVal){
                if(val) {
                    // 刷新
                    this.query();
                }
            }
        },
        filters: {
            num: function (value) {
                if (value) {
                    return Number(value).toFixed(1)
                }
                return value
            }
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
            query(){
                let _this=this;
                this.post('/ckexamapply/ckexamlist', {
                    command: 'ckexamapply/ckexamlist',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    uid: $.cookie('uid'),
                    status:4
                }).done(function (data) {
                    _this.items=JSON.parse(data.ckexamlist);
                });
            },
            showDetails(param){
                let _this=this;
                this.post('/report/querystudentckreport', {
                    command: 'report/querystudentckreport',
                    examid:param.toString(),
                    studentid:$.cookie('uid'),
                    scoretype:"1"
                }).done(function (data) {
                    _this.skillname=data.skillname;
                    _this.studentname=data.studentname;
                    _this.getscore=data.getscore;
                    _this.itempoints=data.itempoints;
                    if (data.itempoints==''){
                        _this.seen=false;
                    }
                    _this.labInfoModal.show = true;
                });
            }
        }
    }
</script>
<style lang="scss">
    @import "../../../scss/studentTest.css";
    .report {
        margin-bottom: 0.1rem;
        border-bottom: 1px solid #000;
        li {
            line-height: 0.5rem;
            span {
                width: 1.2rem;
            }
        }
    }
    .points {
        width:100%;
        :first-child {
            width:30%;
        }
        tr {
            text-align: center;
            height:0.5rem;
        }
    }
    .examDetails .modal-body {
        padding:0.2rem;
    }
</style>

