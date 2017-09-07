<template>
    <div id="no_content">
        <img src="../assets/images/icon-renwu.png" alt="">
        <span v-text="txtdescription || '当前没有内容哦~' "></span>
    </div>
</template>
<script>
    export default{
        props:['txtdescription']
    }
</script>
<style>
   #no_content{
       width:34%;
       position:fixed;
       top:34%;
       left:33%;text-align: center;
   }
    #no_content img{
        display:block;
        width:100%;
    }
   #no_content span{
       color:#ababab;
       padding-top:30px;
   }
</style>

