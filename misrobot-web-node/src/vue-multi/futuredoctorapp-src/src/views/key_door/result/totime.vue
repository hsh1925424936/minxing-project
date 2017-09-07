<template>
    <div>
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            一键开门
        </c-header>
        <div class="result">
            <i></i>
            <p>你当前无法使用</p>
            <span>只有在上课/预约时间及课前{{time}}分钟才能使用“一键开门”功能，请核对您的课程表信息</span>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery';
    import cHeader from '../../header';
    import methods from '../../../methods';
    export default {
        data() {
            return {
                time:''
            }
        },
        components: {
            cHeader
        },
        created() {
            this.time=this.$route.query.advancetime;
        },
        mounted () {
            let _this = this;
            this.registerToNative('goBack', function (data) {
                _this.back();
            });
        },
        methods: {
            ...methods,
            back(){//返回应用页
                window.location.href='/pages/futuredoctorapp/application.html'
            }
        }
    }

</script>
<style lang="scss">
    @import "../../../scss/result.css";
    .result>i {
        width:1.6rem;
        height:1.6rem;
        background:url("../../../assets/images/icon_kaimen.png") no-repeat;
        background-position: 0 -1.6rem;
        background-size: cover;
    }
</style>
