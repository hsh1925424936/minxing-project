<template>
    <div class="booking-lab-sel g-wrapper">
        <input type="text" placeholder="用户名" v-model="name" class="form-control">
        <input type="text" placeholder="密码" v-model="pwd" class="form-control">
        <button @click="login()" class="btn btn-block">登录</button>
    </div>
</template>

<script>

import $ from 'jquery';
import methods from '../methods';

import { mapState, mapActions } from 'vuex';

export default {
    data() {
        return {
            name:'',
            pwd:''
        }
    },
    components: {

    },
    created() {},
    mounted () {},
    methods: {
        ...mapActions([
            'showAlert',
            'showConfirm',
            'showLoading',
            'hideLoading',
            'toast'
        ]),
        ...methods,
        login:function(){

            let self = this;

            this.post('/usr/login', {
                command: 'usr/login',
                accountname: self.name,
                password: self.pwd,
                type: 100
            })
            .done(function(data, status, jqXhr){

                if(data && data.errcode == 0) {
                    $.cookie("uid",data.userid);
                    $.cookie("sid",data.sessionid);
                    $.cookie("name",data.name);

                    self.$router.push({
                        name: 'fdCreate'
                    });

                    self.showAlert('登录成功！');
                } else {
                    self.showAlert('登录失败！');
                }
            })
            .fail(function(jqXhr, status, e){
                self.showAlert('登录失败！');
            });
        }
    }
}

</script>
<style lang="scss">

</style>
