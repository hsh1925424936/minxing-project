<template>
    <div>
        <div class="test">
            <ul v-for="item in items">
                <li><span>技能项：</span>{{item.name}}</li>
                <li><span>考试时间：</span>{{item.starttime | substr(0, 16)}}-{{item.endtime | substr(11, 5)}}</li>
                <li><span>考试地点：</span>{{item.placeinfo}}</li>
                <li><span>取消原因：</span>{{item.comment}}</li>
            </ul>
        </div>
        <no-content v-show="items.length==0"></no-content>
    </div>
</template>
<script>
    import Vue from 'vue';
    import $ from 'jquery';
    import methods from '../../../methods';
    import xiefn from '../../../vuex/xie';
    import cModal from '../../../components/modal';
    import noContent from '../../no_content.vue';
    let bus = new Vue();
    export default {
        props: ['active'],
        data() {
            return {
                items:[]
            }
        },
        components: {
            noContent
        },
        created() {

        },
        mounted () {
            this.query();
        },
        watch: {
            'active': function(val, oldVal){

                if(val) {
                    // 刷新
                    this.query();
                }
            }
        },
        methods:{
            ...methods,
            query(){
                let _this=this;
                this.post('/ckexamapply/ckexamlist', {
                    command: 'ckexamapply/ckexamlist',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    uid: $.cookie('uid'),
                    status:3
                }).done(function (data) {
                    _this.items=JSON.parse(data.ckexamlist);
                });
            }
        }
    }
</script>
<style lang="scss">
    @import "../../../scss/studentTest.css";
</style>

