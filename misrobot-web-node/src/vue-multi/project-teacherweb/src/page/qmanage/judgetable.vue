<template>
  <div class="container">
    <cpagetitle :title="'操作题评分表'" :showback="false"></cpagetitle>
    <cmain :title="'题目信息'">
      <ul class="qdetaillist maincontent">
        <li>
          <span class="xlabel">题目名称：</span>
          <div class="xcontent">{{popname}}</div>
        </li>
        <li v-show="imgurl">
          <img :src="value.attrvalue" alt="" v-for="value in imgurl">
        </li>
        <li>
          <span class="xlabel">题目描述：</span>
          <div class="xcontent">{{popcomment}}</div>
        </li>
      </ul>
    </cmain>

    <cmain :title="'评分表'">
      <div class="maincontent">
          <el-upload
            class="upload-demo mt10"
            action="/import/importExcel"
            ref="upload"
            :auto-upload="false"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :data="uploadData"
            :file-list="fileList">
            <el-button size="small" type="primary" slot="trigger">评分表导入</el-button>
             <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传.xls文件</div>
          </el-upload>
          <a href="/static/excel/operation-question.xls">
            <el-button class="mt10">
              模板下载
            </el-button>
          </a>
        <div class="flex mt10">
          <span class="xlabel">评分表样式：</span>
          <div class="xcontent">加减分（满分开始）</div>
        </div>
        <div class="operatepop mt10">
          <div v-for="(item,index) in operatelist">
            <p>{{item.title}}</p>
            <el-table :data="item.objlist" border style="width: 100%">
              <el-table-column type="index" label="序号" width="50"></el-table-column>
              <el-table-column prop="rightoperation" label="评分项"></el-table-column>
              <el-table-column prop="gradeitemscore" label="分值"></el-table-column>
              <el-table-column prop="adjuststepunit" label="步长"></el-table-column>
              <el-table-column prop="gradelevel" label="评分表级别"></el-table-column>
              <el-table-column prop="classification1" label="分级1"></el-table-column>
              <el-table-column prop="classification2" label="分级2"></el-table-column>
              <el-table-column prop="classification3" label="分级3"></el-table-column>
              <el-table-column prop="classification4" label="分级4"></el-table-column>
              <el-table-column prop="classification5" label="分级5"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </cmain>

    <cmain :title="'设置'">
      <ul class="qdetaillist maincontent">
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
    </cmain>

    <div class="flex_center mt20">
      <el-button @click="pre()">上一步</el-button>
      <el-button type="primary" @click="submitquestion()" v-if="isedit">保存修改</el-button>
      <el-button type="primary" @click="submitquestion()" v-else>添加题目</el-button>
      <el-button @click="back()">取消</el-button>
    </div>
  </div>
</template>

<script>
  import methods from '../../assets/js/methods'
  import cmain from '../../components/areabox.vue'
  import cpagetitle from '../../components/cpagetitle'
  import cfooter from '../../components/cfooter'
  import xhttp from '../../assets/js/http'
  import '../../assets/js/ajaxfileupload'
    export default {
        data() {
            return {
              isedit:false,
              operatelist:[],//操作项列表
              popname:'',//操作题名
              popcomment:'',//操作题描述
              poptype:'',//操作项类型
              qid:'',
              difficult:null,
              name:'',
              answer:'',
              questionitem:[],
              lablist:[],
              picturelist:[],
              categoryname:'',
              fileList:[],
              imgurl:''
            }
        },
        components: {
          cmain,
          cpagetitle,
        },
        mounted () {
          this.qid=this.$route.query.qid;
          this.queryqtitle();
          if( this.$route.query.isedit ){
            this.isedit = true;
            this.queryoperation();
          }
        },
        computed:{
          'uploadData'(){
            return {_upload_data: JSON.stringify({"1": {
              command:'question/importoperationquestions',
              sessionid: $.cookie('sid'),
              loginid:$.cookie('uid'),
              questionid:this.qid
            }})}
          }
        },
        methods: {
          submitUpload(){
            var self=this
            if(!self.isedit){//如果是新增
              self.$refs.upload.submit();
            }else{
              var data={
                command:'question/deleteimportgrade',
                sessionid: $.cookie('sid'),
                loginid:$.cookie('uid'),
                id:this.qid
              }
              function callback(res){
                self.$refs.upload.submit();
              }
              xhttp.post('/question/deleteimportgrade',data,callback,xhttp.errcodefn,xhttp.errfn)
            }
          },
          handlePreview(){

          },
          handleSuccess(){
            this.queryoperation()
          },
          handleRemove(){

          },
          queryqtitle(){
            var self=this
            var data={
              command:'question/queryoprquestion',
              sessionid: $.cookie('sid'),
              loginid:$.cookie('uid'),
              questionbaseid:this.qid
            }
            function callback(res){
              self.popname=res.name
              self.popcomment=res.comment
              self.lablist=res.lablist
              self.difficult=res.difficult
              self.categoryname=res.categoryname
              self.imgurl=res.picturelist
            }
            xhttp.post('/question/queryoprquestion',data,callback,xhttp.errcodefn,xhttp.errfn)
          },
          queryoperation(){
            var self=this
            var data={
              command:'question/queryoperation',
              sessionid: $.cookie('sid'),
              loginid:$.cookie('uid'),
              questionid:this.qid
            }
            function callback(res){
              var titlelist=[];
              self.operatelist = [];
              for(var i=0;i<res.queryOperationlist.length;i++){
                var value=true;
                for (var j=0;j<self.operatelist.length;j++) {
                  if (res.queryOperationlist[i].opstepcontent==self.operatelist[j].title) {
                    value=false
                  }
                }
                if (value) {
                  self.operatelist.push({
                    title:res.queryOperationlist[i].opstepcontent,
                    objlist:[]
                  })
                }
              }
              for (var i=0;i<self.operatelist.length;i++) {
                for (var j=0;j<res.queryOperationlist.length;j++) {
                  if(self.operatelist[i].title==res.queryOperationlist[j].opstepcontent){
                    self.operatelist[i].objlist.push(res.queryOperationlist[j])
                  }
                }
              }
            }
            xhttp.post('/question/queryoperation',data,callback,xhttp.errcodefn,xhttp.errfn)
          },
          submitquestion: function(){//提交题目
            var self=this
            var data={
              command:"question/infooperation",
              sessionid: $.cookie('sid'),
              loginid:$.cookie('uid'),
              questionid:self.qid
            }
            function callback(res){
              if(self.isedit){
                self.$message({
                    type: 'success',
                    message: '保存修改成功'
                })
                self.$router.push({
                    name:'qlist'
                })
              }else{
                self.$confirm('添加题目成功', '提示', {
                  confirmButtonText: '继续添加',
                  cancelButtonText: '不再添加',
                  type: 'success'
                }).then(function(){
                  self.$router.push({
                    name:'newqcaozuo'
                  })
                }).catch(function(){
                  self.$router.push({
                    name:'qlist',
                      // query:{
                      //     querymy:true
                      // }
                  })
                })
              }
                
            }
            xhttp.post("/question/infooperation",data,callback,xhttp.errcodefn,xhttp.errfn)
          },
          back(){
            this.$router.push({
              name:'qlist'
            })
          },
          pre(){
            this.$router.push({
              name:'newqcaozuo',
              query:{
                qid:this.qid
              }
            })
          }
      }
    }
</script>
<style lang="scss" scoped>
  @import "../../assets/css/common.css";
  @import "../../assets/css/addqcommon.css";
</style>
