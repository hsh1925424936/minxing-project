<template>
    <div>
        <div class = "report-type">
                <span>课堂报告</span>
                <!-- <div class = "right">
                    <div class="search-input" style = "float:left">
                        <el-input style = "width:200px" v-model="firstInput" placeholder="请输入姓名或学号查询"></el-input>
                    </div>
                    <div class = "search-btn" style = "float:left;margin-left:10px">
                        <el-button type = "primary" @click ="queryByInput">查询</el-button>
                    </div>
                </div> -->
            </div>
            <div class = "query-item">
                <el-form :model="queryForm" :inline = "true" ref = "queryForm">
                    <el-form-item label ="课程">
                        <el-select v-model="queryForm.courseid" placeholder= "请选择" @change="selectQuery">
                            <el-option label = "全部" value=''></el-option>
                            <el-option
                              v-for="item in courseList"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label ="时间">
                        <el-select v-model="queryForm.time" placeholder= "请选择"  @change="selectQuery">
                            <el-option value='-1' label = "全部"></el-option>
                            <el-option value='0' label = "近三天"></el-option>
                            <el-option value='1' label = "近一周"></el-option>
                            <el-option value='2' label = "近一个月"></el-option>
                            <el-option value='3' label = "一个月以上"></el-option>
                            
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div class = "data-table">
            <el-table
            :data="tableData"
            border
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              
              label="报告名称"
              width = "300"
             >
              <template scope = "scope">
                <span>{{scope.row.reportname}}</span>
                <!-- <el-tag type ="primary" v-if="scope.row.isduty">负责人</el-tag> -->
              </template>
            </el-table-column>
            <el-table-column
              prop = "coursename"
              label="课程"
             >
             </el-table-column>
             <el-table-column
              prop = "scheduletime"
              label="上课时间"
              width = "300"
             >
             </el-table-column>
             <el-table-column
              prop = "placename"
              label="上课地点"

             >
             </el-table-column>
            <el-table-column
              width = "200"
              label="操作">
               <template scope="scope">
                    <!-- <el-button  type="text" size="small">课前报告</el-button> -->
                    <el-button @click="toAfterClassReport(scope.$index, scope.row)" type="text" size="small">课堂报告</el-button>
                </template>
            </el-table-column>
            </el-table>
            <el-pagination
              style = "float:right;margin:10px 10px"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pagenum"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
  import {post,setCookie,getCookie,setTitle} from '../../config/util'
    export default {
        data() {
            return {
                queryForm:{courseid:'',time:''},
                courseList:[],
                tableData:[],
                pagenum:1,
                pagesize:10,
                totalCount:0,
            }
        },
        components: {},
        created() {
        },
        mounted () {
          this.queryCourseList();
          this.initList();
        },

        methods: {
            toAfterClassReport(index,row){
                //console.log(row)
                this.$router.push({path:'/report/afterclassreportdetail',query:{scheduleid:row.schedulid}});
            },
            initList(){
              this.queryInclassList();
            },
            selectQuery(){
              this.queryInclassList({...this.queryForm,pagenum:1,pagesize:this.pagesize})
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
            queryInclassList(option){
              let self = this;
              post('/pre/prelessionlist',{
                "command": "pre/prelessionlist",
                "sessionid": getCookie('sid'),
                "loginid": getCookie('uid'),
                "teacherid": getCookie('uid'),
                "pagesize":this.pagesize,
                "pagenum":this.pagenum,
                "schedulestatus":1,
                courseid:'',
                "time":"-1",
                ...option

              }).done((data)=>{
                if(data.errcode==0){
                  console.log(data)
                  self.tableData = data.schedulelist.map((item)=>{
                     item.reportname = item.coursename+'课堂报告';
                     return item;
                  });
                  self.totalCount =  data.totoalcount;
                  console.log(self.tableData)
                }
              })
            },

            handleSizeChange(size){
              this.pagesize = size;
              this.queryInclassList({pagenum:1,pagesize:size,...this.queryForm});
            },
            handleCurrentChange(page){
              this.pagenum = page;
              this.queryInclassList({pagenum:page,pagesize:this.pagesize,...this.queryForm});
            },
        }
    }

</script>
<style lang="scss">
  @import "../../assets/css/common.css";
  .query-item{
    margin:10px 0 10px;
  }
</style>
