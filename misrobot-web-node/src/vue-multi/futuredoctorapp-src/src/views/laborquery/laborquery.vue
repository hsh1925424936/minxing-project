<template>
    <div class="booking-lab-sel g-wrapper" style="background-color: #f2f2f2">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            实验室查询
        </c-header>
        <div class="g-main">
            <div class="xiedropdownbox" v-for="(value,index) in floorslist">
                <div class="dropdowntitle" @click="togglelist(index)">
                    <span class="floortext">{{ value.floor }}F</span>
                    <b :class="{'xieup':index==0,xiedown:index!=0}"></b>
                </div>
                <ul class="xiedropdownlist" v-show="index==0">
                    <li v-for="(value2,index2) in floorslist[index].placesList" @click="tolabordetail(value2)">
                        {{ value2.placename }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery'
    import methods from '../../methods'
    import cHeader from '../header'
    import cModal from '../../components/modal'
    import { mapState, mapActions } from 'vuex'
    import xieFn from '../../vuex/xie'
    export default {
        data() {
            return {
                floorslist:[]
            }
        },
        components: {
            cHeader,
        },
        mounted () {
            var self = this
            this.registerToNative('goBack', function (data) {
                self.back()
            })
            self.getlabors()
        },
        updated(){
            this.setTitle('实验室查询')
        },
        methods: {
            ...methods,
            back:function(){
                window.location.href='/pages/futuredoctorapp/application.html'
            },
            togglelist:function(index){
                $('.xiedropdownbox:eq('+index+') ul').slideToggle()
                if( $('.xiedropdownbox:eq('+index+') b').hasClass('xiedown')){
                    $('.xiedropdownbox:eq('+index+') b').attr('class','xieup')
                }else{
                    $('.xiedropdownbox:eq('+index+') b').attr('class','xiedown')
                }
            },
            getlabors:function(){
                let self=this;
                this.post('/examapply/queryplacesbyadmin', {
                    command: 'examapply/queryplacesbyadmin',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    teacherid: $.cookie('uid')
                }).done(function (data) {
                    self.floorslist=data.floorslist
                });
            },
            tolabordetail:function(params){
                this.$router.push({
                    name: 'fdlabortimetable',
                    query: params
                })
            }
        }
    }
</script>
<style lang="scss">
    .xiedown{
        width:.26rem;
        height:.26rem;
        float:right;
        background-image:url('../../assets/images/xia-jiantou.png');
        background-size:.26rem .26rem;
        margin-top:.05rem;
    }
    .xieup{
        width:.26rem;
        height:.26rem;
        float:right;
        background-image:url('../../assets/images/shang-jiantou.png');
        background-size:.26rem .26rem;
        margin-top:.05rem;
    }
    .floortext{
        float:left;
        color:#3B95CD;
        font-size:.36rem;
    }
    .dropdowntitle{
        overflow:hidden;
        padding:.16rem .20rem;
    }
    .xiedropdownbox{
        margin-top:.16rem;
        background-color: white;
    }
    .xiedropdownlist>li{
        border-top:1px solid #E7E7E7;
        width:92%;
        margin:0 auto;
        padding:.18rem;
    }
</style>
