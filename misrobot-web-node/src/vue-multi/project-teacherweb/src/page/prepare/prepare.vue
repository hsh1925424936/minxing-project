<template>
  <div class="container">
    <div class="navtext">
      <router-link to="list">
        <el-button type="text">备课列表></el-button>
      </router-link>
      <span>备课</span>
    </div>

    <courseinfo></courseinfo>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="课程文件" name="first">
        <div class="borderbox">
          <preparefile :status='status'></preparefile>
        </div>
      </el-tab-pane>
      <el-tab-pane label="课程题目" name="second">
        <div class="borderbox">
          <preparequestion></preparequestion>
        </div>
      </el-tab-pane>
      <el-tab-pane label="随堂小测" name="third">
        <div class="borderbox">
          <preparetest></preparetest>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div id="d1"></div>
  </div>
</template>

<script>
  import courseinfo from '../../components/courseinfo'
  import preparefile from './prepare_file'
  import preparequestion from './prepare_question'
  import preparetest from './prepare_test'

  export default {
    data() {
      return {
        //导航数据
        activeName: 'first',
        status:this.$route.query.status
         
      }
    },
    components: {
      courseinfo,
      preparefile,
      preparequestion,
      preparetest
    },
    methods: {
      handleClick(tab, event) {
//        console.log(tab, event);
      },
  
    }
  }

</script>
<style lang="scss">
  @import "../../assets/css/common.css";
  .borderbox{
    border:1px solid #ccc;
  }
</style>
