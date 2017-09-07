<template>
    <div class="g-wrapper">
        <!--<div class="nav" style="background:rgb(52,153,219);text-align:center;color: white;">
			{{name}}
        </div>-->
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
			</div>
			<div style="width:80%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">
				{{name}}
			</div>
            
        </c-header>
        <div class="main">
            <img src="../../assets/images/submit_sucess.png" alt="">
            <p>
                <img src="../../assets/images/icon_gou.png" alt="">
                <span>提交成功，感谢您的参与！</span>
            </p>
        </div>
        <div class="footer">
            <img src="../../assets/images/qrcode.png" alt="">
        </div>
    </div>
</template>
<script>
    import cHeader from '../header'
    export default {
        name:'submit',
        components:{
            cHeader,
        },
        data(){
            return{
                name:''
            }
        },
        mounted(){
            this.name = this.$route.query.name
        },
        methods:{
            back(){
                location.href = '/pages/futuredoctorapp/todo.html'
            }
        }
    }
</script>
<style scoped>
    .g-wrapper{
        overflow: hidden;
    }
	/*.nav{
		height: 0.88rem;
		line-height: 0.88rem;
		font-size: 0.3rem;
	}*/
    .main{
        display: flex;
        flex-direction: column;
        align-items: center;
        /*margin-top:20px;*/
        height: 62.8vh;
        justify-content: center;
        font-size: 0.28rem;
        background: rgb(255,255,255)!important;
		color: rgb(100,100,100);
    }
    .main>img{
        width: 4rem;
        height: 2rem;
        margin-bottom: 0.5rem;
    }
    .main p{
        display: flex;
        /*justify-content: */
        align-items: center;
    }
    .main p img{
        width: 0.35rem;
        height: 0.35rem;
        margin-right: 0.1rem;
    }
    .footer{
        width: 100vw;
        height: 4.5rem;
        /*background-image: url('../../assets/images/qrcode.png');*/
        /*background-size: 100% 100%;*/
        border-top: none;
        padding:0;
    }
    .footer img{
        width: 100%;
        height: 100%;
    }
</style>