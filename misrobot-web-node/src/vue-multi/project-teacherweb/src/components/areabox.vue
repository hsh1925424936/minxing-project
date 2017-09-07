<template>
  <div class="areabox">
    <h4 class="title">{{title}}</h4>
    <slot></slot>
  </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        props:['title']
    }
</script>
<style lang="scss" scoped>
  .title{
    background-color: #efefef;
    border-bottom:1px solid #eee;
    height:40px;
    margin:0;
    line-height: 40px;
    padding-left:20px;
  }
  .areabox{
    border:1px solid #ccc;
    margin-top:20px;
    padding-bottom: 10px;
  }
</style>
