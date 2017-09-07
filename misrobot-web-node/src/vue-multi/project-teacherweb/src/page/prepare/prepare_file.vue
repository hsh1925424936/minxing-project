<template>
  <div class="rel">
    <el-tabs v-model="activeName">
      <el-tab-pane label="全部文件" :name="status == 1 ? 'second' : 'first'">
        <!--<el-button @click="currentPage=1 && getfilelist(-1,1,0,null)" type="success" size="small" class="ml10">返回主目录</el-button>-->
        <div class="flex m10">
          <el-menu default-active="1" class="el-menu-vertical-demo" @select="getfiletype">
            <el-menu-item index="1"><i class="el-icon-menu"></i>全部</el-menu-item>
            <el-menu-item index="2"><i class="el-icon-menu"></i>文档</el-menu-item>
            <el-menu-item index="3"><i class="el-icon-menu"></i>图片</el-menu-item>
            <el-menu-item index="4"><i class="el-icon-menu"></i>视频</el-menu-item>
            <el-menu-item index="5"><i class="el-icon-menu"></i>其它</el-menu-item>
          </el-menu>

          <el-table :data="tableDataAll" style="width: 100%" stripe>
            <el-table-column label="文件名称" min-width="185">
              <template scope="scope">
                <p class="flex_center_v cp" @dblclick.prevent="getfilelist(-1,1,scope.row.id,null)">
                  <span class="fileimg mr10 fileimg_default"
                        :class="{
                        fileimg_box:scope.row.fileClass==100,
                        fileimg_sp:scope.row.fileClass==1,
                        fileimg_yp:scope.row.fileClass==2,
                        fileimg_jpg:scope.row.fileClass==3,
                        fileimg_ppt:scope.row.suffix=='.pptx',
                        fileimg_doc:scope.row.suffix=='.doc' || scope.row.suffix=='.docx',
                        fileimg_excel:scope.row.suffix=='.xls' || scope.row.suffix=='.xlsx',
                        fileimg_pdf:scope.row.suffix=='.pdf',
                        fileimg_txt:scope.row.suffix=='.txt',
                        fileimg_rar:scope.row.suffix=='.rar' || scope.row.suffix=='.zip'
                        }"
                  ></span>
                  <span>{{scope.row.filename}}</span>
                </p>
              </template>
            </el-table-column>
            <el-table-column label="上传人" width="180">
              <template scope="scope">
                {{uname}}
              </template>
            </el-table-column>
            <el-table-column prop="updateat" label="修改日期"></el-table-column>
            <el-table-column prop="size" label="大小"></el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                  <!--<el-checkbox v-if="scope.row.status==1" disabled :value="true" @change="checkchange($event,scope.row.id)">已加入</el-checkbox>-->
                  <el-checkbox  v-model="scope.row._status" @change="checkchange($event,scope.row.id)">
                      <span v-if="scope.row._status==false">加入备课</span>
                      <span v-else>已加入</span>
                  </el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagebox">
          <el-pagination layout="prev, pager, next" :total="pagetotalnum" @current-change="topage" :current-page.sync="currentPage"></el-pagination>
        </div>
      </el-tab-pane>

      <el-tab-pane :label="selnumtext" :name="status == 1 ? 'first' : 'second'" class="m10">
        <!-- <el-button @click="currentPagesel=1 && getfilelistsel(1,0,null)" type="success" size="small" class="mb10">返回主目录</el-button> -->
        <el-table :data="tableDataSel" ref="multipleTable" style="width: 100%" stripe>
          <el-table-column label="文件名称" min-width="185">
            <template scope="scope">
              <p class="flex_center_v cp" @dblclick.prevent="getfilelistsel(1,scope.row.id,null)">
                  <span class="fileimg mr10 fileimg_default"
                        :class="{
                        fileimg_box:scope.row.file_class==100,
                        fileimg_sp:scope.row.file_class==1,
                        fileimg_yp:scope.row.file_class==2,
                        fileimg_jpg:scope.row.file_class==3,
                        fileimg_ppt:scope.row.file_suffix=='.pptx',
                        fileimg_doc:scope.row.file_suffix=='.doc' || scope.row.file_suffix=='.docx',
                        fileimg_excel:scope.row.file_suffix=='.xls' || scope.row.file_suffix=='.xlsx',
                        fileimg_pdf:scope.row.file_suffix=='.pdf',
                        fileimg_txt:scope.row.file_suffix=='.txt',
                        fileimg_rar:scope.row.file_suffix=='.rar' || scope.row.file_suffix=='.zip'
                        }"
                  ></span>
                <span>{{scope.row.name}}</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="上传人" width="180">
            <template scope="scope">
              {{uname}}
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="修改日期"></el-table-column>
          <el-table-column prop="file_size" label="大小"></el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button type="warning" size="small" @click="canceladd(scope.row.id)">取消加入</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagebox">
          <el-pagination layout="prev, pager, next" :total="pagetotalnumsel" @current-change="topagesel" :current-page.sync="currentPagesel"></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="search">
        <el-button type="text" @click="touploadfile()" class="mr20">若文件库中没有想要的文件，点此上传文件</el-button>
      <el-input placeholder="搜索您的文件" icon="search" v-model="searchfile" :on-icon-click="handleIconClick"></el-input>
    </div>
  </div>
</template>

<script>
  import methods from '../../assets/js/methods'
  import xhttp from '../../assets/js/http'
  export default {
    data() {
      return {
        uname: $.cookie('name'),//用户名
        activeName: 'first',
        //所有文件
        tableDataAll: [],
        //已选文件
        tableDataSel: [],
        addedfile:[],
        selnum:0,
        //搜索文件
        searchfile:'',
        //分页
        pagetotalnum:0,
        currentPage:1,
        pagetotalnumsel:0,
        currentPagesel:1
      }
    },
     props:['status'],
    components: {},
    created() {
    },
    mounted () {
      var self=this
      //设置已选文件为全部选中
      this.getfilelist(-1,1,0,null)
      this.getfilelistsel(1,0,null)
    },
    watch:{
      'activeName'(val,oldval){
        if(val=='first'){
          this.getfilelist(-1,1,0,null)
           this.getfilelistsel(1,0,null)
        }else{
            this.getfilelist(-1,1,0,null)
          this.getfilelistsel(1,0,null)
        }
      },
      'currentPage'(val,oldval){
        this.getfilelist(-1,val,0,null)
      },
      'currentPagesel'(val,oldval){
        this.getfilelistsel(val,0,null)
      }
    },
    computed:{
      selnumtext(){
        return '已选（'+this.selnum+'）'
      }
    },
    methods: {
      handleIconClick(e){//搜索框
        if(this.activeName=='first'){
          this.getfilelist(-1,1,0,this.searchfile)
        }else{
          this.getfilelistsel(1,0,this.searchfile)
        }
      },
      getfiletype(index){//根据文件类型筛选
        if(index==1){//全部
          this.getfilelist(-1,1)
        }else if(index==2){//文档
          this.getfilelist(4,1)
        }else if(index==3){//图片
          this.getfilelist(3,1)
        }else if(index==4){//视频
          this.getfilelist(1,1)
        }else{//其它
          this.getfilelist(0,1)
        }
      },
      canceladd(itemid){
        var self=this
        var data={
          command:'pre/joinprepschedule',
          sessionid: $.cookie('sid'),
          loginid:$.cookie('uid'),
          teacherid:$.cookie('uid'),
          preid:itemid,
          pretype:0,
          scheduleid:$.cookie('prescheduleid'),
          status:0
        }
        function callback(res){
          self.getfilelistsel(1,0,null)
        }
        xhttp.post('/pre/joinprepschedule',data,callback,xhttp.errcodefn,xhttp.errfn)
      },
      checkchange(event,itemid){//多选勾选
        if($(event.target).is(':checked')){//加入备课
          this.addtocourse(itemid,0, $.cookie('prescheduleid'),1)
        }else{//取消加入
          this.addtocourse(itemid,0, $.cookie('prescheduleid'),0)
        }
      },
      getfilelist(type,pagenum,parentid,searchname){//查询全部文件
        var self=this
        var data={
          command:'pre/schedulefilelist',
          sessionid: $.cookie('sid'),
          loginid:$.cookie('uid'),
          uid:$.cookie('uid'),
          scheduleid:$.cookie('prescheduleid'),
          reqnum:10,
          page:pagenum,
          file_class:type,//-1:全部，0：其它，1：视频，2：音屏，3：图片，4：文档
          filestatus:0,
          parent_id:0,
        }
        if(parentid){
          data.parent_id=parentid
        }
        if(searchname){
          data.key_word=searchname
        }
        function callback(res){
          self.tableDataAll = [];
          $(res.filelist).each(function (i,el) {
              res.filelist[i]._status = el.status==1?true:false;
              self.tableDataAll.push(res.filelist[i]);
          });
          self.pagetotalnum=parseInt(res.totalnum);
        }
        xhttp.post('/pre/schedulefilelist',data,callback,xhttp.errcodefn,xhttp.errfn)
      },
      getfilelistsel(page,parentid,searchname){//查询已加入的文件
        var self=this
        var data={
          command:'pre/queryselectedfile',
          sessionid: $.cookie('sid'),
          loginid:$.cookie('uid'),
          uid:$.cookie('uid'),
          scheduleid:$.cookie('prescheduleid'),
          reqnum:10,
          page:page,
          fileclass:-1
        }
        if(parentid){
          data.parent_id=parentid
        }
        if(searchname){
          data.key_word=searchname
        }
        function callback(res){
          self.tableDataSel=res.list
          self.selnum=res.count
          self.pagetotalnumsel=parseInt(res.count)
        }
        xhttp.post('/pre/queryselectedfile',data,callback,xhttp.errcodefn,xhttp.errfn)
      },
      topage(num){
        this.currentPage=num
      },
      topagesel(num){
        this.currentPagesel=num
      },
      touploadfile(){
        this.$router.push({
          name:'filemanage',
          query:{
            tosubmitfile:true
          }
        })
      },
      addtocourse(itemid,itemtype,scheduleid,handler){//itemid:待加入的文件id，itemtype:待加入文件类型（0：文件，1：题目，2：试卷）handler:（0：取消，1：加入）
        var self=this
        var data={
          command:'pre/joinprepschedule',
          sessionid: $.cookie('sid'),
          loginid:$.cookie('uid'),
          teacherid:$.cookie('uid'),
          preid:itemid,
          pretype:itemtype,
          scheduleid:scheduleid,
          status:handler
        }
        function callback(res){
            self.getfilelistsel(1,0,null)
        }
        xhttp.post('/pre/joinprepschedule',data,callback,xhttp.errcodefn,xhttp.errfn)
      }
    },

  }

</script>
<style lang="scss">
  @import "../../assets/css/common.css";
  .flyimage{
    width:10px;
    height:10px;
    border-radius: 50%;
    background-color: red;
  }
  .search{
    position:absolute;
    top:2px;
    right:10px;
    display:flex;
    align-items: center;
    width:550px;
  }
  .pagebox{
    display:flex;
    justify-content: flex-end;
    padding:10px;
  }
  /*文件类型图标*/
  .fileimg{
    width:20px;
    height:20px;
    background-size:100%;
    background-repeat: no-repeat;
  }
  .fileimg_box{
    background-image: url('../../assets/img/fd.png')!important;
  }
  .fileimg_ppt{
    background-image: url('../../assets/img/pptimg.png')!important;
  }
  .fileimg_doc{
    background-image: url('../../assets/img/doc.png')!important;
  }
  .fileimg_excel{
    background-image: url('../../assets/img/Excel.png')!important;
  }
  .fileimg_jpg{
    background-image: url('../../assets/img/jpgimg.png')!important;
  }
  .fileimg_pdf{
    background-image: url('../../assets/img/pdf.png')!important;
  }
  .fileimg_sp{
    background-image: url('../../assets/img/sp.png')!important;
  }
  .fileimg_yp{
    background-image: url('../../assets/img/yinping.png')!important;
  }
  .fileimg_txt{
    background-image: url('../../assets/img/txt.png')!important;
  }
  .fileimg_rar{
    background-image: url('../../assets/img/rarimg.png')!important;
  }
  .fileimg_default{
    background-image: url('../../assets/img/default.png');
  }
</style>
