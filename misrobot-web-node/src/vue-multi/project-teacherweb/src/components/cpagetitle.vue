<template>
  <div>
    <div class='pagetitle'>
      <p>{{ title }}</p>
      <el-button type="primary" v-show='showback' @click='goback()'>返回</el-button>
    </div>
  </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        props:['title','showback'],
        methods: {
          goback(){
            window.history.go(-1)
          }
        }
    }

</script>
<style lang="scss">

</style>
