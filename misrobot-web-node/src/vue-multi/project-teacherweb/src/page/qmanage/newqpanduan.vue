<template>
  <div class="container">
    <cpagetitle :title="pagetitletext" :showback="true"></cpagetitle>
    <cmain :title="'题目名称'">
      <div class="maincontent">
        <el-input type="textarea" placeholder="输入题目名称,500字以内" v-model="qname" :maxlength='qtitlemax'></el-input>

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
    <cmain :title="'正确答案'">
      <div class="maincontent">
        <el-radio class="radio" v-model="answer" label="0">正确</el-radio>
        <el-radio class="radio" v-model="answer" label="1">错误</el-radio>
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
    <cfooter :submitnewq="submitnewq" :action="action" :editq="editq"></cfooter>
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
        options:[{inputtext:'',handler:'add'},{inputtext:'',handler:'delete'},{inputtext:'',handler:'delete'},{inputtext:'',handler:'delete'},{inputtext:'',handler:'delete'}],
        qtitlemax:500,
        qcontentmax:100,
        answer:'',
        qname:'',
        disciplinelist:[],//学科列表
        seldiscipline:'',
        pagetitletext:'新增题目-判断题',//页面标题
        fileList: [],
        fileuri:[],
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
        action:'new',
        editqid:'',
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
        if(this.$route.query.qid){
            this.editqid=this.$route.query.qid
            this.action='edit';
            this.pagetitletext='编辑题目-判断题';
            var self=this
            var data={
                command:'question/querysinglequestion',
                sessionid: $.cookie('sid'),
                loginid:$.cookie('uid'),
                questionbaseid:this.editqid
            }
            function callback(res){
                self.qname=res.name
                self.answer=res.answer
                self.options=res.questionitem
                self.options=[]
                // for(var i=0;i<res.questionitem.length;i++){
                //     self.options.push({
                //         inputtext:res.questionitem[i].content,
                //         handler:'delete'
                //     })
                // }
                // self.options[0].handler='add'
                self.systagsel=[]
                for(var i in res.lablist){
                    self.systagsel.push(res.lablist[i].id)
                }
                self.picturelist=res.picturelist || [];
                self.dificulty=res.difficult
                self.categoryid=res.categoryid || -100;
                self.categoryname = res.categoryname;
            }
            xhttp.post('/question/querysinglequestion',data,callback,xhttp.errcodefn,xhttp.errfn)
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
            message: '请设置正确答案'
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
        var data={
          command:'question/addquestioninfo',
          sessionid:$.cookie('sid'),
          loginid:$.cookie('uid'),
          creatorid:$.cookie('uid'),
          name:this.qname,
          cateid:4,
          answer:this.answer,
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
        var self=this
        function callback(res){
          self.$confirm('添加题目成功', '提示', {
            confirmButtonText: '继续添加',
            cancelButtonText: '不再添加',
            type: 'success'
          }).then(function(){
            window.location.reload()
          }).catch(function(){
            self.$router.push({
                name:'qlist',
                query:{
                    querymy:true
                }
            })
          })
        }
        xhttp.post('/question/addquestioninfo',data,callback,xhttp.errcodefn,xhttp.errfn)
      },
        editq(){
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
                    message: '请设置正确答案'
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

            var data={
                command:'question/updatetheoryquestion',
                sessionid:$.cookie('sid'),
                loginid:$.cookie('uid'),
                createuid:$.cookie('uid'),
                questionname:this.qname,
                questiontypeid:4,
                answer:this.answer,
                difficult:this.dificulty,//难度
                lablist:arrtemp,//标签列表
                categoryid:this.categoryid,//类别id
                id:this.editqid
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
            var self=this
            function callback(res){
                self.$message({
                    type: 'success',
                    message: '保存修改成功'
                })
                self.$router.push({
                    name:'qlist'
                })
            }
            xhttp.post('/question/updatetheoryquestion',data,callback,xhttp.errcodefn,xhttp.errfn)
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
<style lang="scss">
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
