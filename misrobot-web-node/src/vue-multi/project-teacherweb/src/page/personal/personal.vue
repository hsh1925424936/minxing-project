<template>
<div>
<el-menu :default-active="cindex" router class="el-menu-demo" mode="horizontal" @select="handleSelect">
  <el-menu-item index="/personalinfo">基本资料</el-menu-item>
    <el-menu-item index="/modifypassword">修改密码</el-menu-item>
  <el-menu-item index="/notification">通知</el-menu-item>
</el-menu>

<router-view class = "sub-view"></router-view>

</div>
</template>

<script>

    export default {
        data() {
            return {
              
            }
        },
        computed:{
          cindex(){
            return this.$route.path;
          }
        },
        components: {},
        created() {
        },
        mounted () {
          /*console.log(this.$route.path)
          this.cindex= this.$route.path;*/
        },

        methods: {},
        watch:{

        }
    }

</script>
<style lang="scss">
  @import "../../assets/css/common.css";
  .sub-view{
        border: 1px solid #e1eaf1;
        box-shadow: 0 1px 3px 0 rgba(0,34,77,.05);
        background-clip: content-box;
        width:100%;
        min-height:500px;
        box-sizing:border-box;
        margin-top:30px;
  }

</style>
