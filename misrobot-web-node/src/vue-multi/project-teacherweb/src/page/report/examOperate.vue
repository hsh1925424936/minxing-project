<template>
	<div>
        <div>
            <el-breadcrumb separator=">">
              <el-breadcrumb-item :to="{ path: '/report/allreport',query:{currentReport:'exam'} }">考试报告</el-breadcrumb-item>
              <el-breadcrumb-item>查看考试</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class = "exam-ope">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="考试信息" name="first">
                    <div class = "exam-ope-title">
                        <span class="exam-ope-title-item">考试名称：{{name}}</span>
                        <span class="exam-ope-title-item">课程：{{coursename}}</span>
                        <span class="exam-ope-title-item">考试类型：{{type}}</span>
                        <span class="exam-ope-title-item">考试形式：{{model}}</span>
                        <span class="exam-ope-title-item">考试时间：{{starttime}}</span>
                        <span class="exam-ope-title-item">考试状态：{{statusinfo}}</span>
                        <span class="exam-ope-title-item">考试试卷：{{papername}}</span>
                       <span class="exam-ope-title-item">考试总分：{{totalScore}}</span>
                    </div>
                    <div>
                        <div style="margin:10px 0;">分值设置:</div>
                        <el-table
                            ref="singleTable"
                            :data="itemlist"
                            border
                            style="width: 100%">
                        <el-table-column
                          type="index"
                          width="80"
                          label = "序号">
                        </el-table-column>
                        <el-table-column
                          property="questionname"
                          label="训练项名称"
                          >
                        </el-table-column>
                        <el-table-column
                          property="coursename"
                          label="所属类别"
                          >
                        </el-table-column>
                        <el-table-column
                          property="tag"
                          label="标签"
                          >
                        </el-table-column>
                        <el-table-column
                          property="score"
                          label="分值"
                          >
                        </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="考试安排" name="second">
                    <div class = "stu-range">
                        <span>考生范围：</span><span v-for="(item,index) in classlist">{{item.classname}}<span v-if="index!=classlist.length-1">、</span></span><span style="margin-left:20px;">共{{totalStu}}人</span>
                    </div>
                    <div class = "eo-teacher-item"v-for = "(item,index) in teacherlist">
                        <span class = "eo-t-i-s">考试操作{{index+1}}:{{item.questionname}}</span>
                        <span class = "eo-t-i-s">考试时间：{{item.starttime+'——'+item.endtime}}</span>
                        <span class = "eo-t-i-s">评卷老师：{{item.teachername+','+item.mobile}}</span>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="考试总成绩" name="third">
                    <el-form :model = "queryForm" :inline = "true"   label-width ="80px">
                        <el-form-item label="姓名" prop = "name" >
                            <el-input  v-model = "queryForm.stuname"></el-input>
                        </el-form-item>
                        <el-form-item label="学号" prop = "no" >
                            <el-input  v-model = "queryForm.code"></el-input>
                        </el-form-item>
                         <el-button type = "primary" @click = "queryByStuinfo" >查询 </el-button>
                         <el-button type = "primary" @click = "exportAllGrade" >导出</el-button>
                    </el-form>
                    <el-table
                    :data="scorelist"
                    border
                    style="width: 100%">
                        <el-table-column
                          type="index"
                          width="80"
                          label = "序号">
                        </el-table-column>
                        <el-table-column
                          property="name"
                          label="姓名"
                          >
                        </el-table-column>
                        <el-table-column
                          property="code"
                          label="学号"
                          >
                        </el-table-column>
                        <el-table-column prop='totalscore' label = "总分"></el-table-column>
                        <el-table-column label="各技能项成绩">
                            <el-table-column v-for = "item in learnlist" :prop = "item.learnname" :label = "item.learnname"></el-table-column>
                        </el-table-column>
                    </el-table>
                    
                </el-tab-pane>
                <el-tab-pane label="考生成绩详情" name="fourth">
                    <el-form :model = "queryForm1" :inline = "true"   label-width ="90px">
                        <el-form-item label="训练项名称" >
                            <el-select v-model="queryForm1.learnid" placeholder="请选择">
                                <el-option label="全部" value=""></el-option>
                                <el-option
                                  v-for="item in learnlist"
                                  :key="item &&item.learnid"
                                  :label="item &&item.learnname"
                                  :value="item &&item.learnid">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="姓名" prop = "name" >
                            <el-input  v-model = "queryForm1.stuname"></el-input>
                        </el-form-item>
                        <el-form-item label="学号" prop = "no" >
                            <el-input  v-model = "queryForm1.code"></el-input>
                        </el-form-item>
                         <el-button type = "primary" @click = "queryByInfo" >查询 </el-button>
                         <el-button type = "primary" @click = "exportGrade">导出</el-button>
                    </el-form>
                    <el-table
                    :data="answerlist"
                    border
                    style="width: 100%">
                        <el-table-column
                          type="index"
                          width="80"
                          label = "序号">
                        </el-table-column>
                        <el-table-column
                          property="stuname"
                          label="姓名"
                          >
                        </el-table-column>
                        <el-table-column
                          property="code"
                          label="学号"
                          >
                        </el-table-column>
                        <el-table-column
                          property="questionname"
                          label="题目"
                          >
                        </el-table-column>
                        <el-table-column
                          property="score"
                          label="成绩 "
                          >
                        </el-table-column>
                        <el-table-column
                          property="answertime"
                          label="上传时间 "
                          >
                        </el-table-column>
                        <el-table-column
                          property="gradetime"
                          label="评分时间 "
                          >
                        </el-table-column>
                        <el-table-column label="操作">
                          <template scope="scope">
                            <el-button type="text" @click="toRatedOperate(scope.$index, scope.row)">查看</el-button>
                           </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                    style="float:right"
                      @size-change = "handleSizeChange1"
                      :current-page.sync="pagenum1"
                      :page-sizes="[10, 20, 50, 100]"
                      :page-size="pagesize1"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="totalcount1">
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script >
import {post,setCookie,getCookie,setTitle,exportExcel} from '../../config/util'
	export default {
        data() {
            return {
                activeName:'first',
                types:['单元考试','期中考试','期末考试','随堂小测'],
                models:['理论笔试','理论机试','操作考试'],
                examid:'',
                name:'',
                coursename:'',
                type:'',
                model:'',
                starttime:'',
                statusinfoList:['待考试','考试中','待评卷','已结束'],
                statusinfo:'已结束',
                papername:'',
                paperid:'',
                totalScore:100,
                pagenum:1,
                pagesize:10,
                totalcount:0,
                itemlist:[],
                classlist:[],
                teacherlist:[],
                scorelist:[],
                learnlist:[],
                learnidlist:[],

                queryForm:{code:'',stuname:''},
                queryForm1:{learnid:'',code:'',stuname:''},
                answerlist:[],
                pagenum1:1,
                pagesize1:10,
                totalcount1:0,
            }
        },
        components: {
        },
        computed:{
            totalStu(){
                let sum=0;
                this.classlist.forEach(item=>{
                    sum+=item.total;
                });
                return  sum;
            }
        },
        created() {
        },
        mounted () {
            this.examid = this.$route.params.examid;
            this.getExamInfo();

        },
        watch:{
            pagenum1(cval,oval){
                this.getAnswerlist({...this.queryForm1,pagenum:cval,pagesize:this.pagesize1})
            },
            pagesize1(cval,oval){
                this.getAnswerlist({...this.queryForm1,pagenum:1,pagesize:cval})
            }
        },
        methods: {
            //导出
            exportAllGrade(){
                let data ={
                    command:'unifyexam/querystuoperatscore',
                    loginid:getCookie('uid'),
                    sessionid:getCookie('sid'),
                    teacherid:getCookie('uid'),
                    examid:this.examid,
                    ...this.queryForm,
                    };
                exportExcel(data);
            },
            exportGrade(){
                let data ={
                        command:'unifyexam/querystuanswerlist',
                    loginid:getCookie('uid'),
                    sessionid:getCookie('sid'),
                    teacherid:getCookie('uid'),
                    examid:this.examid,
                    ...this.queryForm1,
                    pagenum:1,
                    pagesize:this.pagesize1,
                    };
                exportExcel(data);
            },
            getExamInfo(){
                let self = this;
                post('/unifyexam/queryexamdetail',{
                    command:'unifyexam/queryexamdetail',
                    loginid:getCookie('uid'),
                    sessionid:getCookie('sid'),
                    teacherid:getCookie('uid'),
                    examid:this.examid,
                }).done(data=>{
                    if(data&&data.errcode==0){
                        self.name = data.name;
                        self.coursename = data.coursename;
                        self.type = self.types[data.type];
                        self.model = self.models[data.model];
                        self.starttime = data.starttime.substr(0,10)+'——'+data.endtime.substr(0,10);
                        self.papername = data.papername;
                        self.paperid = data.paperid;
                        self.teacherlist = data.iteamteacherlist;
                        self.classlist = data.classlist;
                        self.statusinfo = self.statusinfoList[data.status];
                        self.totalScore = data.score;
                        self.getSelectList();
                        self.getTotalScore();
                        self.getAnswerlist({pagenum:1,pagesize:10});
                    }
                })
            },
            getSelectList(){
                let self = this;
                post('/exampaper/queryselectedquestion',{
                    command:'exampaper/queryselectedquestion',
                    sessionid: $.cookie('sid'),
                    loginid:$.cookie('uid'),
                    page:1,
                    reqnum:20,
                    paperid:self.paperid,
                    questiontypeid:7,
                    createperson:1,
                }).done(data=>{
                    if(data&&data.errcode==0){
                        console.log(data)
                        self.itemlist = data.questionlist;
                        console.log(self.itemlist)
                    }
                })
            },
            queryByStuinfo(){
                this.getTotalScore(this.queryForm);
            },
            getTotalScore(option){
                let self = this;
                post('/unifyexam/querystuoperatscore',{
                    command:'unifyexam/querystuoperatscore',
                    loginid:getCookie('uid'),
                    sessionid:getCookie('sid'),
                    teacherid:getCookie('uid'),
                    examid:this.examid,
                    ...option
                }).done(data=>{
                    if(data&&data.errcode==0){
                        self.scorelist = data.scorelist.map(item=>{
                            item.learnscorelist.forEach(it=>{
                                item[it.learnname]=it.score;
                            });
                            return item;
                        });
                        if(data.scorelist.length>0){
                            self.learnlist = data.scorelist[0].learnscorelist.map(item=>{
                                return {learnname:item.learnname,learnid:item.learnid};
                            })
                            
                        }
                        
                    }
                })
            },
            queryByInfo(){
                this.getAnswerlist({...this.queryForm1,pagenum:1,pagesize:10});
            },
            getAnswerlist(option){
                let self = this;
                post('/unifyexam/querystuanswerlist',{
                    command:'unifyexam/querystuanswerlist',
                    loginid:getCookie('uid'),
                    sessionid:getCookie('sid'),
                    teacherid:getCookie('uid'),
                    examid:this.examid,
                    ...option
                }).done(data=>{
                    if(data&&data.errcode==0){
                        self.answerlist = data.answerlist;
                        self.totalcount1 = data.totalcount;
                    }
                })
            },
            toRatedOperate(index,row){
                this.$router.push({name:'ratevideo',query:{...row,examid:this.examid}})
            },
            handleSizeChange(size){
                this.pagesize = size;
            },
            handleSizeChange1(size){
                this.pagesize1 = size;
            },
        }
    }

</script>
<style scoped>
	.exam-ope{
        border: 1px solid #e1eaf1;
        box-shadow: 0 1px 3px 0 rgba(0,34,77,.05);
        background-clip: content-box;
        margin-top:20px;
        padding:20px;
    }
    .exam-ope-title{
        border-bottom:1px solid #e1eaf1;
        padding-bottom:10px;
    }
    .exam-ope-title-item{
        width:24%;
        padding:10px 0;
    }
    .stu-range{
       border-bottom:1px solid #e1eaf1;
        padding-bottom:10px;
    }
    .eo-teacher-item{
        padding:10px 0;

        border-bottom: 1px solid #e1eaf1;
    }
    .eo-t-i-s{
        width:40%;
        padding:10px;
    }
</style>