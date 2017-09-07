<template>
    <div class="booking-lab-sel g-wrapper">
        <c-header>
            <div slot="headerLeft" v-show="false">
                <a class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            课程报名
            <div slot="headerRight">
                <router-link :to="{name: 'fdtraining_signedlist'}"
                             class="my-booking-btn">报名记录</router-link>
            </div>
        </c-header>
        <div class="list lab-list g-main" style="margin-top:.14rem">
            <template v-for="it in placelist">
                <a class="item valign-center" @click="selLab(it)">
                    <i class="iconfont icon-clock"></i>
                    <div class="auto-width">
                        <h3 class="name">{{ it.trainname }}</h3>
                        <p class="addr">{{ it.traincomment }}</p>
                    </div>
                    <a>
                        <!--<span class="xiemoney">￥{{ it.trainprice }}</span>-->
                        <img class="go-arrow-btn" src="../../assets/images/icon_xiangyou.png" />
                    </a>
                </a>
            </template>
        </div>
        <no-content v-show="placelist.length==0" :txtdescription="txtdescription"></no-content>
    </div>
</template>

<script>

    import $ from 'jquery';
    import methods from '../../methods';
    import cHeader from '../header';
    import xieFn from '../../vuex/xie';
    import { mapState, mapActions } from 'vuex';
    import noContent from '../no_content'
    export default {
        data() {
            return {
                placelist: [],
                txtdescription:'当前没有可报名的课程~'
            }
        },
        components: {
            cHeader,
            noContent
        },
        mounted () {
            this.setTitle('课程报名')
            let self = this
            this.post('/externaltrain/queryexternaltrainlist', {
                command: "externaltrain/queryexternaltrainlist",
                sessionid: $.cookie('sid'),
                loginid: $.cookie('uid')
            }).done(function(data){
                if(data.errcode==0){
                    self.placelist = data.trainlist
                }else{
                    self.toast(data.errdesc)
                }
            }).fail(function () {
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
    selLab(obj){
        xieFn.setCookie('training_sign_planid',obj.id)
        this.$router.push({
            name: 'fdtraining_coursedetail',
            query: obj
        });
    }
    }
    }
</script>
<style lang="scss">

    @import "../../scss/variables.scss";

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
    .xiemoney{
        color:#39A3D3;
        position:relative;
        left:-.1rem;
        top:-.06rem;
    }
    .xieheader{
        background-color: #3499DB;
        color:white;
        font-size:.36rem;
        text-align: center;
        height:.76rem;
        line-height: .76rem;
    }
</style>
