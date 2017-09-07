<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            选择训练项
        </c-header>

        <div class="g-main">
            <div class="search_btn_con clearfix">
                <input type="" placeholder="请输入训练项名称" v-model.trim="search_info">
                <button @click="search_learn_info()"></button>
            </div>

            <div class="learninfo_con">
                <div v-for="item in learns" class="learninfo_box" @click="click_learninfo_box()">
                    <span>
                        {{item.name}}
                        <template v-if="item.type==0">
                            (在线)
                        </template>
                        <template v-else-if="item.type==1">
                            (模型)
                        </template>
                        <template v-else-if="item.type==2">
                            (智能)
                        </template>
                        <template v-else-if="item.type==3">
                            (出科训练)
                        </template>
                        <template v-else>
                            (其他)
                        </template>
                    </span>
                    <img v-if="item.learnid == checked_ids" src="../../assets/images/cheak1_on.png">
                    <img v-else src="../../assets/images/cheak1.png">
                    <input type="radio" class="learninfo_checkbox" :value="item.learnid" v-model="checked_ids">

                </div>
                <!-- <div class="learninfo_box" @click="click_learninfo_box()">
                    <span>胸腔穿刺</span> <input type="checkbox">
                </div> -->

            </div>

            <p class="selected_learninfo">
                已选择:
                {{selected.name}}
                <template v-if="selected.type==0">
                    (在线)
                </template>
                <template v-else-if="selected.type==1">
                    (模型)
                </template>
                <template v-else-if="selected.type==2">
                    (智能)
                </template>
                <template v-else-if="selected.type==3">
                    (出科训练)
                </template>
                <template v-else>
                    (其他)
                </template>
            </p>
        </div>



        <div class="padding">
            <a class="btn btn-blue btn-lg btn-block" @click="next_step()">下一步</a>
        </div>

    </div>
</template>

<script>
    import $ from 'jquery';
    import methods from '../../methods';
    import Vue from 'vue';
    import cHeader from '../header';
    import cModal from '../../components/modal';
    import { mapState, mapActions } from 'vuex';
    export default {
        data() {
            return {
                search_info:'',//绑定搜索框输入的训练项名称
                learns: [],
                learns_bak:[],//备份训练项数组
                checked_ids:'',
                paramvalue:'',//0:huaxi;1:xiehe
            }
        },
        components: {
            cHeader,
            cModal
        },
        created() {},
        mounted () {
            this.setTitle('选择训练项')
            let _this=this;
            this.registerToNative('goBack', function (data) {
                _this.back();
            });
            this.queryparamvalue();
        },
        computed:{
            selected: function () {
                var mylearnitem = '';
                var index = this.checked_ids;
                for (var y in this.learns){
                    if(index == this.learns[y].learnid){
                        mylearnitem = this.learns[y];
                        break;
                    }
                }

                return mylearnitem;
            }

        },
        watch: {
            search_info:function(){
                this.search_learn_info();
            }
        },
        methods: {
            ...mapActions([
                'showAlert',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            ...methods,
            queryparamvalue(){
            	let self = this;
                this.post('/commparaconf/querycommparaconflist', {
                    command: "commparaconf/querycommparaconflist",
                    paramcode:'person_booking'
                }).done(function (data) {
                    self.paramvalue=data.commparaconflist[0].paramvalue;
           			self.init(self.paramvalue);
                });
            },
            init(paramvalue) {
                let self = this;
				if (paramvalue==0) {
					// 训练项
	                this.post('/learn/querysatisfylearn', {
	                    command: "learn/querysatisfylearn",
	                    sessionid: $.cookie('sid'),
	                    loginid: $.cookie('uid'),
	                    stuid:  $.cookie('uid')
	                }).done(function (data) {
                        if(data.errcode==0){
                            self.learns = data.learnids;
                            self.learns_bak = data.learnids;
                        }else{
                            self.showAlert(data.errdesc)
                        }

	                });
				} else{
					// 训练项
	                this.post('/studentapply/querysatisfylearn', {
	                    command: "studentapply/querysatisfylearn",
	                    sessionid: $.cookie('sid'),
	                    loginid: $.cookie('uid'),
	                    stuid:  $.cookie('uid')
	                }).done(function (data) {
                        if(data.errcode==0){
                            self.learns = data.learnlist;
                            self.learns_bak = data.learnlist;
                        }else{
                            self.showAlert(data.errdesc)
                        }
	                })
				}

            },
            back(){
                this.$router.push({
                    name: 'fdpersonal',
                })
            },
            click_learninfo_box() {
                if( $(event.target).find('input').length == 0 ){
                    $(event.target).siblings('input').click();
                }else{
                    $(event.target).find('input').click();
                }
            },
            search_learn_info(){
                if( this.search_info == '' ){
                    this.learns = this.learns_bak.concat();
                }else{
                    this.learns = [];
                    for (var x in this.learns_bak){
                        var type_str = '智能';
                        if( this.learns_bak[x].type == 0 ){
                            type_str = '在线';
                        }else if( this.learns_bak[x].type == 1 ){
                            type_str = '模型';
                        }else if(this.learns_bak[x].type == 3){//2017.6.20修改bug xie
                            type_str = '出科训练';
                        }
                        var _str = this.learns_bak[x].name+'('+type_str+')';
                        if(_str.indexOf(this.search_info) >= 0){
                            this.learns.push(this.learns_bak[x]);
                        }
                    }
                }
            },
            next_step(){
                if( !this.checked_ids ){
                    this.showAlert({msg:"请选择训练项",ok:function(){return false;}});
                }
                var self=this;
                if (self.paramvalue==0) {
                	this.post('/learn/queryplacebylearnid', {
	                    command: "learn/queryplacebylearnid",
	                    sessionid: $.cookie('sid'),
	                    loginid: $.cookie('uid'),
	                    learnids:[{learnid:self.checked_ids}]
	                }).done(function (data) {
	                    if(data.errcode==0){
                            if(data.placelist.length == 0){
                                self.showAlert(
                                    "没有符合你要求的实验室，请重新选择训练项"
                                );
                            }else if ( data.placelist.length > 0 ){
                                self.$router.push({
                                    name:'fdselect_room',
                                    query:{
                                        learnid:self.checked_ids,
                                        name:self.selected.name,
                                        type:self.selected.type,
                                        paramvalue:self.paramvalue
                                    }
                                });
                            }
                        }else{
                            self.showAlert(data.errdesc)
                        }
	                });
                } else{
	                this.post('/studentapply/queryplacebylearnid', {
	                    command: "studentapply/queryplacebylearnid",
	                    sessionid: $.cookie('sid'),
	                    loginid: $.cookie('uid'),
	                    learnid:self.checked_ids,
	                }).done(function (data) {
	                    if(data.errcode==0){
                            if(data.placelist.length == 0){
                                self.showAlert(
                                    "没有符合你要求的实验室，请重新选择训练项"
                                );
                            }else if ( data.placelist.length > 0 ){
                                self.$router.push({
                                    name:'fdselect_room',
                                    query:{
                                        learnid:self.checked_ids,
                                        name:self.selected.name,
                                        type:self.selected.type,
                                        paramvalue:self.paramvalue
                                    }
                                });
                            }
                        }else{
                            self.showAlert(data.errdesc)
                        }
	                })
                }

            }

        }
    }

</script>
<style type="css/text" scoped>
    #scores .modal-body{
        height:500px;
    }
    .search_btn_con{
        width:90%; height:0.6rem; margin:0.333rem auto;
        background-color:#FFF; border-radius:.05rem;
    }
    .search_btn_con input{
        width:84%; height:100%; float:left; padding:0.1rem;
    }
    .search_btn_con button{
        width:15%; height:100%; background-image:url(../../assets/images/search.png);
        background-repeat:no-repeat; float:left;background-size:auto 60%; background-position:50%;
    }
    .learninfo_con{
        width:100%; height:6rem; padding:0.16rem 0; overflow-y:auto;
    }
    .learninfo_box{
        width:100%; height:0.9rem; line-height:0.9rem;
        border-bottom:1px solid #CCCCCC; background-color:#fff;
        padding-left:0.16rem; padding-right:0.16rem; position:relative;
    }
    .learninfo_box input{
        display:block; float:right; width:0.4rem; height:0.4rem;
        top:50%; position:absolute; margin-top:-0.2rem; right:0.16rem;
        opacity:0;
    }
    .learninfo_box img{
        display:block; width:0.4rem; height:0.4rem;
        top:50%; position:absolute; margin-top:-0.2rem; right:0.16rem;
    }
    .selected_learninfo{
        padding:0.16rem; background-color:#FFF; margin-top:0.2rem;
        height:1.5rem;
    }
</style>
