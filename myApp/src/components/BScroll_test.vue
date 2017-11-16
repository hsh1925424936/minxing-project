<template>
    <div class="root">
        <!-- {{message}} -->
        <div class="main">
            <ul>
               <li v-for="item in 100">{{item}}</li> 
            </ul>
        </div>
    </div>
</template>
<style scoped>
    .main{
        width:100vw;
        height:100vh;
        overflow:hidden;
    }
</style>
<script>
    import BScroll from 'better-scroll';
    export default {
        name:'test',
        data(){
            return{
                message:'hellO',
            }
        },
        created(){
            this.$nextTick(()=>{
               let scroll = new BScroll('.main',{
                   scrollY:true,
                   click:true
               })
            })
        },
    }
</script>