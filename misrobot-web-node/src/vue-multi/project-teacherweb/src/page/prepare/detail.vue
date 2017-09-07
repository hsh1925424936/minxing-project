<template>
  <div class="container">
    <div class="navtext">
      <router-link to="list">
        <el-button type="text">备课列表></el-button>
      </router-link>
      <router-link to="history">
        <el-button type="text">历史备课记录></el-button>
      </router-link>
      <span>备课信息</span>
    </div>

    <courseinfo></courseinfo>

    <areabox :title="'精选课件'">
      <p class="filecount">共3个文件</p>
      <ul class="files">
        <li>ppt</li>
        <li>jpg</li>
        <li>rar</li>
      </ul>
    </areabox>

    <areabox :title="'精选提问'">
      <ul class="flex_pingjun qcount">
        <li>
          <span class="name">共选择题目：</span>
          <span class="content">50道</span>
        </li>
        <li>
          <span class="name">单选题：</span>
          <span class="content">10道</span>
        </li>
        <li>
          <span class="name">多选题：</span>
          <span class="content">10道</span>
        </li>
        <li>
          <span class="name">判断题：</span>
          <span class="content">10道</span>
        </li>
        <li>
          <span class="name">问答题：</span>
          <span class="content">10道</span>
        </li>
      </ul>
      <ul class="qbox">
        <li class="flex qdetail">
          <div class="r bggreen">单</div>
          <div class="qtitle">
            <span>1.</span>
            <span>题目内容很长很长</span>
          </div>
          <div class="dificulty">
            <div>
              <el-tag type="gray">标签1</el-tag>
              <el-tag type="gray">标签2</el-tag>
              <el-tag type="gray">标签3</el-tag>
            </div>
            <div class="flex">
              <span>难度：</span>
              <p>
                <span>※</span>
                <span>※</span>
                <span>※</span>
              </p>
            </div>
          </div>
        </li>
        <li class="flex qdetail">
          <div class="r bgyellow">多</div>
          <div class="qtitle">
            <span>1.</span>
            <span>题目内容很长很长</span>
          </div>
          <div class="dificulty">
            <div>
              <el-tag type="gray">标签1</el-tag>
              <el-tag type="gray">标签2</el-tag>
              <el-tag type="gray">标签3</el-tag>
            </div>
            <div class="flex">
              <span>难度：</span>
              <p>
                <span>※</span>
                <span>※</span>
                <span>※</span>
              </p>
            </div>
          </div>
        </li>
      </ul>
      <div class="block mt20">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </div>
    </areabox>

    <areabox :title="'随堂小测'">
      <ul class="qbox">
        <li class="flex qdetail">
          <div class="testname">
            <p>内科学2017试卷</p>
            <span class="smallgray">内科学</span>
          </div>
          <el-tag type="primary">理论</el-tag>
          <span class="smallgray testtime">2017-01-01</span>
        </li>
        <li class="flex qdetail">
          <div class="testname">
            <p>内科学2017试卷</p>
            <span class="smallgray">内科学</span>
          </div>
          <el-tag type="primary">理论</el-tag>
          <span class="smallgray testtime">2017-01-01</span>
        </li>
      </ul>
    </areabox>
  </div>
</template>

<script>
  import areabox from '../../components/areabox'
  import courseinfo from '../../components/courseinfo'
    export default {
        data() {
            return {
              //分页数据
              currentPage: 1
            }
        },
        components: {
          areabox,
          courseinfo
        },
        mounted () {

        },
        methods: {
          filterTag(value, row) {
            return row.tag === value;
          },
          handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
          },
          handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
          }
        }
    }

</script>
<style lang="scss" scoped>
  .mt20{
    margin-top: 20px;
  }
  .flex{
    display:flex;
  }
  .flex_pingjun{
    display:flex;
    justify-content: space-around;
  }
  .container{
    padding:8px;
  }
  .files{
    display: flex;
  }
  .filecount{
    padding:10px 20px;
  }
  .files>li{
    margin: 10px;
  }
  .coursename{
    text-align: center;
    height:40px;
    line-height: 40px;
  }
  .r{
    border-radius: 50%;
    width:30px;
    height:30px;
    color:white;
    line-height: 30px;
    text-align: center;
    margin:0 10px;
  }
  .bgred{
    background-color: #FF4949;
  }
  .bgblue{
    background-color: #20A0FF;
  }
  .bgyellow{
    background-color: #F7BA2A;
  }
  .bggreen{
    background-color: #13CE66;
  }
  .bgblack{
    background-color: black;
  }
  .qdetail{
    border:1px solid #ddd;
    height:60px;
    align-items: center;
    margin-top:8px;
  }
  .dificulty{
    width:200px;
  }
  .qtitle{
    flex:1 1;
  }
  .qbox{
    padding:8px;
  }
  .qcount{
    margin-top:16px;
  }
  .block{
    display:flex;
    justify-content: flex-end;
    padding-right:8px;
  }
  .smallgray{
    color:#aaa;
    font-size:12px;
  }
  .testname{
    width:200px;
    margin-left:10px;
  }
  .testtime{
    flex:1 1;
    text-align: right;
    padding-right:10px;
  }
</style>
