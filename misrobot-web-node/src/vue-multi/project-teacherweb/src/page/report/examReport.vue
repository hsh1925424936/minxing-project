<template>
    <div>
        <div class = "report-type">
                <span>考试报告</span>
                <div class = "right">
                    <!-- <div class="search-input" style = "float:left">
                        <el-input style = "width:200px" v-model="firstInput" placeholder="请输入姓名或学号查询"></el-input>
                    </div>
                    <div class = "search-btn" style = "float:left;margin-left:10px">
                        <el-button type = "primary" @click ="queryByInput">查询</el-button>
                    </div> -->
                </div>
            </div>
            <div class = "query-item">
                <el-form :model="queryForm" :inline = "true" ref = "queryForm">
                    <el-form-item  label ="课程">
                        <el-select style = "width:120px" @change = "queryExamBySelect" v-model="queryForm.courseid" placeholder= "请选择">
                          <el-option label = "全部" value='-1'></el-option>
                          <el-option
                            v-for="item in courseList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  label ="考试类型">
                        <el-select style = "width:120px" @change = "queryExamBySelect" v-model="queryForm.type" placeholder= "请选择">
                            <el-option label = "全部" value='-1'></el-option>
                            <el-option label = "单元考试" value='0'></el-option>
                            <el-option label = "期中考试" value='1'></el-option>
                            <el-option label = "期末考试" value='2'></el-option>
                            <el-option label = "随堂小测" value='3'></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  label ="考试形式">
                        <el-select style = "width:120px" @change = "queryExamBySelect" v-model="queryForm.model" placeholder= "请选择">
                            <el-option label = "全部" value='-1'></el-option>
                            <el-option label = "理论机试" value='1'></el-option>
                            <el-option label = "操作考试" value='2'></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  label ="考试时间">
                        <el-select style = "width:120px" @change = "queryExamBySelect" v-model="queryForm.time" placeholder= "请选择">
                            <el-option value='-1' label = "全部"></el-option>
                            <el-option value='0' label = "近三天"></el-option>
                            <el-option value='1' label = "近一周"></el-option>
                            <el-option value='2' label = "近一个月"></el-option>
                            <el-option value='3' label = "近三个月"></el-option>
                            <el-option value='4' label = "三个月前"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div class = "data-table">
            <el-table
            :data="examlist"
            @row-click = "showDetail"
            border
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              
              label="考试报告名称"
              width = "250"
             >
              <template scope = "scope">
                <span class= "exam-type-logo">{{scope.row.model=='操作考试'?'操':'机'}}</span>
                <span>{{scope.row.name}}</span>
                <!-- <el-tag type ="primary" v-if="scope.row.isduty">负责人</el-tag> -->
              </template>
            </el-table-column>
            <el-table-column
              prop = "courseName"
              label="课程"

             >
             </el-table-column>
             <el-table-column
              prop = "type"
              label="考试类型"
             >
             </el-table-column>
              <el-table-column
              prop = "time"
              label="考试时间"
              width = "300"
             >
             </el-table-column>
              <el-table-column
              prop = "placeinfo"
              label="考试地点"

             >
             </el-table-column>
            </el-table>
            <el-pagination
              style = "float:right;margin:10px 10px"
              @size-change="handleSizeChange"
             
              :current-page.sync="pagenum"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalcount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import {post,setCookie,getCookie,setTitle} from '../../config/util'
    export default {
        data() {
            return {
              queryForm:{courseid:'',type:'',model:'',time:''},
              courseList:[],
              examlist:[],
              pagenum:1,
              pagesize:10,
              totalcount:0,
            }
        },
        components: {},
        created() {
        },
        mounted () {
          this.queryCourseList();
          this.queryExam();
        },
        watch:{
          pagesize(cval,oval){
            this.queryExam({...this.queryForm,pagenum:1,pagesize:cval})
          },
          pagenum(cval,oval){
            this.queryExam({...this.queryForm,pagenum:cval,pagesize:this.pagesize})
          }
        },
        methods: {
          showDetail(row){
            if(row.model=='操作考试'){
              this.$router.push({name:'reportexamoperate',params:{examid:row.examid}});
            }else{
              this.$router.push({name:'examcomputer',params:{examid:row.examid}});
            }
            //
            
          },
          queryCourseList(){
            let self = this;
            post('/unifyexam/querycourselist',{
              command:'unifyexam/querycourselist',
              loginid:getCookie('uid'),
              sessionid:getCookie('sid'),
              teacherid:getCookie('uid'),
            }).done((data)=>{
              if(data&&data.errcode==0){
                self.courseList = data.coursenamelist;
              }
            });
          },
          queryExamBySelect(){
            this.queryExam(this.queryForm);
          },
          queryExam(option){

            let self = this;
            post('/unifyexam/queryExam',{
              command:'unifyexam/queryExam',
              loginid:getCookie('uid'),
              sessionid:getCookie('sid'),
              "teacherid":getCookie('uid'),
             //courseid:'',
              "model": '',
              "type": '',
              //time:'',
              "pagesize":this.pagesize,
              "pagenum":this.pagenum,
              ...option

            }).done((data)=>{
              if(data&&data.errcode==0){
                self.examlist = data.examlist
                self.examlist.forEach((item)=>{
                  item.placeinfo = item.place.map((i)=>{
                    return i.placename;
                  }).join('、');
                });
                self.totalcount = data.totalcount;
              }
            })
          },
          handleSizeChange(size){
            this.pagesize = size;
          }
        }
    }

</script>
<style >
  @import "../../assets/css/common.css";
  .exam-type-logo{
    display: inline-block;
    width:25px;
    height: 25px;
    text-align: center;
    line-height: 25px;
    border-radius: 30px;
    background: #9933cc;
    color:#ffffff;
  }
</style>
