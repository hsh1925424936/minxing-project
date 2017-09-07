<template>
    <div class='cfooter'>
      <el-button type="primary" @click='submitnewq()' v-if="action=='new'">添加题目</el-button>
      <el-button type="primary" @click='editq()' v-else>保存修改</el-button>
      <el-button @click='goback()'>取消</el-button>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
      props:['submitnewq','btnlefttext','action','editq'],
        mounted () {

        },
        methods: {
          goback(){
            if( parent.layer ){
              parent.layer.closeAll();
            }else{
              window.history.go(-1)
            }
            
          }
        }
    }

</script>
<style lang="scss">
  .cfooter{
    margin:20px 0;
    display: flex;
    justify-content: flex-end;
  }
</style>
