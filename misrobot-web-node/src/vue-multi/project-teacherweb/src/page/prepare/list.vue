<template bgcolor="transparent" style='background:transparent'>
  <div class="container">

    <h3>备课列表</h3>

      <div class="mt20">
        <el-select v-model="seltimerange" placeholder="全部时间" @change="seltimechange">
          <el-option v-for="item in timerange" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>

      <div class="mt20">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="coursename" label="课程名称" width="200"></el-table-column>
          <el-table-column prop="status" label="状态" :filters="[{ text: '已备课', value: 1 }, { text: '未备课', value: 0 }]" :filter-method="filterTag" filter-placement="bottom-end" width="120">
            <template scope="scope">
              <el-tag :type="scope.row.status == '1' ? 'success' : 'warning'" close-transition>{{scope.row.status|preparestatus}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="scheduletime" label="上课时间" width="280"></el-table-column>
          <el-table-column prop="placename" label="上课地点"></el-table-column>
          <el-table-column prop="filesum" label="备课文件" width="120"></el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button v-if="scope.row.task==1"  size="small" @click="beforerePort(scope.row.schedulid)" type="info">课前报告</el-button>
                <el-dialog
                    title="课前报告"
                    :visible.sync="dialogVisible"
                    size="full"
                    :before-close="handleClose">
                    <iframe  style="filter:Chroma(Color=white);width:100%;height:648px;"   frameborder="no"  border="0"  :src="src(scope.row)">
                    </iframe>
                </el-dialog>
              <el-button size="small" type="success" @click="toprepare(scope.row)">备课</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="block mt20">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size.sync="currentSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalnum">
        </el-pagination>
      </div>
  </div>
</template>

<script>
    import methods from '../../assets/js/methods'
    import xhttp from '../../assets/js/http'
    export default {
        data() {
            return {
              //select框数据
              timerange: [
                {value: -1, label: '全部'},
                {value: 0, label: '近3天'},
                {value: 1, label: '近一周'},
                {value: 2, label: '近一个月'},
                {value: 3, label: '一个月以上'}
              ],
              seltimerange: 1,
              //表格数据
              tableData: [],
              //分页数据
              currentPage: 1,
              currentSize:10,
              totalnum:0,
              dialogVisible: false,
              reportId:null,
              accountname:null,
              //task:'',

            }
        },
        mounted(){
          this.querypreparelist(1,10,1)
          this.getaccountname();
        },

        filters:{
          preparestatus(val){
            if(val){
              return '已备课'
            }else{
              return '未备课'
            }
          }
        },
         computed:{

        },
        methods:{
            src(courseinfo){
              return '/pages/assistant/report.html?reportid='+this.reportId+'&accountname='+this.accountname;
            },
          seltimechange(seltime){
            console.log(seltime)
            this.seltimerange=seltime
            this.querypreparelist(seltime,this.currentSize,this.currentPage)
          },
          filterTag(value, row) {
            return row.status === value;
          },
          handleSizeChange(val) {//每页多少条
            this.currentSize=val
            this.querypreparelist(this.seltimerange,val,this.currentPage)
          },
          handleCurrentChange(val) {//当前第几页
            this.currentPage=val
            this.querypreparelist(this.seltimerange,this.currentSize,val)
          },
          toprepare(courseinfo){
            this.$router.push({
              name:'prepare',
              query:{status:courseinfo.status}
            })
            $.cookie('prescheduleid',courseinfo.schedulid)
          },

          querypreparelist(timerange,pagesize,pagenum){//查询备课列表
            var self=this
            var data={
              command:'pre/prelessionlist',
              sessionid: $.cookie('sid'),
              loginid:$.cookie('uid'),
              teacherid:$.cookie('uid'),
              pagesize:pagesize,
              pagenum:pagenum,
              time:timerange
            }
            function callback(res){

              self.tableData=res.schedulelist
              self.totalnum=res.totoalcount
            }
            xhttp.post('/pre/prelessionlist',data,callback,xhttp.errcodefn,xhttp.errfn)
          },
          getaccountname(){
             this.accountname=$.cookie('uid');
          },

          handleClose(done) {
            done();
      },
      beforerePort(reportid){
        this.dialogVisible = true;
        this.reportId=reportid;
      }


        }

    }
</script>
<style lang="scss" scoped>
  @import "../../assets/css/common.css";
  .block{
    display:flex;
    align-items: center;
    justify-content: space-between;
  }
  .mt20{
    margin-top:20px;
  }

</style>
