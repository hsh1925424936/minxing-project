<template>
  <div class="container">
    <cpagetitle :title="pagetitletext" :showback="true"></cpagetitle>
    <cmain :title="'题目名称'">
      <div class="maincontent">
        <el-input type="textarea" placeholder="输入题目名称,1000字以内" v-model="qname" :maxlength='qtitlemax'></el-input>

        <el-upload
          class="upload-demo mt10"
          action="/file/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="fileList"
          :before-upload="handleBeforeUpload">
          <el-button size="small" type="primary">上传附件</el-button>
          <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
        </el-upload>
      </div>
    </cmain>
    <cmain :title="'附件'" v-if="action=='edit' && picturelist.length>0">
      <div class="maincontent">
        <a target="_blank" :href="value.filepath" v-if="ispicture(value.attrvalue)"
          class="preview" v-for="(value,index) in picturelist">
          <img :src="value.filepath"/>
        </a>
        <span v-if="!ispicture(value.attrvalue)" v-for="(value,index) in picturelist"
            @click="showMyFile(value.filepath)" style="cursor:pointer;">
            {{getfilename(value.attrvalue)}}
        </span>
      </div>
    </cmain>
    <cmain :title="'题目描述'">
      <div class="maincontent">
        <el-input type="textarea" placeholder="输入题目描述,1000字以内" v-model="answer" :maxlength='qtitlemax'></el-input>
      </div>
    </cmain>

    <cmain :title="'设置'">
      <div class="maincontent">
        <ul>
          <li class="flex">
            <span class="setlabel">难度：</span>
            <div class="setcontent">
              <el-rate v-model="dificulty"></el-rate>
            </div>
          </li>
          <li class="flex mt10">
            <span class="setlabel">训练项：</span>
            <div class="setcontent">
              <el-select v-model="learnidsel" placeholder="请选择训练项">
                <el-option
                  v-for="item in learnlist"
                  :key="item.learnid"
                  :label="item._name"
                  :value="item.learnid">
                </el-option>
              </el-select>
            </div>
          </li>
          <li class="flex mt10">
            <span class="setlabel">系统标签：</span>
            <div class="setcontent">
              <el-select v-model="systagsel" multiple placeholder="请选择系统标签">
                <el-option
                  v-for="item in systag"
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
                <span style="padding-bottom:10px;" v-if="categoryname">{{categoryname}}</span>
                <el-tree
                    :data="treedata"
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                    highlight-current
                    accordion
                    node-key="value"
                    :default-expanded-keys="[categoryid]"
                >
                </el-tree>
            </div>
          </li>
        </ul>
      </div>
    </cmain>
    <el-dialog title="文件查看" :visible.sync="isshowfile">
      <video class="qvideo"
        :src="showfile"
        loop autoplay controls v-if="isshowfile"
      />
    </el-dialog>
    <div class="flex_center mt20">
      <div>
        <el-button type="primary" @click="submitnewq()">添加评分表</el-button>
        <router-link to="qlist">
          <el-button>取消</el-button>
        </router-link>
      </div>
    </div>
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
        action:'',
        options:[{inputtext:'',handler:'add'},{inputtext:'',handler:'delete'},{inputtext:'',handler:'delete'},{inputtext:'',handler:'delete'},{inputtext:'',handler:'delete'}],
        qtitlemax:1000,
        qcontentmax:100,
        answer:'',
        qname:'',
        seldiscipline:'',
        pagetitletext:'新增题目-操作题',//页面标题
        fileList: [],
        fileuri:'',
        //难度
        dificulty:null,//type:number
        //系统标签
        systag:[],
        systagsel:[],
        options4: [],
        value9: [],
        list: [],

        //树形控件
        treedata: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        categoryid:-100,
        categoryname:'',
        //训练项
        learnlist:[],
        learnidsel:'',

        picturelist:[],
        isshowfile:false,
        showfile:'',
      }
    },
    components: {
      cmain,
      cpagetitle,
      cfooter
    },
    mounted () {
      this.gettree()
      this.gettags()
      this.querylearnlist()
      if(this.$route.query.qid){
        this.action = 'edit';
        this.pagetitletext='编辑题目-操作题';
        var self=this
        var data={
          command:'question/queryoprquestion',
          sessionid: $.cookie('sid'),
          loginid:$.cookie('uid'),
          questionbaseid:this.$route.query.qid
        }
        function callback(res){
          self.qname=res.name
          self.answer=res.comment
          self.systagsel=[]
          for(var i in res.lablist){
            self.systagsel.push(res.lablist[i].id)
          }
          self.dificulty=res.difficult
          self.categoryid=res.categoryid || -100;
          self.categoryname = res.categoryname;
          self.learnidsel=res.learnid;
          self.picturelist=res.picturelist || [];
        }
        xhttp.post('/question/queryoprquestion',data,callback,xhttp.errcodefn,xhttp.errfn)
      }
    },

    methods: {
        showMyFile(url){
          this.isshowfile = true;
          this.showfile = url;
        },
        getfilename(url){
          var arr = url.split("/");
          return arr[arr.length-1];
        },
        ispicture(name){//判断是否图片
          var arr = name.split(".");
          var format = arr[arr.length-1];
          if(format=='png' || format=='PNG' || format=='bmp' || format=='BMP' || format=='gif' || format=='GIF' || format=='jpg' || format=='JPG' || format=='jpeg' || format=='JPEG'){
            return true;
          }else{
            return false;
          }
        },
        handleBeforeUpload(file){
          if(this.isloading){
            this.$message.error('正在上传，请稍候!');
            return false;
          }

          var status = true;
          var this_type = file.type.split('/')[0];
          if(this.fileuri.length > 0){//当上传的文件不是第一个时,做判断
            //图片6个 image  视频一个 video  音频一个 audio
            if( this_type==this.fileuri[0].raw.type.split('/')[0] && this_type=='image' && this.fileuri.length<6 ){
              this.isloading = true;
            }else{
              status = false;
            }
          }else if( this_type == 'image' || this_type == 'video' || this_type == 'audio' ){
            this.isloading = true;
          }else{
            status = false;
          }
          if(!status){
            this.$message.error('只能上传图片，视频或音频中的一种文件类型（图片不能超过6个，视频或音频只能1个）!');
          }
          return status;
        },
        handleRemove(file, fileList) {
          this.fileuri=fileList.slice(0);
          this.isloading = false;
        },
        handlePreview(file) {

        },
        handleSuccess(response, file, fileList){
          this.fileuri=fileList.slice(0);
          this.isloading = false;
        },
        handleNodeClick(data){
            this.categoryid=data.value;
            this.categoryname = data.name;
        },
      submitnewq(){//保存添加题目接口
        if(this.qname==''){
          this.$message({
            type: 'warning',
            message: '请输入题干内容'
          })
          return
        }
        if(this.answer==''){
          this.$message({
            type: 'warning',
            message: '请输入题目描述'
          })
          return
        }
        if(this.categoryid==-100 || this.categoryid==1){
          this.$message({
            type: 'warning',
            message: '请选择题目所属类别'
          })
          return
        }
        if(this.systagsel.length!=0){
          var arrtemp=this.systagsel.map(function(item){
            return {id:item}
          })
        }else{
          this.$message({
            type: 'warning',
            message: '请选择题目系统标签'
          })
          return
        }
        var data;
        if(this.$route.query.qid){//更新
          data = {
            command:'question/modifyoperationquestioninfo',
            sessionid: $.cookie('sid'),
            loginid:$.cookie('uid'),
            questionname:this.qname,
            description:this.answer,
            difficult:this.dificulty,//难度
            createuid:$.cookie('uid'),
            questiontypeid:7,
            usetype:3,
            learnid:this.learnidsel,
            categoryid:this.categoryid,//类别id
            id:this.$route.query.qid,
            lablist:arrtemp,//标签列表
          }
          if(this.fileuri.length>0){
            var tempfilelist=[]
            for(var i=0;i<this.fileuri.length;i++){
              tempfilelist.push({
                num:i+1,
                attrvalue:this.fileuri[i].response.data.uri
              })
            }
            data.picturelist=tempfilelist
          }else{
              data.picturelist=this.picturelist || [];
          }
        }else{//新增
          data={
            command:'question/addoperationquestion',
            sessionid: $.cookie('sid'),
            loginid:$.cookie('uid'),
            creatorid:$.cookie('uid'),
            name:this.qname,
            comment:this.answer,
            learnid:this.learnidsel,
            type:3,
            cateid:7,
            difficult:this.dificulty,//难度
            lablist:arrtemp,//标签列表
            categoryid:this.categoryid//类别id
          }
          if(this.fileuri){
            var tempfilelist=[]
            for(var i=0;i<this.fileuri.length;i++){
              tempfilelist.push({
                num:i+1,
                attrvalue:this.fileuri[i].response.data.uri
              })
            }
            data.picturelist=tempfilelist
          }
        }

        var self=this
        function callback(res){
          if(self.$route.query.qid){//更新
            self.$router.push({
              path:'/qmanage/judgetable',
              query:{
                qid:res.id,
                isedit:1,
              }
            })
          }else{//新建
            self.$router.push({
              path:'/qmanage/judgetable',
              query:{
                qid:res.id
              }
            })
          }

        }
        if(this.$route.query.qid){//更新
          xhttp.post('/question/modifyoperationquestioninfo',data,callback,xhttp.errcodefn,xhttp.errfn)
        }else{
          xhttp.post('/question/addoperationquestion',data,callback,xhttp.errcodefn,xhttp.errfn)
        }
      },
      querylearnlist(){
        var self=this
        var data={
          command:'learn/querylearninfo',
          sessionid: $.cookie('sid'),
          loginid:$.cookie('uid'),
        }
        function callback(res){
          self.learnlist=res.learnids.map((item)=>{
            var obj = item
              if(obj.type == 0){
                obj._name = obj.name + "--在线训练"
              }else if (obj.type == 1) {
                obj._name = obj.name + "--模型"
              }else if (obj.type == 2) {
                obj._name = obj.name + "--智能设备"
              }else if (obj.type == 3) {
                obj._name = obj.name + "--出科训练"
              }else{
                  obj._name = obj.name
              }
            return obj;
          })
        }
        xhttp.post('/learn/querylearninfo',data,callback,xhttp.errcodefn,xhttp.errfn)
      },
      gettree(){
        var self=this
        var data={
          command:'question/questioncategorytree',
          sessionid: $.cookie('sid'),
          loginid:$.cookie('uid'),
        }
        function callback(res){
          self.treedata=res.children;
        }
        xhttp.post('/question/questioncategorytree',data,callback,xhttp.errcodefn,xhttp.errfn)
      },
      gettags(){
        var self=this
        var data={
          command:'question/querylablist',
          sessionid: $.cookie('sid'),
          loginid:$.cookie('uid'),
        }
        function callback(res){
          self.systag=res.lablist
        }
        xhttp.post('/question/querylablist',data,callback,xhttp.errcodefn,xhttp.errfn)
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import "../../assets/css/common.css";
  @import "../../assets/css/addqcommon.css";
  .setlabel{
    width:100px;
  }
  .setcontent{
    min-width:220px;
  }
  .preview{
    height:50px; margin-right:10px; width:50px;
  }
  .preview img{
    height:100%; width:100%;
  }
  .qvideo{
    width:100%; height:100%;
  }
</style>
