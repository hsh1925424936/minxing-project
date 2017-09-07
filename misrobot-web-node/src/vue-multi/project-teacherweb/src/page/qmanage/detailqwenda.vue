<template>
  <div>
    <ul class="qdetaillist">
      <li>
        <span class="xlabel">题目：</span>
        <div class="xcontent">{{name}}</div>
      </li>
        <li v-show="picturelist">
            <span class="xlabel">附件：</span>
            <div class="xcontent">
                <img :src="value.attrvalue" alt="" v-for="(value,index) in picturelist">
            </div>
        </li>
      <li>
        <span class="xlabel">正确答案：</span>
        <div class="xcontent">{{answer}}</div>
      </li>
      <li>
        <span class="xlabel">所属类别：</span>
        <div class="xcontent">{{categoryname}}</div>
      </li>
      <li>
        <span class="xlabel">标签：</span>
        <div class="xcontent">
          <el-tag type="gray" v-for="value in lablist" class="mr10">{{value.name}}</el-tag>
        </div>
      </li>
      <li>
        <span class="xlabel">难度：</span>
        <div class="xcontent">
          <el-rate v-model="difficult" disabled></el-rate>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import methods from '../../assets/js/methods'
  import xhttp from '../../assets/js/http'
  export default {
    data() {
      return {
        difficult:0,
        name:'',
        answer:'',
        lablist:[],
        picturelist:[],
        categoryname:''
      }
    },
    props:['questionid'],
    components: {},
    mounted () {
      this.queryqdetail()
    },
    watch:{
      'questionid'(){
        this.queryqdetail()
      }
    },
    methods: {
      queryqdetail(){
        var self=this
        var data={
          command:'question/querysinglequestion',
          sessionid: $.cookie('sid'),
          loginid:$.cookie('uid'),
          questionbaseid:this.questionid
        }
        function callback(res){
          self.name=res.name
          self.answer=res.answer
          self.lablist=res.lablist
          self.picturelist=res.picturelist
          self.difficult=res.difficult
          self.categoryname=res.categoryname
        }
        xhttp.post('/question/querysinglequestion',data,callback,xhttp.errcodefn,xhttp.errfn)
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../assets/css/common.css";
</style>
