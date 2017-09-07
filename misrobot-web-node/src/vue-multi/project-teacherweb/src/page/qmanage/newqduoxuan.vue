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
    <cmain :title="'选项'">
      <ul class="addoptions maincontent">
        <li v-for="(value,index) in options">
          <span class="itemname">{{ index | numtoa }}</span>
          <el-input placeholder="输入选项内容，300字以内" v-model="value.inputtext" :maxlength='qcontentmax'></el-input>
          <b @click="addoption()" v-if="value.handler=='add'" class="el-icon-plus optionhandler"></b>
          <b v-else @click="deleteoption(index)" class="el-icon-minus optionhandler"></b>
        </li>
      </ul>
    </cmain>
    <cmain :title="'正确答案'">
      <div class="maincontent">
        <el-checkbox-group v-model="answer">
          <el-checkbox :label="index | numtoa" v-for="(value,index) in options">{{ index | numtoa }}</el-checkbox>
        </el-checkbox-group>
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
        qcontentmax:300,
        answer:[],//['C','D','E']
        qname:'',
        disciplinelist:[],//学科列表
        seldiscipline:'',
        pagetitletext:'新增题目-多选题',//页面标题
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
        numtoaArr:['A','B','C','D','E','F','G','H'],
        picturelist:[],
        isshowfile:false,
        showfile:'',
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
      this.gettree()
      this.gettags()
        if(this.$route.query.qid){
            this.pagetitletext='编辑题目-多选题';
            this.action='edit'
            this.editqid=this.$route.query.qid
            var self=this
            var data={
                command:'question/querysinglequestion',
                sessionid: $.cookie('sid'),
                loginid:$.cookie('uid'),
                questionbaseid:this.editqid
            }
            function callback(res){
                self.qname=res.name
                self.answer=[]
                for(var i=0;i<res.answer.length;i++){
                    self.answer.push(res.answer[i])
                }
                self.options=res.questionitem
                self.options=[]
                if(res.questionitem){
                  for(var i=0;i<res.questionitem.length;i++){
                      self.options.push({
                          inputtext:res.questionitem[i].content,
                          handler:'delete'
                      })
                  }
                  self.options[0].handler='add'
                }
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
          var format = arr[arr.length-1].toLowerCase();
          if(format=='png' || format=='bmp' || format=='gif' || format=='jpg' || format=='jpeg'){
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
            this.categoryid=data.value
            this.categoryname = data.name;
        },
      addoption(){//增加选项
        if(this.options.length>=8){
          this.$message({
            type: 'warning',
            message: '最多添加8个选项'
          })
          return
        }
        this.options.push({
          inputtext:'',
          handler:'delete'
        })
      },
      deleteoption(index){//删除选项
        console.log(index)
        var self=this
        if(this.options.length<=1){
          this.$message({
            type: 'warning',
            message: '最少要有1个选项'
          })
          return
        }
        var preLength = this.options.length;
        self.options=methods.deleteItem(self.options,index)
        for( var i = 0; i < this.answer.length; i++ ){
          if(this.answer[i] == this.numtoaArr[preLength-1]){
            this.answer.splice(i,1);
          }
        }

      },
      submitnewq(){//保存添加题目接口
        if(this.qname==''){
          this.$message({
            type: 'warning',
            message: '请输入题干内容'
          })
          return
        }
        for(var index in this.options){
          if(this.options[index].inputtext==''){
            this.$message({
              type: 'warning',
              message: '请完成选项内容输入'
            })
            return
          }
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
          cateid:2,
          answer:this.answer.sort().join(""),
          questionitem:[],
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
        }else{
          data.picturelist = [];
        }
        for(var i=0;i<this.options.length;i++){
          data.questionitem.push({
            itemname:methods.numtocase(i),
            content:this.options[i].inputtext,
          })
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
            for(var index in this.options){
                if(this.options[index].inputtext==''){
                    this.$message({
                        type: 'warning',
                        message: '请完成选项内容输入'
                    })
                    return
                }
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
                questiontypeid:2,
                answer:this.answer.sort().join(""),
                selectoranswerlist:[],
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
            for(var i=0;i<this.options.length;i++){
                data.selectoranswerlist.push({
                    answernum:methods.numtocase(i),
                    content:this.options[i].inputtext,
                })
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
