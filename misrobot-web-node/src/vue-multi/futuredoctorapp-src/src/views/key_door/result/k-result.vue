<template>
    <div class="succ">
        <c-header v-if="err">
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            一键开门
        </c-header>
        <c-header v-else="err">
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            一键开门
        </c-header>
        <div class="result">
            <i :class="{ networkA: istrue , networkB: isfalse}"></i>
            <p>{{message}}</p>
            <span>{{prompt}}</span>
        </div>
        <router-link :to="{name: 'fdkey_door'}" class="r-btn" v-show="btn">重&nbsp;&nbsp;试</router-link>
    </div>
</template>

<script>
    import $ from 'jquery';
    import cHeader from '../../header';
    import methods from '../../../methods';
    export default {
        data() {
            return {
                message:"操作成功",
                prompt:"",
                err:true,
                btn:false,
                id:"0",
                door_n:"",
                door_u:"",
                istrue:true,
                isfalse:false
            }
        },
        components: {
            cHeader
        },
        created() {
           //获取路由传过来的参数
            this.id=this.$route.query.succ_id;//如果成功的话
            if(this.id==0){
                this.door_n=this.$route.query.door_name.slice(0,3);
                this.door_u=this.$route.query.door_name;
                this.prompt="已为您打开"+this.door_n+"教室"+this.door_u+"门";
            }
        },
        mounted () {
            let _this = this;
            this.init();
            this.registerToNative('goBack', function (data) {
               _this.back();
            });
        },
        methods: {
            ...methods,
            back(){
                if (this.err){//如果成功的话
                    window.location.href='/pages/futuredoctorapp/application.html'
                }else{
                    this.$router.push({//如果失败返回首页
                        name: 'fdkey_door'
                    })
                }
            },
            init(){
                if (this.id==="0"){//成功
                    this.btn=false;
                    $(".result>i").css("background-position","0 -3.2rem");
                }else if(this.id==="1"){//失败
                    this.btn=true;//显示按钮
                    this.err=false;
                    this.message="操作失败";
                    this.prompt="当前操作人太多，请稍后重试";
                    $(".result>i").css("background-position","0 0");
                }else if(this.id==="2"){//网络问题
                    this.btn=true;//显示按钮
                    this.err=false;
                    this.istrue="false";
                    this.isfalse="true";
                    this.message="网络不大给力";
                    this.prompt="查看网络连接后，点击重试";
                }
            }
        }
    }

</script>
<style lang="scss">
    @import "../../../scss/result.css";
    .succ {
        text-align: center;
    }
    .r-btn {
        display: inline-block;
        width:5.2rem;
        height:1rem;
        background: #3499db;
        text-align: center;
        line-height: 1rem;
        color: #fff;
        font-size: 0.36rem;
        border-radius: 0.1rem;
        margin-top: 2.42rem;
    }
    i.networkA {
        width:1.6rem;
        height:1.6rem;
        background:url("../../../assets/images/icon_kaimen.png") no-repeat;
        background-position: 0 -1.6rem;
        background-size: cover;
    }
    i.networkB {
        width:2.98rem;
        height:1.9rem;
        background:url("../../../assets/images/icon_wufalianjie.png") no-repeat;
        background-size: cover;
    }
</style>
