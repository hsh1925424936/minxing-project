<template>
    <div id="header" class="header">
        <slot name="headerLeft">
            <a @click="back()" class="header-back-btn"><img src="../assets/images/icon_fanhui.png"></a>
        </slot>
        <div class="header-center-blank"></div>
        <div class="header-center"><slot>{{title}}</slot></div>
        <slot name="headerRight"></slot>
    </div>
</template>

<script>

import $ from 'jquery';
import methods from '../methods';

import { mapState, mapActions } from 'vuex';

export default {
    props: ['title'],
    data() {
        return {}
    },
    created() {},
    mounted () {},
    computed: mapState([
        'loginUser'
    ]),
    methods: {
        ...mapActions([
            'showAlert',
            'showLoading',
            'hideLoading',
            'toast'
        ]),
        ...methods,
        back(){
            this.$router.go(-1);
        }
    }
}

</script>
<style>

</style>
