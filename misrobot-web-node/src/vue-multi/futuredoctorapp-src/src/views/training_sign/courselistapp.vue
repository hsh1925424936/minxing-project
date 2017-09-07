<template>
    <div class="booking-lab-sel g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
        课程报名
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
            let self = this;
            this.post('/externaltrain/queryexternaltrainlist', {
                command: "externaltrain/queryexternaltrainlist",
                sessionid: $.cookie('sid'),
                loginid: $.cookie('uid')
            }).done(function(data){
                if(data.errcode==0){
                    self.placelist = data.trainlist;
                }else{
                    self.toast(data.errdesc)
                }
            }).fail(function () {
                self.toast('连接服务失败，请稍后再试')
            })
            this.registerToNative('goBack', function (data) {
                self.back()
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
            name: 'fdtraining_coursedetailapp',
            query: obj
        });
    },
    back(){
        window.location.href="/pages/futuredoctorapp/application.html"
    }
    }
    }
</script>
<style lang="scss">
    @import "../../scss/variables.scss";
</style>

