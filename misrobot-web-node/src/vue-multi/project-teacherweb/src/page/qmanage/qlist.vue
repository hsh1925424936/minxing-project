<template>
  <div class="container">
    <div class="tophandler">
      <div class="flex">
        <el-button type="primary" @click="dialogFormVisible = true">新建题目</el-button>
        <div class="qimport">
          <el-button @click = "downloadModel">下载理论题模板</el-button>
          <el-upload
            class="upload-demo"
            action="/import/importExcel"
            :data="uploadData"
            :on-success="handleSuccess"
            :show-file-list="false"
            >
            <el-button type="primary">导入理论题</el-button>
           
          </el-upload>
        </div>
      </div>

      <!-- <div>
        <el-input placeholder="输入题目关键字查询" icon="search" v-model="searchq" :on-icon-click="handleIconClick"></el-input>
      </div> -->
      <div >
          <div class="search-input" style = "float:left">
              <el-input style = "width:200px" v-model="searchq" placeholder="输入题目关键字查询"></el-input>
          </div>
          <div class = "search-btn" style = "float:left;margin-left:10px">
              <el-button type = "primary" @click ="handleIconClick">查询</el-button>
          </div>
      </div>
    </div>

    <div class="flex">
      <div class="tree">
          <el-tree
              :data="treedata"
              :props="defaultProps"
              @node-click="handleNodeClick"
              highlight-current
          >
          </el-tree>
      </div>
      <div class="flex_fill">
        <div class="mb10">
          <el-select v-model="selqtype" placeholder="全部题型">
            <el-option v-for="item in qtype" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>

          <el-select v-model="selqauthor" placeholder="全部题目">
            <el-option v-for="item in qauthor" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>

        <ul class="qbox">
          <li class="flex qdetail" v-for="(value,index) in qlist" @click="todetail(value)">
            <div class="r" :class="{
              bggreen:value.questiontypeid==1,
              bgred:value.questiontypeid==2,
              bgblue:value.questiontypeid==4,
              bgyellow:value.questiontypeid==5,
              bgzise:value.questiontypeid==6,
              bgblack:value.questiontypeid==7,
            }">{{ value.questiontypeid |questiontype }}</div>
            <div class="qtitle">
              <span>{{index+1}}.</span>
              <span>{{value.questionname}}</span>
            </div>
            <div class="dificulty">
              <div>
                <el-tag type="gray" v-for="(value1,index1) in value.lablist" class="mr10">{{value1.name}}</el-tag>
              </div>
              <div class="fgraysmall" v-show="value.categoryname">
                <span>所属类别：</span>
                <span>{{value.categoryname}}</span>
              </div>
              <div class="flex" v-show="value.difficult">
                <span>难度：</span>
                <el-rate v-model="value.difficult" disabled></el-rate>
              </div>
            </div>
            <div class="p10rl">
              <el-button type="primary" size="small" @click.stop="toedit(value)">编辑</el-button>
              <el-button type="danger" size="small" @click.stop="deleteq(value)">删除</el-button>
            </div>
          </li>
        </ul>

        <div class="pagebox">
          <el-pagination layout="prev, pager, next" :total="totalnum" @current-change="topage" :current-page.sync="currentpage"></el-pagination>
        </div>
      </div>
    </div>

    <el-dialog title="新增题目" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="题目类型：" :label-width="formLabelWidth">
          <el-select v-model="form.type" placeholder="请选择要创建的题型">
            <el-option label="单选" value="newqdanxuan"></el-option>
            <el-option label="多选" value="newqduoxuan"></el-option>
            <el-option label="判断" value="newqpanduan"></el-option>
            <el-option label="操作" value="newqcaozuo"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogconfirm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看题目-单选题" :visible.sync="detailconfig.dialogdanxuan">
      <detailqdanxuan :questionid="questionid" v-if="detailconfig.dialogdanxuan"
        :isshowfile.sync="isshowfile" :showfile.sync="showfile"
      >
        
      </detailqdanxuan>
    </el-dialog>

    <el-dialog title="查看题目-多选题" :visible.sync="detailconfig.dialogduoxuan">
      <detailqduoxuan :questionid="questionid" v-if="detailconfig.dialogduoxuan"
        :isshowfile.sync="isshowfile" :showfile.sync="showfile"
      >
        
      </detailqduoxuan>
    </el-dialog>

    <el-dialog title="查看题目-判断题" :visible.sync="detailconfig.dialogpanduan">
      <detailqpanduan :questionid="questionid" v-if="detailconfig.dialogpanduan"
        :isshowfile.sync="isshowfile" :showfile.sync="showfile"
      >
      </detailqpanduan>
    </el-dialog>

    <el-dialog title="查看题目-问答题" :visible.sync="detailconfig.dialogwenda">
      <detailqwenda :questionid="questionid" v-if="detailconfig.dialogwenda"></detailqwenda>
    </el-dialog>

    <el-dialog title="查看题目-组合题" :visible.sync="detailconfig.dialogzuhe">
      <detailqzuhe :questionid="questionid" v-if="detailconfig.dialogzuhe"></detailqzuhe>
    </el-dialog>

    <el-dialog title="查看题目-操作题" :visible.sync="detailconfig.dialogcaozuo">
      <detailqcaozuo :questionid="questionid" v-if="detailconfig.dialogcaozuo"
        :isshowfile.sync="isshowfile" :showfile.sync="showfile"
      >

      </detailqcaozuo>
    </el-dialog>

    <el-dialog title="文件查看" :visible.sync="isshowfile">
      <video class="qvideo"
        :src="showfile"
        loop autoplay controls v-if="isshowfile"
      />
    </el-dialog>
  </div>
</template>

<script>
  import {exportMouldExcel} from '../../config/util'
  import methods from '../../assets/js/methods'
  import xhttp from '../../assets/js/http'
  import detailqdanxuan from './detailqdanxuan'
  import detailqduoxuan from './detailqduoxuan'
  import detailqpanduan from './detailqpanduan'
  import detailqwenda from './detailqwenda'
  import detailqzuhe from './detailqzuhe'
  import detailqcaozuo from './detailqcaozuo'
    export default {
        data() {
            return {
              //左边树形控件
              treedata: [],
              defaultProps: {
                children: 'children',
                label: 'label'
              },
              selcategory:null,
              //两个select
              value:'',
              options:[],
              qtype: [{
                value: 10,
                label: '全部题型'
              },{
                value: 1,
                label: '单选题'
              }, {
                value: 2,
                label: '多选题'
              }, {
                value: 4,
                label: '判断题'
              },{
                value: 7,
                label: '操作题'
              }],
              selqauthor: 1,
              qauthor: [{
                value: 1,
                label: '全部题目'
              }, {
                value: 0,
                label: '我的题目'
              }],
              selqtype: 10,
              //搜索功能
              searchq:null,
              //弹框
              dialogFormVisible: false,
              form: {
                name: '',
                type: '',
                date1: '',
                date2: '',
                delivery: false,
                resource: '',
                desc: ''
              },
              formLabelWidth: '120px',
              //难度
              dificulty:4,
              qlist:[],
              //分页
              currentpage:1,
              totalnum:0,
              //题目详情
              questionid:'',
              detailconfig:{
                dialogdanxuan:false,
                dialogduoxuan:false,
                dialogpanduan:false,
                dialogwenda:false,
                dialogzuhe:false,
                dialogcaozuo:false
              },
              uploadData:{
                _upload_data: JSON.stringify({"1": {
                  command: 'question/importtheoreticalquestions',
                  sessionid: $.cookie('sid'),
                  loginid: $.cookie('uid'),
                }})
              },
              isshowfile:false,//是否展示附件详情
              showfile:'',
            }
        },
      components:{
        detailqdanxuan,
        detailqduoxuan,
        detailqpanduan,
        detailqwenda,
        detailqzuhe,
        detailqcaozuo
      },
      filters:{
        questiontype(val){
          if(val==1){
            return '单'
          }else if(val==2){
            return '多'
          }else if(val==4){
            return '判'
          }else if(val==5){
            return '问'
          }else if(val==6){
            return '组'
          }else if(val==7 || val==8){
            return '操'
          }
        }
      },
      watch:{
        'currentpage'(val,oldval){
          this.getqlist(this.selcategory,this.selqtype,this.selqauthor,val,10,this.searchq)
        },
        'selqtype'(val,oldval){
          this.getqlist(this.selcategory,val,this.selqauthor,1,10,null)
        },
        'selqauthor'(val,oldval){
          this.getqlist(this.selcategory,this.selqtype,val,1,10,null)
        },
        'selcategory'(val,oldval){
          this.getqlist(val,this.selqtype,this.selqauthor,1,10,null)
        }
      },
        mounted () {
          if(this.$route.query.newq){
            this.dialogFormVisible=true
          }
            if(this.$route.query.querymy){//只查询我的题目
                this.selqauthor=0
                this.getqlist(null,this.qtype[0].value,0,1,10,null)
            }else{
                this.getqlist(null,this.qtype[0].value,1,1,10,null)
            }
          this.gettree()
        },
        methods: {
            handleSuccess(resp){
              if(resp&&resp.errcode==300005){
                this.$msgbox({
                    title: '错误提示',
                    message: this.$createElement('p', null, resp.errdesc),
                    type:'error',
                    confirmButtonText: '确定',
                });
              }else if(resp&&resp.errcode==0){
                this.$message({
                  type:'success',
                  message:'导入成功'
                })
              }else{


                this.$message({
                  type:'error',
                  message:'导入失败，模板异常'
                })
              }
            },
            downloadModel(){
                let data = {
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    command: "question/questioncategorymould",
                };
                exportMouldExcel(data);

        },
          handleIconClick(){
            this.getqlist(this.selcategory,this.selqtype,this.selqauthor,1,10,this.searchq)
          },
            handleNodeClick(data){
                if(data.value==1){
                    this.selcategory=null
                }else{
                    this.selcategory=data.value
                }
            },
          dialogconfirm(){
            var self=this
            this.$router.push({
              name:self.form.type,
              query:''
            })
          },
          getqlist(categoryid,questiontypeid,createperson,page,reqnum,searchtext){//categoryid类别，questiontypeid题型(9:所有，1：单选，2：多选，4：判断，5：问答)，createperson创建人(0:我的，1：全部)，分页参数page,reqnum
            var self=this
            var data={
              command:'question/queryquestionlist',
              sessionid: $.cookie('sid'),
              loginid:$.cookie('uid'),
              createUid:$.cookie('uid'),
              createperson:createperson,
              page:page,
              reqnum:reqnum
            }
            if(categoryid!=null){
              data.categoryid=categoryid
            }
            if(questiontypeid!=null){
              data.questiontypeid=questiontypeid
            }
            if(searchtext!=null){
              data.questionname=searchtext
            }
            function callback(res){
              self.qlist=res.questionlist
              self.totalnum=res.allcount
            }
            xhttp.post('/question/queryquestionlist',data,callback,xhttp.errcodefn,xhttp.errfn)
          },
          gettree(){
            var self=this
            var data={
              command:'question/questioncategorytree',
              sessionid: $.cookie('sid'),
              loginid:$.cookie('uid'),
            }
            function callback(res){
              self.treedata=res.children
            }
            xhttp.post('/question/questioncategorytree',data,callback,xhttp.errcodefn,xhttp.errfn)
          },
          topage(pagenum){
            this.currentpage=pagenum
          },
          deleteq(obj){//删除题目
            var self=this
            this.$confirm('此操作将永久删除该题目, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              callback:action=>{
                if(action=='cancel'){
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  })
                }else{
                  var data={
                    command:'question/deletequestion',
                    sessionid: $.cookie('sid'),
                    loginid:$.cookie('uid'),
                    uid:$.cookie('uid'),
                    questionid:obj.questionbaseid
                  }
                  function callback(res){
                    self.$message({
                      showClose: true,
                      message: '删除题目成功',
                      type: 'success'
                    })
                    self.getqlist(self.selcategory,self.selqtype,self.selqauthor,self.currentpage,10,self.searchq)
                  }
                  xhttp.post('/question/deletequestion',data,callback,xhttp.errcodefn,xhttp.errfn)
                }
              }
            })
          },
          todetail(obj){//查看题目详情，打开对话框
            this.questionid=obj.questionbaseid
            for(var i in this.detailconfig){
              this.detailconfig[i]=false
            }
            if(obj.questiontypeid==1){
              this.detailconfig.dialogdanxuan=true
            }else if(obj.questiontypeid==2){
              this.detailconfig.dialogduoxuan=true
            }else if(obj.questiontypeid==4){
              this.detailconfig.dialogpanduan=true
            }else if(obj.questiontypeid==5){
              this.detailconfig.dialogwenda=true
            }else if(obj.questiontypeid==6){
              this.detailconfig.dialogzuhe=true
            }else if(obj.questiontypeid==7){
              this.detailconfig.dialogcaozuo=true
            }
          },
          toeditpage(obj){//跳转到edit页面
            var self = this;
            self.questionid=obj.questionbaseid
            if(obj.questiontypeid==1){
              self.$router.push({
                name:'newqdanxuan',
                query:{
                  qid:self.questionid
                }
              })
            }else if(obj.questiontypeid==2){
              self.$router.push({
                name:'newqduoxuan',
                query:{
                  qid:self.questionid
                }
              })
            }else if(obj.questiontypeid==4){
              self.$router.push({
                name:'newqpanduan',
                query:{
                  qid:self.questionid
                }
              })
            }else if(obj.questiontypeid==5){
              self.$router.push({
                name:'newqwenda',
                query:{
                  qid:self.questionid
                }
              })
            }else if(obj.questiontypeid==6){
              self.$router.push({
                name:'newqzuhe',
                query:{
                  qid:self.questionid
                }
              })
            }else if(obj.questiontypeid==7){
              self.$router.push({
                name:'newqcaozuo',
                query:{
                  qid:self.questionid
                }
              })
            }
          },
          toedit(obj){
            var self = this;
            //先判断题目是否被引用，如果是给出提示
            var data={
                command:'question/queryquestioniscited',
                sessionid: $.cookie('sid'),
                loginid:$.cookie('uid'),
                questionbaseid:obj.questionbaseid
            }
            function callback(res){
              if(res.description){
                self.$confirm(res.description, '提示', {
                  confirmButtonText: '确定',
                  type: 'warning',
                  callback:action=>{
                    if(action=='cancel'){
                      self.$message({
                        type: 'info',
                        message: '已取消编辑'
                      })
                    }else{
                      self.toeditpage(obj);
                    }
                  }
                })
              }else{
                self.toeditpage(obj);
              }
            }
            xhttp.post('/question/queryquestioniscited',data,callback,xhttp.errcodefn,xhttp.errfn)

          }
        }
    }
</script>
<style lang="scss" scoped>
  @import "../../assets/css/common.css";
  .pagebox{
    display:flex;
    justify-content: flex-end;
    padding:10px;
  }
  .qimport{
    display:flex;
    margin-left:10px;
  }
  .qimport>button{
    margin-right:10px;
  }
  .tophandler{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .qvideo{
    width:100%; height:100%;
  }
</style>
