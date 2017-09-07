<template>
    <div>
        <div class="report-type">
            <span>学生成绩</span>
            <div class="right">
                <div class="search-input" style="float:left">
                    <el-input style="width:200px" v-model="firstInput" placeholder="请输入学生姓名查询"></el-input>
                </div>
                <div class="search-btn" style="float:left;margin-left:10px">
                    <el-button type="primary" @click="queryByInput">查询</el-button>
                </div>
            </div>
        </div>
        <div class="query-item">
            <el-form :model="queryForm" :inline="true" ref="queryForm">
                <el-form-item label="班级">
                    <el-select style="width:120px" v-model="queryForm.class" placeholder="请选择">
                        <el-option key="" value="" label="全部"></el-option>
                        <el-option 
                        v-for="item in classList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程">
                    <el-select style="width:120px" v-model="queryForm.course" placeholder="请选择">
                        <el-option key="" value="" label="全部"></el-option>
                        <el-option 
                        v-for="item in courseList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="考试类型">
                    <el-select style="width:120px" v-model="queryForm.type" placeholder="请选择">
                        <el-option label="" value="" key="">请选择</el-option>
                        <el-option label="单元考试" value="0" key="0"></el-option>
                        <el-option label="期中考试" value="1" key="1"></el-option>
                        <el-option label="期末考试" value="2" key="2"></el-option>
                        <el-option label="随堂小测" value="3" key="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="考试形式">
                    <el-select style="width:160px" v-model="queryForm.model" placeholder="请选择">
                        <el-option label="" value="" key="">请选择</el-option>
                        <el-option label="理论考试（笔试）" value="0" key="0"></el-option>
                        <el-option label="理论考试（机试）" value="1" key="1"></el-option>
                        <el-option label="操作考试" value="2" key="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-button type="primary" @click="queryBySelect">查询</el-button>
                <el-button type="primary" @click="downLoad">导出</el-button>
            </el-form>
        </div>
        <div class="data-table">
            <el-table :data="tableData" @row-click="showDetail" border tooltip-effect="dark" style="width: 100%">
                <el-table-column type="index" width="65" label="序号"></el-table-column>
                <el-table-column prop="stuname" width="100" label="学生姓名"></el-table-column>
                <el-table-column prop="code" width="160" label="学号"></el-table-column>
                <el-table-column prop="classname" width="100" label="所属班级"></el-table-column>
                <el-table-column prop="coursename" width="170" label="课程"></el-table-column>
                <el-table-column prop="typeText" width="100" label="考试类型"></el-table-column>
                <el-table-column prop="modelText" width="100" label="考试形式"></el-table-column>
                <el-table-column prop="testname" width="100" label="考试名称"></el-table-column>
                <el-table-column prop="score" width="65" label="成绩"></el-table-column>
                <el-table-column prop="status" width="65" label="状态"></el-table-column>
                <el-table-column prop="testtime" width="160" label="考试时间" fixed="right"></el-table-column>
                <!-- <el-table-column
                    width = "210"
                    label="操作">
                    <template scope="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
                    </template>
                </el-table-column>  -->
            </el-table>
            <el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
            </el-pagination>
        </div>
        <el-dialog
            title="详情"
            :visible.sync="dialogVisible"
            size="small"
            :before-close="handleClose">
            <div class="dialog">
                <h2>{{resDetail.name}}</h2>
                <div class="flex">
                    <p style="margin-right:80px;">
                        <span class="label">班级</span>{{resDetail.class}}
                    </p>
                    <p>
                        <span class="label">学号</span>{{resDetail.code}}
                    </p>
                </div>
                <div>
                    <span class="label">课程</span>
                    <el-select style="width:120px" v-model="detail.courseid" placeholder="请选择">
                        <el-option 
                        v-for="item in courseList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                        ></el-option>
                    </el-select>
                </div>
                <div>
                    <span class="label">考试类型</span>
                     <el-select style="width:120px" v-model="detail.type" placeholder="请选择">
                        <el-option label="全部" value="" key=""></el-option>
                        <el-option label="单元考试" value="0" key="0"></el-option>
                        <el-option label="期中考试" value="1" key="1"></el-option>
                        <el-option label="期末考试" value="2" key="2"></el-option>
                        <el-option label="随堂小测" value="3" key="3"></el-option>
                    </el-select>
                </div>
                <div id="line">

                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import moment from 'moment'
    import echarts from 'echarts'
    import { post, setCookie, getCookie, setTitle,exportExcel} from '../../config/util'
    export default {
        data() {
            return {
                queryForm: { course: '', type: '', class: '', model: '', },
                tableData: [{ stud_name: '宫本武藏' }],
                totalCount: 0,
                currentPage: 1,
                pageSize: 10,
                classList:[],
                courseList:[],
                stuId:'',
                firstInput:'',
                detail:{id:'',type:'',courseid:''},
                dialogVisible:false,
                resDetail:{name:"",class:'',code:'',score:[]},
                xData:[],
                data:[],
                name:''
            }
        },
        watch:{
            'detail.type':function(val,oldval){
                if(val == 0){
                    this.name = '单元考试'
                }else if(val == 1){
                    this.name = '期中考试'
                }else if(val == 2){
                    this.name = '期末考试'
                }else if(val == 3){
                    this.name = '随堂小测'
                }
                this.queryDetail()
            },
            'detail.courseid':function(val,oldval){
                this.queryDetail()
            }
        },
        components: {},
        created() {
        },
        mounted() {
            this.queryScoreList()
            this.queryClassList()
            this.queryCourseList()
        },
        methods: {
            downLoad(){
                let data = {
                    command: "unifyexam/queryscorelist",
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    teacherid:getCookie('uid')
                }
                exportExcel(data)
            },
            handleClose(){
              this.stuId = ''
              this.dialogVisible = false
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.queryScoreList()
            },
            handleCurrentChange(val){
                this.currentPage = val
                this.queryScoreList()
            },
            queryByInput(){
                this.queryForm = {class:'',course:'',model:'',type:''}
                this.queryScoreList()
            },
            queryBySelect(){
                this.firstInput = ''
                this.queryScoreList()
            },
            showDetail(row) {
                this.dialogVisible = true
                this.detail.id = row.id
                // this.resDetail = {name:"",class:'',code:'',score:[]}
                this.resDetail.name = row.stuname
                this.resDetail.class = row.classname
                this.resDetail.code = row.code
                // 默认显示单元考试的曲线
                this.detail.type = '0'
                this.stuId = row.stuid
                this.queryCourseList()
                this.queryDetail()
            },
            queryDetail(){
                let self = this
                // this.resDetail ={name:'',code:'',class:'',score:[]}
                this.resDetail.score = []
                post('/unifyexam/querystuscoredetail',{
                    command:'unifyexam/querystuscoredetail',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    teacherid:getCookie('uid'),
                    type:self.detail.type,
                    courseid:self.detail.courseid,
                    id:self.detail.id
                }).done((data)=>{
                    if(data && data.errcode == 0){
                        this.xData = []
                        this.data = []
                        // this.resDetail.name = data.stuname
                        // this.resDetail.code = data.code
                        // this.resDetail.class = data.sclassname
                        this.resDetail.score = data.scoreinfo
                        this.studentId = data.stdid
                        if(this.resDetail.score && this.resDetail.score.length !== 0){
                            this.resDetail.score.map((item)=>{
                                this.xData.push(item.testname)
                                this.data.push(item.score)
                            })
                        }else{
                            this.xData = []
                            this.data = []
                        }
                        console.log(this.xData)
                        console.log(this.data)
                        this.drawLine()
                    }
                }).fail((error)=>{
                    console.log(error)
                })
            },
            queryClassList(){
                let self = this
                post('/unifyexam/queryclasslist',{
                    command:"unifyexam/queryclasslist",
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    teacherId:getCookie('uid'),
                    stuId:self.stuId,
                }).done((data)=>{
                    if(data && data.errcode == 0){
                        this.classList = data.classlist
                    }
                }).fail((error)=>{
                    console.log(error)
                })
            },
            queryCourseList(){
                let self = this
                post('/unifyexam/querycourselist',{
                    command:"unifyexam/querycourselist",
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    teacherid:getCookie('uid'),
                    stuid:self.stuId,
                }).done((data)=>{
                    if(data && data.errcode == 0){
                        this.courseList = data.coursenamelist
                        if(this.courseList && this.courseList.length !== 0){
                           this.detail.courseid = this.courseList[0].id 
                        }
                    }
                }).fail((error)=>{
                    console.log(error)
                })
            },
            queryScoreList() {
                let self = this
                post('/unifyexam/queryscorelist', {
                    command: 'unifyexam/queryscorelist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    teacherid: getCookie('uid'),
                    stuname:self.firstInput,
                    courseid:self.queryForm.course,
                    sclassid:self.queryForm.class,
                    model:self.queryForm.model,
                    type:self.queryForm.type,
                    page:self.currentPage,
                    reqnum:self.pageSize,
                }).done((data) => {
                    if(data && data.errcode == 0){
                        this.tableData = data.scoreinfolist
                        this.totalCount = data.allcount
                        this.tableData.map((item)=>{
                            if(item.model == 0){
                                item.modelText = '理论考试（笔试）'
                            }else if(item.model == 1){
                                item.modelText = '理论考试（机试）'
                            }else if(item.model == 2){
                                item.modelText = '操作考试'
                            }
                             if(item.type == 0){
                                item.typeText = '单元考试'
                            }else if(item.type == 1){
                                item.typeText = '期中考试'
                            }else if(item.type == 2){
                                item.typeText = '期末考试'
                            }else if(item.typel == 3){
                                item.typeText = '随堂小测'
                            }
                            item.testtime = moment(item.testtime).format('YYYY-MM-DD hh:mm')
                        })
                    }
                }).fail((error) => {
                    console.log(error)
                })
            },
            drawLine(){
                let self = this
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('line'))
                // 绘制图表
                myChart.setOption({
                    title: {
                        text: self.name+'曲线',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c}'
                    },
                    // legend: {
                    //     left: 'left',
                    //     data: []
                    // },
                    xAxis: {
                        type: 'category',
                        // name: '考试',
                        // nameLocation:'middle',
                        splitLine: {
                            show: false,
                            color:['#aaa','#ddd'],
                            shadowColor:'rgb(0,0,0,0.5)',
                            shadowBlur:10
                        },
                        splitArea:{
                            show:false,
                        },
                        data: self.xData,
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    yAxis: {
                        type: 'log',
                        name: '分数',
                        // nameLocation:'middle',
                        max:100,
                    },
                    series: [
                        {
                            name: '',
                            type: 'line',
                            data: self.data,
                        },
                        ]
                        });
                    }
                }
    }

</script>
<style lang="scss" scoped>
    @import "../../assets/css/common.css";
    .report-type {
        height: 40px;
        font-size: 17px;
        line-height: 40px;
    }
    .dialog{
        width:100%;
    }
    .dialog h2{
        text-align: center;
        font-weight: normal;
    }
    .label{
        display:inline-block;
        width:80px;
        margin:15px 0;
    }
    #line{
        width:100%;
        height:300px;
    }
</style>