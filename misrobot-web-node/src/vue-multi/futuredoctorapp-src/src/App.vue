<template>
    <div class="g-wrapper">
        <router-view></router-view>
        <c-alert></c-alert>
        <c-confirm></c-confirm>
        <c-loading></c-loading>
        <c-toast></c-toast>
    </div>
</template>

<script>
    import store from './vuex/store';
    import $ from 'jquery';
    import './assets/js/utils/jquery.cookie';

    import cAlert from './components/alert';
    import cConfirm from './components/confirm';
    import cLoading from './components/loading';
    import cToast from './components/toast';
    import './assets/js/viewport';

    export default {
        store,
        mounted: function(){
            let self = this;

            $(document).ajaxComplete(function(evt, res, settings){

                let ret = res && res.responseJSON;

                if(ret && ret.code === 1111) {
                    self.$router.push({
                        name: 'login'
                    });
                }
            });
        },
        components: {
            cAlert,
            cConfirm,
            cLoading,
            cToast
        },
        methods: {

        }
    }
</script>

<style lang="scss">
    @import "./scss/index.scss";
    @import "./scss/manage.css";
</style>
