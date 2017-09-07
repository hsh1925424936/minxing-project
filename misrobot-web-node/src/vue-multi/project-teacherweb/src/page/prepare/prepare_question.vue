<template>
  <div class="rel">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部题目" name="first">
        <div class="flex p10rl">
          <div class="tree">
            <el-tree :data="treedata" :props="treeProps" @node-click="handleNodeClick"></el-tree>
          </div>

          <div class="flex_fill">
            <div class="mb10">
              <el-select v-model="selqtype" placeholder="全部题型">
                <el-option v-for="item in qtypelist" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>

              <el-select v-model="selqauthor" placeholder="全部题目">
                <el-option v-for="item in qauthorlist" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <ul class="qbox">
              <li class="flex qdetail" v-for="(value,index) in qlistall">
                <div class="r" :class="{
              bggreen:value.questiontypeid==1,
              bgred:value.questiontypeid==2,
              bgblue:value.questiontypeid==4,
              bgyellow:value.questiontypeid==5,
              bgzise:value.questiontypeid==6,
              bgblack:value.questiontypeid==7,
            }">{{value.questiontypeid | qtype}}</div>
                <div class="qtitle">
                  <span>{{index+1}}.</span>
                  <span>{{value.questionname}}</span>
                </div>
                <div class="dificulty">
                  <div v-show="value.lablist">
                    <el-tag type="gray" v-for="(value1,index1) in value.lablist" class="mr10">{{value1.name}}</el-tag>
                  </div>
                  <div class="fgraysmall" v-show="value.categoryname">
                    <span>所属类别：</span>
                    <span>{{value.categoryname}}</span>
                  </div>
                  <div class="flex_center_v" v-show="value.difficult">
                    <span>难度：</span>
                    <p>
                      <el-rate disabled v-model="value.difficult"></el-rate>
                    </p>
                  </div>
                </div>
                <div class="p10rl" style="width: 10%">
                  <el-checkbox v-model="value._ischoose" @change="checkchange($event,value.questionbaseid)">
                      <span v-if="value._ischoose==false">加入备课</span>
                      <span v-else>已加入</span>
                  </el-checkbox>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="pagebox">
          <el-pagination layout="prev, pager, next" :total="pagetotalnum" @current-change="topage" :current-page.sync="currentPage"></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="selnumtext" name="second">
        <ul class="flex_pingjun qcount m10">
          <li>
            <span class="name">共选择题目：</span>
            <span class="content">{{selnum}}</span>
          </li>
          <li>
            <span class="name">单选题：</span>
            <span class="content">{{selcount1}}</span>
          </li>
          <li>
            <span class="name">多选题：</span>
            <span class="content">{{selcount2}}</span>
          </li>
          <li>
            <span class="name">判断题：</span>
            <span class="content">{{selcount3}}</span>
          </li>
        </ul>
        <ul class="qbox">
          <li class="flex qdetail" v-for="(value,index) in qlistsel">
            <div class="r" :class="{
              bggreen:value.questiontypeid==1,
              bgred:value.questiontypeid==2,
              bgblue:value.questiontypeid==4,
              bgyellow:value.questiontypeid==5,
              bgzise:value.questiontypeid==6,
              bgblack:value.questiontypeid==7,
            }">{{value.questiontypeid | qtype}}</div>
            <div class="qtitle">
              <span>{{index+1}}.</span>
              <span>{{value.questionname}}</span>
            </div>
            <div class="dificulty">
              <div v-show="value.lablist">
                <el-tag type="gray" v-for="(value1,index1) in value.lablist" class="mr10">{{value1.name}}</el-tag>
              </div>
              <div class="fgraysmall" v-show="value.categoryname">
                <span>所属类别：</span>
                <span>{{value.categoryname}}</span>
              </div>
              <div class="flex_center_v" v-show="value.difficult">
                <span>难度：</span>
                <p>
                  <el-rate disabled v-model="value.difficult"></el-rate>
                </p>
              </div>
            </div>
            <div class="p10rl">
              <el-button type="warning" size="small" @click="canceladd(value.questionbaseid)">取消加入</el-button>
            </div>
          </li>
        </ul>
        <div class="pagebox">
          <el-pagination layout="prev, pager, next" :total="pagetotalnumsel" @current-change="topagesel" :current-page.sync="currentPagesel"></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="search">
      <el-button type="text" @click="newq()" class="mr20">若没有题目，点此处新建题目</el-button>
      <el-input placeholder="输入题目关键字查询" icon="search" v-model="searchfile" :on-icon-click="handleIconClick"></el-input>
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
        //已选题目
        checkedquestion:[],
        //左边树形控件
        treedata: [],
        treeProps: {
          children: 'children',
          label: 'label'
        },
        selnodeid:1,//已选节点id，默认为全部1
        //全部
        tableDataAll: [],
        //已选
        tableDataSel: [],
        addedfile:[],
        selnum:0,
        //两个select
        qtypelist: [{
          value: 9,
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
        }],
        selqtype: 9,
        qauthorlist: [{
          value: 1,
          label: '全部题目'
        }, {
          value: 0,
          label: '我的题目'
        }],
        selqauthor: 1,
        qlistall:[],
        qlistsel:[],
        //分页
        pagetotalnum:0,
        currentPage:1,
        pagetotalnumsel:0,
        currentPagesel:1,
        //已加入备课的各种题型的数量
        selcount1:0,
        selcount2:0,
        selcount3:0,
        selcount4:0,
      }
    },
    filters:{
      qtype(val){
        if(val==1){
          return '单'
        }else if(val==2){
          return '多'
        }else if(val==4){
          return '判'
        }
      }
    },
    components: {},
    mounted () {
      this.getqlist(null,this.selqtype,this.selqauthor,this.currentPage,10)
      this.getqlistsel(1,10)
      this.gettree()
    },
    watch:{
      'activeName'(val,oldval){
        if(val=='first'){
          this.getqlist(null,this.selqtype,this.selqauthor,this.currentPage,10)
        }else{
          this.getqlistsel(1,10)
        }
      },
      'selqtype'(val,oldval){
        this.getqlist(null,val,this.selqauthor,1,10)
      },
      'selqauthor'(val,oldval){
        this.getqlist(null,this.selqtype,val,1,10)
      },
      'selnodeid'(val,oldval){
        this.getqlist(val,9,1,1,10)
      },
      'currentPage'(val,oldval){
        this.getqlist(this.selnodeid,this.selqtype,this.selqauthor,val,10)
      }
    },
    computed:{
      selnumtext(){
        return '已选（'+this.selnum+'）'
      }
    },
    methods: {
      //左边树形控件
      handleNodeClick(data) {
        this.selnodeid=data.id;
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      handleIconClick(e){
        this.getqlist(this.selnodeid,this.selqtype,this.selqauthor,this.currentPage,10,this.searchfile)
      },
      checkchange(event,itemid){
        if($(event.target).is(':checked')){//加入备课
          this.addtocourse(itemid,1, $.cookie('prescheduleid'),1)
        }else{//取消加入
          this.addtocourse(itemid,1, $.cookie('prescheduleid'),0)
        }
      },
      newq(){
        this.$router.push({
          name:'qlist',
          query:{
            newq:true
          }
        })
      },
      getqlist(categoryid,questiontypeid,createperson,page,reqnum,qname){//categoryid类别，questiontypeid题型(9:所有，1：单选，2：多选，4：判断)，createperson创建人(0:我的，1：全部)，分页参数page,reqnum
        var self=this
        var data={
          command:'question/queryquestionlist',
          sessionid: $.cookie('sid'),
          loginid:$.cookie('uid'),
          createUid:$.cookie('uid'),
          questiontypeid:questiontypeid,
          createperson:createperson,
          page:page,
          reqnum:reqnum,
          scheduleid: $.cookie('prescheduleid')
        }
        if(categoryid!=null && categoryid!=1){
          data.categoryid=categoryid
        }
        if(qname){
          data.questionname=qname
        }
        function callback(res){
          self.qlistall = [];
          $(res.questionlist).each(function (i,el) {
              res.questionlist[i]._ischoose = el.ischoose==1?true:false;
              self.qlistall.push(res.questionlist[i]);
          });
          self.pagetotalnum=parseInt(res.allcount)
        }
        xhttp.post('/question/queryquestionlist',data,callback,xhttp.errcodefn,xhttp.errfn)
      },
      getqlistsel(page,reqnum){//查询已选题目
        var self=this
        var data={
          command:'question/queryselectedquestion',
          sessionid: $.cookie('sid'),
          loginid:$.cookie('uid'),
          page:page,
          reqnum:reqnum,
          scheduleid: $.cookie('prescheduleid')
        }
        function callback(res){
          self.qlistsel=res.questionlist
          self.pagetotalnumsel=parseInt(res.allcount)
          self.selnum=res.questionlist.length
          self.selcount1=res.count1
          self.selcount2=res.count2
          self.selcount3=res.count3
        }
        xhttp.post('/question/queryselectedquestion',data,callback,xhttp.errcodefn,xhttp.errfn)
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
          pretype:1,
          scheduleid:$.cookie('prescheduleid'),
          status:0
        }
        function callback(res){
          self.getqlistsel(1,10)
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
          self.getqlistsel(1,10)
        }
        xhttp.post('/pre/joinprepschedule',data,callback,xhttp.errcodefn,xhttp.errfn)
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import "../../assets/css/common.css";
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
