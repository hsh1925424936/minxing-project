<template>
    <div class="booking-lab-sel g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            班级预约
            <div slot="headerRight">
                <router-link :to="{name: 'fdMy'}"
                             class="my-booking-btn">我的预约</router-link>
            </div>
        </c-header>
        <div class="list lab-list g-main">
            <template v-for="it in placelist">
                <a class="item valign-center" @click="selLab(it)">
                    <i class="iconfont icon-clock"></i>
                    <div class="auto-width">
                        <h3 class="name">{{it.pname}}</h3>
                        <p class="addr">{{it.displayname}}</p>
                    </div>
                    <a><img class="go-arrow-btn" src="../../../assets/images/icon_xiangyou.png" /></a>
                </a>
            </template>
        </div>
    </div>
</template>

<script>

import $ from 'jquery';
import methods from '../../../methods';
import cHeader from '../../header';
import xieFn from '../../../vuex/xie';
import { mapState, mapActions } from 'vuex';

export default {
    data() {
        return {
            placelist: [],
            loading: 0,
            page: 1
        }
    },
    components: {
        cHeader
    },
    mounted () {
        let self = this;
        this.post('/learn/queryallplaces', {
            command: "learn/queryallplaces",
            sessionid: $.cookie('sid'),
            loginid: $.cookie('uid')
        }).done(function(data){
            self.placelist = data && data.placelist || [];
            self.loading = 1;
        }).fail(function () {
            self.loading = 2;
        });
        this.registerToNative('goBack', function (data) {
            self.back();
        });
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
            window.location.href='/pages/futuredoctorapp/application.html';
        },
        selLab(lab){
            xieFn.setCookie('selLabPlaceId',lab.placeid)
            xieFn.setCookie('selLabPlaceName',lab.pname)
            xieFn.setCookie('selLabPlaceAddress',lab.displayname)
            xieFn.setCookie('selLabAdminId',lab.admin)
            xieFn.setCookie('selLabAdminName',lab.uname)
            xieFn.setCookie('selLabAdminMobile',lab.mobile)
            xieFn.setCookie('selLabVolume',lab.volume)
            this.$router.push({
                name: 'fdCreateSelLabTable',
                query: lab
            });
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

                .go-arrow-btn{
                    width: .12rem;
                }
            }
        }
    }
    .my-booking-btn{
        font-size: $font-size-md;
        color: #FFF;
    }

</style>
