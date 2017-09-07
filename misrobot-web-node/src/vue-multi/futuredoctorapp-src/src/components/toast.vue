<template>
    <div class="toast-wrap" :style="{zIndex: maxZIndex}" transition="fade" v-show="toast.show">
        <div class="toast-center" v-html="toast.msg"></div>
    </div>
</template>
<style>
.toast-wrap {
    background-color:none !important;
    position: fixed;
    top: 0;
    left: 0;
    right:0;
    bottom:0;
    background: rgba(0, 0, 0, 0.4);
}
.toast-wrap .toast-center{
    position: absolute;
    text-align: center;
    top: 50%;
    left: 50%;
    margin-left: auto;
    margin-right: auto;
    display: inline-block;
    background: #fff;
    font-size: .22rem;
    padding: .16rem .3rem;
    /*border: 2px solid #333;*/
    transform: translate3d(-50%,-50%,0);
    opacity:.8;
    border-radius: .5rem;
}
</style>
<script>

import { mapState, mapActions } from 'vuex';

export default {
    watch: {
        'toast.show': function(val, oldVal) {
            let self = this;
            if(val === true) {
                setTimeout(() => {
                    this.hideToast();
                }, this.toast.timeout);
            }
        }
    },
    computed: mapState([
        'toast',
        'maxZIndex'
    ]),
    methods: {
        ...mapActions([
            'hideToast'
        ])
    }
}
</script>
