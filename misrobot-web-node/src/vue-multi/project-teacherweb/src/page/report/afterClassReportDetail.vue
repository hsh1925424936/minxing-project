<template>
    <div>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/report/allreport' }">教学报告</el-breadcrumb-item>
          <el-breadcrumb-item>课堂报告详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class = "report-detail">
          <iframe :src="'/pages/assistant/statistics_cs.html?sid=' + sid + '&&uid=' + uid + '&&scheduleid=' + scheduleid"></iframe>
            <!-- <h1 class = "report-title">腹腔穿刺术</h1>
            <h2 class =  "item-title">课程信息</h2>
            <div class = "item-detail">
                <div class = "sub-item"><span>时间：</span> <span style="padding-left:10px;">啊啊啊啊</span></div>
                <div class = "sub-item"><span>地点：</span> <span style="padding-left:10px;">啊啊啊啊</span></div>
                <div class = "sub-item"><span>班级：</span> <span style="padding-left:10px;">啊啊啊啊</span></div>
                <div class = "sub-item"><span>课程状态：</span> <span style="padding-left:10px;">啊啊啊啊</span></div>
                <div class = "more-detail">详情></div>
            </div>
            <h2 class =  "item-title">签到信息</h2>
            <div class = "item-detail">
                <div class = "sub-item"><span>时间：</span> <span style="padding-left:10px;">啊啊啊啊</span></div>
                <div class = "sub-item"><span>地点：</span> <span style="padding-left:10px;">啊啊啊啊</span></div>
                <div class = "sub-item"><span>班级：</span> <span style="padding-left:10px;">啊啊啊啊</span></div>
                <div class = "sub-item"><span>课程状态：</span> <span style="padding-left:10px;">啊啊啊啊</span></div>
                <div class = "more-detail">详情></div>
            </div> -->
        </div>
    </div>
</template>

<script>
import {post,setCookie,getCookie,setTitle} from '../../config/util'
    export default {
        data() {
            return {
              uid:getCookie('uid'),
              sid:getCookie('sid'),
              scheduleid:'',
            }
        },
        components: {},
        created() {
        },
        mounted () {
          this.scheduleid = this.$route.query.scheduleid;
        },

        methods: {}
    }

</script>
<style lang="scss">
  @import "../../assets/css/common.css";
  .report-detail{
    width:100%;
   
    box-sizing:border-box;
     margin-top:20px;
    /*padding:20px;
    min-height:80vh;
    border: 1px solid #e1eaf1;
    box-shadow: 0 1px 3px 0 rgba(0,34,77,.05);
    background-clip: content-box; */
  }
  .report-detail iframe{
    width:100%;
    height:2300px;
  }
  .report-title{
    text-align:center;
    font-size:20px;

  }
  .item-title{
    font-weight:normal;
    font-size:17px;
    margin:20px;
  }
  .item-detail{
    background-color:#f2f2f2;
    padding:20px;
    position:relative;
  }
  .sub-item{
    margin-right:100px;
    display:inline-block;

  }
  .more-detail{
    position:absolute;
    bottom:20px;
    right:20px;
    color:#20a0ff;
  }
</style>
