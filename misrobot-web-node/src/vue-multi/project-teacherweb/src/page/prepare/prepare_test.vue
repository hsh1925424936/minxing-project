<template>
  <div class="rel" id="test">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部试卷" name="first">
        <div class="ml10">
          <el-select v-model="selcoursename" placeholder="适用课程">
            <el-option v-for="item in options" :key="item.courseid" :label="item.coursename" :value="item.courseid"></el-option>
          </el-select>
        </div>
        <div class="m10">
          <el-table :data="tableDataAll" style="width: 100%" stripe>
            <el-table-column label="试卷名称" min-width="185">
              <template scope="scope">
                <div class="flex_center_v">
                  <div class="r bgzise" style="margin:0">理</div>
                  <span style="margin-left: 10px">{{ scope.row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="coursename" label="适用课程" min-width="185"></el-table-column>
            <el-table-column prop="updateat" label="修改日期"></el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                  <!--<el-checkbox v-if="scope.row.status==1" disabled :value="true" @change="checkchange($event,scope.row.id)">已加入</el-checkbox>-->
                  <el-checkbox v-model="scope.row._status" @change="checkchange($event,scope.row.id)">
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
      <el-tab-pane :label="selnumtext" name="second">
        <div class="ml10">
          <el-select v-model="selcoursenamesel" placeholder="适用课程">
            <el-option v-for="item in options" :key="item.courseid" :label="item.coursename" :value="item.courseid"></el-option>
          </el-select>
        </div>
        <div class="m10">
          <el-table :data="tableDataSel" ref="multipleTable" style="width: 100%" stripe @selection-change="selchangesel">
            <el-table-column label="试卷名称" min-width="185">
              <template scope="scope">
                <div class="flex_center_v">
                  <div class="r bgzise" style="margin:0">理</div>
                  <span style="margin-left: 10px">{{ scope.row.papername }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="coursename" label="适用课程" min-width="185"></el-table-column>
            <el-table-column prop="updatetime" label="修改日期"></el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button type="warning" size="small" @click="canceladd(scope.row.id)">取消加入</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagebox">
          <el-pagination layout="prev, pager, next" :total="pagetotalnumsel" @current-change="topagesel" :current-page.sync="currentPagesel"></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="search">
      <div class="mr20">
          <el-button type="text" @click="tonewpaper()">若无试卷，点此创建试卷</el-button>
      </div>
      <el-input placeholder="输入试卷关键字进行查询" icon="search" v-model="searchfile" :on-icon-click="handleIconClick"></el-input>
    </div>
  </div>
</template>

<script>
  import methods from '../../assets/js/methods'
  import xhttp from '../../assets/js/http'
  export default {
    data() {
      return {
        activeName: 'first',
        searchfile:'',
        //全部
        tableDataAll: [],
        //已选
        tableDataSel: [],
        checkedtest:[],
        addedfile:[],
        selnum:0,
        //两个select
        options: [],
        selcoursename: -100,
        selcoursenamesel:-100,
        //分页
        pagetotalnum:0,
        currentPage:1,
        pagetotalnumsel:0,
        currentPagesel:1

      }
    },
    components: {},
    computed:{
      selnumtext(){
        return '已选（'+this.selnum+'）'
      }
    },
    watch:{
      'activeName'(val,oldval){
        if(val=='first'){
          this.getpaperlistall(1,10,this.searchfile,this.selcoursename)
        }else{
          this.getpaperlistsel(1,10,this.searchfile,this.selcoursenamesel)
        }
      },
      'selcoursename'(val,oldval){
        this.getpaperlistall(1,10,null,val)
      },
      'selcoursenamesel'(val,oldval){
        this.getpaperlistsel(1,10,null,val)
      },
      'currentPage'(val,oldval){
        this.getpaperlistall(val,10,this.searchfile,this.selcoursename)
      },
      'currentPagesel'(val,oldval){
        this.getpaperlistsel(val,10,this.searchfile,this.selcoursenamesel)
      }
    },
    mounted () {
      var self=this
      //设置已选文件为全部选中
      for(var i in this.tableDataSel){
        this.$refs.multipleTable.toggleRowSelection(this.tableDataSel[i]);
      }
      this.getpaperlistall(1,10,null,-100)
      this.getcoursenamelist()
      this.getpaperlistsel(1,10)
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      handleIconClick(e){
        if(this.activeName=='first'){
          this.getpaperlistall(this.currentPage,10,this.searchfile,this.selcoursename)
        }else{
          this.getpaperlistsel(this.currentPagesel,10,this.searchfile,this.selcoursename)
        }
      },
      selchangesel(selection){
        console.log(selection)
      },
      checkchange(event,itemid){
        if($(event.target).is(':checked')){//加入备课
          this.addtocourse(itemid,2, $.cookie('prescheduleid'),1)
        }else{//取消加入
          this.addtocourse(itemid,2, $.cookie('prescheduleid'),0)
        }
      },
      getpaperlistall(page,reqnum,papername,course){//查询随堂小测列表
        var self=this
        var data={
          command:'pre/schedulepaperlist',
          sessionid: $.cookie('sid'),
          loginid:$.cookie('uid'),
          teacherid:$.cookie('uid'),
          scheduleid:$.cookie('prescheduleid'),
          pagenum:page,
          pagesize:reqnum,
          status:2,
        }
        if(papername){
          data.name=papername
        }
        if(course && course!=-100){
          data.courseid=course
        }
        function callback(res){
          self.tableDataAll=res.paperList.map(function(item){
            var obj=item
            if(obj.updateat!=null && obj.updateat!='null'){
              obj.updateat=obj.updateat.slice(0,16);
              obj._status = obj.status==1?true:false;
            }
            return obj
          })

          self.pagetotalnum=res.totalcount
        }
        xhttp.post('/pre/schedulepaperlist',data,callback,xhttp.errcodefn,xhttp.errfn)
      },
      getpaperlistsel(page,reqnum,papername,course){//查询已选随堂小测列表
        var self=this
        var data={
          command:'pre/queryselectedpaper',
          sessionid: $.cookie('sid'),
          loginid:$.cookie('uid'),
          teacherid:$.cookie('uid'),
          page:page,
          reqnum:reqnum,
          scheduleid:$.cookie('prescheduleid')
        }
        if(papername){
          data.name=papername
        }
        if(course && course!=-100){
          data.courseid=course
        }
        function callback(res){
          self.tableDataSel=res.paperlist.map(function(item){
            var obj=item
            if(obj.updatetime!=null && obj.updatetime!='null') {
              obj.updatetime = obj.updatetime.slice(0, 16)
            }
            return obj
          })
          self.selnum=res.papercount
          self.pagetotalnumsel=parseInt(res.papercount)
        }
        xhttp.post('/pre/queryselectedpaper',data,callback,xhttp.errcodefn,xhttp.errfn)
      },
      getcoursenamelist(){//查询适用课程名称列表
        var self=this
        var data={
          command:"course/querycoursenamelist",
          sessionid: $.cookie('sid'),
          loginid:$.cookie('uid')
        }
        function callback(res){
          self.options=res.coursenames
          self.options.unshift({
            courseid:-100,
            coursename:'全部课程'
          })
        }
        xhttp.post('/course/querycoursenamelist',data,callback,xhttp.errcodefn,xhttp.errfn)
      },
      topage(pagenum){
        this.currentPage=pagenum
      },
      topagesel(pagenum){
        this.currentPagesel=pagenum
      },
      canceladd(itemid){//取消备课题目
        var self=this
        var data={
          command:'pre/joinprepschedule',
          sessionid: $.cookie('sid'),
          loginid:$.cookie('uid'),
          teacherid:$.cookie('uid'),
          preid:itemid,
          pretype:2,
          scheduleid:$.cookie('prescheduleid'),
          status:0
        }
        function callback(res){
          self.getpaperlistsel(1,10,null,self.selcoursenamesel)
        }
        xhttp.post('/pre/joinprepschedule',data,callback,xhttp.errcodefn,xhttp.errfn)
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
            self.getpaperlistsel(1,10)
        }
        xhttp.post('/pre/joinprepschedule',data,callback,xhttp.errcodefn,xhttp.errfn)
      },
      tonewpaper(){
          this.$router.push({
              path:'/examManage/exam_test',
              query:{
                  newpaper:true,
                  value:2
              }
          })
      }
    }
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
</style>
