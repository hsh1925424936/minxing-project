<template>
    <div class="root">
        <div class="nav flex">
            <div class="navLeft">
                <span>建智慧医教 为明日良医</span>
            </div>
            <div class="navRight flex">
                <img src="../assets/images/user.png" alt="">
                <span>{{userName}}</span>
                <el-button type="primary" @click="logout" style='border-color: white;background:rgb(0,160,233);'>退出</el-button>
            </div>
        </div>
        <div class="main flex">
            <div class="mainLeft flex-column">
                <img src="../assets/images/logo.png" alt="">
                <ul>
                    <li :class="{active:i==index}" v-if="from==item.form" v-for="(item,index) in menus" @click="linkto(index)">{{item.name}}</li>
                </ul>
            </div>
            <div class="mainRight">
                <template v-if="from == 'medicine' ">
                    <identify-medicine v-if="index == 0"></identify-medicine>
                </template>
                <template v-if="from == 'pharmacy' ">
                    <medicineCase v-if="index == 1"></medicineCase>
                    <pharmacy v-if="index == 2"></pharmacy>
                </template>
            </div>
        </div>

    </div>
</template>
<script>
    import {
        getCookie,
        removeCookie,
        post,
        getStorage,
        setStorage,
        removeStorage
    } from '../config/util'
    import {
        mapState,
        mapActions
    } from 'vuex'
    import $ from 'jquery'
    import identifyMedicine from './identifyMedicine'
    import medicineCase from './medicineCase'
    import pharmacy from './pharmacy'
    export default {
        name: 'index',
        components:{
            identifyMedicine,
            medicineCase,
            pharmacy
        },
        data() {
            return {
                userName: getCookie('name'),
                menus: [
                    {name:'中药鉴别',form:'medicine'},
                    {name:'病例管理',form:'pharmacy'},
                    {name:'药品管理',form:'pharmacy'}
                ],
                index:0 || 1,
                from:'',
                i:0 || 1
            }
        },
        created(){
            this.from=this.$route.query.from;
        },
        mounted() {
            this.index = this.from == 'medicine' ? 0 : 1
        },
        methods: {
            // 退出
            logout() {
                removeCookie("uid");
                removeCookie("sid");
                removeCookie("name");
                if (this.from == 'medicine'){
                    this.$router.push({
                        name: 'Login'
                    });
                } else {
                    this.$router.push({
                        name: 'Login'+'/pharmacy'
                    });
                }

            },
            linkto(index){
                this.index = index;
                this.i = index
            }
        }
    }

</script>
<style scoped>
    .root {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    .nav {
        width: 100%;
        background: rgb(0, 160, 233);
        color: white;
        height: 4rem;
        padding: 0 2rem;
        font-size: 1.3rem;
        box-sizing: border-box;
    }

    .navRight {
        width: 12rem;
    }

    .navRight span {
        position: relative;
        right: 1.5rem;
        bottom: 0.1rem;
    }

    .flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .flex-column {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .main {
        width: 100%;
        height: calc(100% - 4rem);
    }

    .mainLeft {
        width: 12%;
        height: 100%;
        background: rgb(11, 36, 48);
    }

    .mainLeft>img {
        width: 5rem;
        margin: 1.5rem;
    }

    .mainLeft ul {
        width: 100%;
    }

    .mainLeft ul li {
        width: 100%;
        background: rgb(34, 52, 60);
        color: rgb(0, 160, 233);
        text-align: center;
        padding: 0.5rem 0;
        font-size: 1rem;
        cursor: pointer;
    }

    .mainRight {
        width: 88%;
        height: 100%;
        /*padding: 0.8rem;
        box-sizing: border-box;*/
        overflow-x: hidden;
    }

    .mainLeft ul li.active {
        color: #fff;
        background: rgb(0, 160, 233);
    }
</style>

