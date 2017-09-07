<template>
    <div class="loading_con" :style="{zIndex: maxZIndex}" v-show="loading.show">
        <div class="all_center loading_center">
            <div class="all_center">
                <template v-if="loading.html">
                    <div v-html="loading.html"></div>
                </template>
                <template v-else>
                    <i class="fa fa-refresh"></i>
                    <span>{{loading.msg}}</span>
                </template>
            </div>
        </div>
    </div>
</template>
<style>
.loading_con {position: fixed;top: 0;left: 0;width: 100%;height:100%;background: rgba(0, 0, 0, 0.4);z-index: 9999999;}
.loading_con .loading_center{
    position: absolute;
    text-align: center;
    top: 50%;
    left: 50%;
    margin-left: -100px;
    margin-top: -20px;
    margin-left: auto;
    margin-right: auto;
    display: inline-block;
    border-radius: 20px;
    background: #fff;
    padding: 5px 10px;
    /*opacity: .8;*/
}
.loading_con .loading_center>div img{display: block;margin: 0 auto;-webkit-animation:loading linear both 1s infinite;}
.loading_con .loading_center>div i.fa{
    width:30px;
    height:30px;
    text-align: center;
    line-height: 30px;
    margin: 0 auto;
    animation:loading linear both 1s infinite;
    -webkit-animation:loading linear both 1s infinite;
}
.loading_con .loading_center>div span{margin: 15px auto 0;text-align: center;font-size: 16px;}

@keyframes loading {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes loading {
    from {
        -webkit-transform: rotate(0deg);
    }
    to {
        -webkit-transform: rotate(360deg);
    }
}
</style>
<script>

import { mapState, mapActions } from 'vuex';
import $ from 'jquery';

export default {
    watch : {
        'loading.show' : function(val, old){
            if(val === true) {
                let $t = $(this.$el).find('.loading_center');
                this.$nextTick(function(){
                    $t.css('marginLeft', -1 * $t.width() / 2);
                });
            }
        },
        loading: {
            handler: function(val, oldVal) {},
            deep: true
        }
    },
    computed: mapState([
        'loading',
        'maxZIndex'
    ]),
    methods: {

    }
}
</script>
