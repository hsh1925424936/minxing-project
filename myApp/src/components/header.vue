<template>
    <div class="root">
        <div class="title">
            <div class="left" @click="back"><</div>
            <slot name="center"></slot>
            <slot name="right"></slot>
        </div>
    </div>
</template>
<style scoped>
    .title{
        width:100%;
        height:2rem;
        background:#2099da;
        display:flex;
        /* justify-content: space-between; */
        align-items:center;
        position:fixed;
        top:0;
        z-index: 1000;
    }
    .left{
        font-size:1.5rem;
        color:#fff;
        margin-right: 3rem;
        margin-left:1rem;
    }
</style>
<script>
    export default {
        name:'header',
        data(){
            return {

            }
        },
        methods:{
            back(){
                history.back();
            }
        }
    }
</script>