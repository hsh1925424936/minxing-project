<template>
  <div class="container">
    <cpagetitle :title="pagetitletext" :showback="true"></cpagetitle>

    <cmain :title="maintitle[0]">
      <div class="maincontent">
        <el-input type="textarea" placeholder="输入题目名称,300字以内" v-model="qname" :maxlength='qtitlemax'></el-input>
        <el-upload
          class="upload-demo mt10"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList">
          <el-button size="small" type="primary">上传附件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </div>
    </cmain>

    <div class="zuhehandler">
      <el-button type="primary" @click="adddanxuan()">添加单选题</el-button>
      <el-button type="primary" @click="addduoxuan()">添加多选题</el-button>
      <el-button type="primary" @click="addpanduan()">添加判断题</el-button>
      <el-button type="primary" @click="addwenda()">添加问答题</el-button>
    </div>

    <ul>
      <li v-for="(value1,index1) in subitem" class="oneq">

        <div class="danxuan" v-if="subitem[index1].cateid==1">
          <span class="deleteoneq el-icon-minus optionhandler" @click="deleteoneq(index1)"></span>
          <cmain :title="'题目'+(index1+1)+'-单选题'">
            <div class="maincontent">
              <el-input type="textarea" placeholder="输入题目名称,300字以内" v-model="subitem[index1].itemquestion" :maxlength='qtitlemax'></el-input>
            </div>
          </cmain>
          <cmain :title="maintitle[1]">
            <ul class="addoptions maincontent">
              <li v-for="(value2,index2) in subitem[index1].questionitem">
                <span class="itemname">{{ index2 | numtoa }}</span>
                <el-input placeholder="输入选项内容，100字以内" v-model="value2.content" :maxlength='qcontentmax'></el-input>
                <b @click="addoption(index1,index2)" v-show="value2.handler=='add'" class="el-icon-plus optionhandler"></b>
                <b @click="deleteoption(index1,index2,'danxuan')" v-show="value2.handler=='delete'" class="el-icon-minus optionhandler"></b>
              </li>
            </ul>
          </cmain>
          <cmain :title="maintitle[2]">
            <div class="maincontent">
              <el-radio v-for="(value3,index3) in subitem[index1].questionitem" class="radio" v-model="subitem[index1].answer" :label="index3 | numtoa">{{ index3 | numtoa }}</el-radio>
            </div>
          </cmain>
        </div>

        <div class="duoxuan" v-else-if="subitem[index1].cateid==2">
          <span class="deleteoneq el-icon-minus optionhandler" @click="deleteoneq(index1)"></span>
          <cmain :title="'题目'+(index1+1)+'-多选题'">
            <div class="maincontent">
              <el-input type="textarea" placeholder="输入题目名称,300字以内" v-model="subitem[index1].itemquestion" :maxlength='qtitlemax'></el-input>
            </div>
          </cmain>
          <cmain :title="maintitle[1]">
            <ul class="addoptions maincontent">
              <li v-for="(value2,index2) in subitem[index1].questionitem">
                <span class="itemname">{{ index2 | numtoa }}</span>
                <el-input placeholder="输入选项内容，100字以内" v-model="value2.content" :maxlength='qcontentmax'></el-input>
                <b @click="addoption(index1,index2)" v-show="value2.handler=='add'" class="el-icon-plus optionhandler"></b>
                <b @click="deleteoption(index1,index2,'duoxuan')" v-show="value2.handler=='delete'" class="el-icon-minus optionhandler"></b>
              </li>
            </ul>
          </cmain>
          <cmain :title="maintitle[2]">
            <div class="maincontent">
              <el-checkbox-group v-model="subitem[index1].answer">
                <el-checkbox :label="index3 | numtoa" v-for="(value3,index3) in subitem[index1].questionitem">{{ index3 | numtoa }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </cmain>
        </div>

        <div class="panduan" v-else-if="subitem[index1].cateid==4">
          <span class="deleteoneq el-icon-minus optionhandler" @click="deleteoneq(index1)"></span>
          <cmain :title="'题目'+(index1+1)+'-判断题'">
            <div class="maincontent">
              <el-input type="textarea" placeholder="输入题目名称,300字以内" v-model="subitem[index1].itemquestion" :maxlength='qtitlemax'></el-input>
            </div>
          </cmain>
          <cmain :title="maintitle[2]">
            <div class="maincontent">
              <el-radio class="radio" v-model="subitem[index1].answer" label="0">正确</el-radio>
              <el-radio class="radio" v-model="subitem[index1].answer" label="1">错误</el-radio>
            </div>
          </cmain>
        </div>

        <div class="wenda" v-else>
          <span class="deleteoneq el-icon-minus optionhandler" @click="deleteoneq(index1)"></span>
          <cmain :title="'题目'+(index1+1)+'-问答题'">
            <div class="maincontent">
              <el-input type="textarea" placeholder="输入题目名称,300字以内" v-model="subitem[index1].itemquestion" :maxlength='qtitlemax'></el-input>
            </div>
          </cmain>
          <cmain :title="maintitle[2]">
            <div class="maincontent">
              <el-input type="textarea" placeholder="输入正确答案,300字以内" v-model="subitem[index1].answer" :maxlength='qtitlemax'></el-input>
            </div>
          </cmain>
        </div>
      </li>
    </ul>

    <cmain :title="maintitle[3]">
      <div class="maincontent">
        <ul>
          <li class="flex">
            <span class="setlabel">难度：</span>
            <div class="setcontent">
              <el-rate v-model="dificulty"></el-rate>
            </div>
          </li>
          <li class="flex mt10">
            <span class="setlabel">系统标签：</span>
            <div class="setcontent">
              <el-select
                v-model="systag"
                multiple
                filterable
                placeholder="请输入标签关键字">
                <el-option
                  v-for="item in options4"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </li>
          <li class="flex mt10">
            <span class="setlabel">所属类别：</span>
            <div class="setcontent">
              <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" highlight-current></el-tree>
            </div>
          </li>
        </ul>
      </div>
    </cmain>

    <cfooter :submitnewq="submitnewq" :action="action"></cfooter>
  </div>
</template>

<script>
  import methods from '../../assets/js/methods'
  import cmain from '../../components/areabox.vue'
  import cpagetitle from '../../components/cpagetitle'
  import cfooter from '../../components/cfooter'
  import xhttp from '../../assets/js/http'

  export default {
    data() {
      return {
        continue:true,//标记子题目是否超过十个
        qname:'',//组合题的提干
        qtitlemax:300,
        qcontentmax:100,
        disciplinelist:[],//学科列表
        seldiscipline:'',//所属学科
        pagetitletext:'新增题目-组合题',//页面标题
        maintitle:['组合题-题干','选项','正确答案','设置'],//页面主模块标题
        subitem:[],//组合体数组，用于渲染页面和提交
        questionmodel:{
          itemquestion:'',//子题题干,
          cateid:'',//子题题目类型
          questionitem:[{itemname:'',content:'',handler:'add'},{itemname:'',content:'',handler:'delete'},{itemname:'',content:'',handler:'delete'},{itemname:'',content:'',handler:'delete'},{itemname:'',content:'',handler:'delete'}],//子题选项
          answer:''//子题答案
        },
        fileList: [],
        //难度
        dificulty:null,//type:number
        //系统标签
        systag:[],
        options4: [],
        value9: [],
        list: [],
        
        states: ["Alabama", "Alaska", "Arizona",
          "Arkansas", "California", "Colorado",
          "Connecticut", "Delaware", "Florida",
          "Georgia", "Hawaii", "Idaho", "Illinois",
          "Indiana", "Iowa", "Kansas", "Kentucky",
          "Louisiana", "Maine", "Maryland",
          "Massachusetts", "Michigan", "Minnesota",
          "Mississippi", "Missouri", "Montana",
          "Nebraska", "Nevada", "New Hampshire",
          "New Jersey", "New Mexico", "New York",
          "North Carolina", "North Dakota", "Ohio",
          "Oklahoma", "Oregon", "Pennsylvania",
          "Rhode Island", "South Carolina",
          "South Dakota", "Tennessee", "Texas",
          "Utah", "Vermont", "Virginia",
          "Washington", "West Virginia", "Wisconsin",
          "Wyoming"],
        //树形控件
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        action:'new',
      }
    },
    filters:{
      numtoa:function(val){
        switch (val){
          case 0:
            return 'A'
            break;
          case 1:
            return 'B'
            break;
          case 2:
            return 'C'
            break;
          case 3:
            return 'D'
            break;
          case 4:
            return 'E'
            break;
          case 5:
            return 'F'
            break;
          case 6:
            return 'G'
            break;
          case 7:
            return 'H'
            break;
        }
      }
    },
    components: {
      cmain,
      cpagetitle,
      cfooter
    },
    mounted () {
      if(this.$route.query.qid){
        this.pagetitletext='编辑题目-组合题';
        this.action='edit';
      }
      this.list = this.states.map(item => {
          return { value: item, label: item };
    })
      this.querydiscipline();
      this.gettags();
      this.gettree();
    },

    methods: {
      gettree(){
        var self=this
        var data={
          command:'question/questioncategorytree',
          sessionid: $.cookie('sid'),
          loginid:$.cookie('uid'),
        }
        function callback(res){
          self.data=res.children
        }
        xhttp.post('/question/questioncategorytree',data,callback,xhttp.errcodefn,xhttp.errfn)
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      // remoteMethod(query) {
      //   if (query !== '') {
      //     this.loading = true;
      //     setTimeout(() => {
      //       this.loading = false;
      //     this.options4 = this.list.filter(item => {
      //         return item.label.toLowerCase()
      //           .indexOf(query.toLowerCase()) > -1;
      //   });
      //   }, 200);
      //   } else {
      //     this.options4 = [];
      //   }
      // },
      gettags(){
        var self=this
        var data={
          command:'question/querylablist',
          sessionid: $.cookie('sid'),
          loginid:$.cookie('uid'),
        }
        function callback(res){
          self.options4=res.lablist
        }
        xhttp.post('/question/querylablist',data,callback,xhttp.errcodefn,xhttp.errfn)
      },
      handleNodeClick(data) {
        console.log(data);
      },
      adddanxuan:function(){
        this.augments();
        if (this.continue){
          this.subitem.push({
            itemquestion:'',//子题题干,
            cateid:1,//子题题目类型
            questionitem:[{itemname:'',content:'',handler:'add'},{itemname:'',content:'',handler:'delete'},{itemname:'',content:'',handler:'delete'},{itemname:'',content:'',handler:'delete'},{itemname:'',content:'',handler:'delete'}],//子题选项
            answer:''//子题答案
          })
        }
      },
      addduoxuan:function(){
        this.augments();
        if (this.continue) {
          this.subitem.push({
            itemquestion: '',//子题题干,
            cateid: 2,//子题题目类型
            questionitem: [{itemname: '', content: '', handler: 'add'}, {
              itemname: '',
              content: '',
              handler: 'delete'
            }, {itemname: '', content: '', handler: 'delete'}, {
              itemname: '',
              content: '',
              handler: 'delete'
            }, {itemname: '', content: '', handler: 'delete'}],//子题选项
            answer: []//子题答案
          })
        }
      },
      addpanduan:function(){
        this.augments();
        if (this.continue) {
          this.subitem.push({
            itemquestion: '',//子题题干,
            cateid: 4,//子题题目类型
            answer: ''//子题答案
          })
        }
      },
      addwenda:function(){
        this.augments();
        if (this.continue) {
          this.subitem.push({
            itemquestion: '',//子题题干,
            cateid: 5,//子题题目类型
            answer: ''//子题答案
          })
        }
      },
      addoption:function(index1,index2){//增加选项
        if(this.subitem[index1].questionitem.length>=8){
          this.$message({
            type: 'warning',
            message: '最多添加8个选项'
          })
          return
        }
        this.subitem[index1].questionitem.push({
          itemname:'',
          content:'',
          handler:'delete'
        })
      },
      augments:function (){
        if (this.subitem.length>9){
          this.$message({
            type: 'warning',
            message: '最多创建十个子题'
          })
          this.continue=false
        }else {
          this.continue=true
        }
      },
      deleteoption:function(index1,index2,type){//删除选项
        var self=this
        if(type=='danxuan'){//单选题至少要一个选项
          if(this.subitem[index1].questionitem.length<=1){
            this.$message({
              type: 'warning',
              message: '单选最少要有1个选项'
            })
            return
          }
          self.subitem[index1].questionitem=methods.deleteItem(self.subitem[index1].questionitem,index2)
        }else{//多选题至少要2个选项
          if(this.subitem[index1].questionitem.length<=2){
            this.$message({
              type: 'warning',
              message: '多选最少要有2个选项'
            })
            return
          }
          self.subitem[index1].questionitem=methods.deleteItem(self.subitem[index1].questionitem,index2)
        }
      },
      querydiscipline:function(){//查询学科接口
        var self=this
        var data={
          command:"cls/selectCourses",
          sessionid: $.cookie('sid'),
          loginid:$.cookie('uid')
        }
        function callback(res){
          self.disciplinelist=res.courseslist
        }
        xhttp.post("/cls/selectCourses",data,callback,xhttp.errcodefn,xhttp.errfn)
      },
      submitnewq:function(){//保存添加题目接口
        if(this.qname==''){
          this.$message({
            type: 'warning',
            message: '请输入组合题题干'
          })
          return
        }
        if (this.subitem.length==0){
          this.$message({
            type: 'warning',
            message: '请创建子题'
          })
          return
        }
        for(var i=0;i<this.subitem.length;i++){
          if(!this.subitem[i].itemquestion){
            this.$message({
              type: 'warning',
              message: '请完成子题题干的设置'
            })
            return
          }
          if(!this.subitem[i].answer && this.subitem[i].answer!=0){
            this.$message({
              type: 'warning',
              message: '请完成子题正确答案的设置'
            })
            return
          }
          if(this.subitem[i].cateid==1 || this.subitem[i].cateid==2){
            if(this.subitem[i].cateid==2){//多选
              var answerstr=''
              for(index in this.subitem[i].answer){
                answerstr+=this.subitem[i].answer[index]
              }
              this.subitem[i].answer=answerstr
            }
            for(var j=0;j<this.subitem[i].questionitem.length;j++){
              this.subitem[i].questionitem[j].itemname=methods.numtocase(j)
              if(this.subitem[i].questionitem[j].content==''){
                this.$message({
                  type: 'warning',
                  message: '请完成选项内容输入'
                })
                return
              }
            }
          }
        }
        if(this.seldiscipline==''){
          this.$message({
            type: 'warning',
            message: '请选择组合题所属学科'
          })
          return
        }
        var data={
          command:'question/addassociationquestion',
          sessionid:$.cookie('sid'),
          loginid:$.cookie('uid'),
          creatorid:$.cookie('uid'),
          name:this.qname,
          courseid:this.seldiscipline,
          subitem:this.subitem,
        }
        var self=this
        function callback(res){
          self.$confirm('添加题目成功', '提示', {
            confirmButtonText: '继续添加',
            cancelButtonText: '不再添加',
            type: 'success'
          }).then(function(){
            window.location.reload()
          }).catch(function(){
              window.history.go(-1)
          })
        }
        xhttp.post('/question/addassociationquestion',data,callback,xhttp.errcodefn,xhttp.errfn)
      },
      deleteoneq:function(index){//删除一个子题
        var self=this
        self.$confirm('确定要去掉这个子题吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function(){
          self.subitem=methods.deleteItem(self.subitem,index)
        }).catch(function(){

        })
      }
    }
  }

</script>
<style lang="scss">
  @import "../../assets/css/common.css";
  @import "../../assets/css/addqcommon.css";
  .setlabel{
    width:100px;
  }
  .setcontent{
    min-width:220px;
  }
  .zuhehandler{
    padding-top:20px;
  }
  .oneq{
    border:1px solid #ddd;
    padding:0 10px 20px 10px;
    margin:10px 0;
  }
  .oneq>div{
    position:relative;
  }
  .deleteoneq{
    position:absolute;
    top:10px;
    left:140px;
  }
</style>
