<template>
	<div class="examtheory">
		<p class="nav"><span class="blue" @click="cancel">考试&试卷</span> > 新增考试</p>
		<div class="content">
			<p class="top">
				<span>考试名称：{{form.name}}</span>
				<span>课程：{{coursename}}</span>
				<span>考试类型：{{form.typeitem.label}}</span>
				<span>考试形式：{{form.modelitem.label}}</span>
			</p>
			<div class="bottom">
				<div class="questioncontent borderbottom">
					<p class="line">
						考试试卷:
						<label class="cell_right box" >{{selectpaperitem.name}}</label><el-button type="primary" class="addbtn" @click="selectpaper">选择</el-button>
					</p>
					<p class="line">
						考生范围:
						<label class="cell_right box" ><span v-for="item in classselected">{{item.name}}</span> </label><el-button type="primary" class="addbtn" @click="selectstu">选择</el-button>
					</p>	
				</div>
				<!--------------------------操作题列表------------------------------->
				<div class="borderbottom questioncontent" v-if="questionlist" v-for="(item,index) in questionlist">
					<p class="line">
						考试题目{{index+1}}:
						<label class="cell_right box" >{{item.questionname}}</label>
					</p>
					<p class="line">
						考试起止时间:
						<el-date-picker v-model="item.questionstarttime" type="datetime" placeholder="开始时间" :picker-options="pickerOptions" class="cell_right" style="padding: 0;width: 220px;"></el-date-picker>
						<el-date-picker v-model="item.questionendtime" type="datetime" placeholder="结束时间" :picker-options="pickerOptions" class="cell_right" style="padding: 0;width: 220px;"></el-date-picker>
					</p>
					<p class="line">
						评卷老师:
						<el-select v-model="item.questionteacher" filterable placeholder="请选择" style="padding: 0;margin-left: 35px;width: 292px;"> 
							<el-option  v-for="teacheritem in teacherlist" :key="teacheritem.value" :label="teacheritem.label" :value="teacheritem.value"> </el-option>
						</el-select>
					</p>	
				</div>
				<p class="cell_line">
					<el-button type="primary" @click="save">保存</el-button>
					<el-button @click="cancel">取消</el-button>
				</p>
			</div>
		</div>
		
		<!--选择考生-->
		<el-dialog  title="选择学生" :visible.sync="dialogSelStu" :close-on-click-modal="false" @close="">
            <el-transfer
			    filterable
			    :filter-method="filterclass"
			    filter-placeholder="请输入班级"
			    v-model="valueclass"
			    :data="dataclass"
			    style="margin: auto;width: 465px;">
			</el-transfer>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogSelStu = false">取 消</el-button>
                <el-button type="primary" @click="sureclass">确 定</el-button>
            </div>
        </el-dialog>
		<!--选择试卷-->
        <div class="popbox" v-show="selectpapershow">
			<p class="poptitle">选择试卷 <i class="el-icon-close" @click="closepop"></i></p>
			<p class="popcontent">
				<el-select v-model="courseid" placeholder="课程">
				    <el-option label="全部" value=""> </el-option>
				    <el-option v-for="item in courselist" :key="item.id" :label="item.name" :value="item.id"> </el-option>
				</el-select>
				<el-date-picker v-model="papertime" @change="papertimechange" type="daterange" align="cell_right" placeholder="选择日期范围" :picker-options="pickerOptions"> </el-date-picker>
				<el-input class="searchbox" placeholder="输入试卷名" icon="search" v-model="papername" :on-icon-click="searchpaper"></el-input>
			</p>
			<div class="popcontent">
				<div class="table">
					<el-table @row-click="checkpaper" :data="paperlist" border style="width: 100%">
				      <el-table-column label="试卷名称">
				      	<template scope="scope">
				      		<div class="labelbox bgpurple" v-if="scope.row.type==1">理</div>
		      				<div class="labelbox bgblack" v-if="scope.row.type==2">操</div>
				      		<div class="labelbox bgorange" v-if="scope.row.type==5">随</div>
				      		<span>{{scope.row.name}}</span>
				      	</template>
				      </el-table-column>
				      <el-table-column prop="operatortime" label="操作时间"></el-table-column>
				    </el-table>
		    		<el-pagination class="pagebox" layout="prev, pager, next" :total="total" @current-change="handleCurrentChange" > </el-pagination>
				</div>
			</div>
			</p>
		</div>
	</div>
</template>

<script>
import {post,setCookie,getCookie,setTitle} from '../../config/util'
import breadcrumb from '../../components/breadcrumb'
import translist from '../../components/translist'
import $ from 'jquery'
import moment from 'moment'
export default {
	
data() {
  	return {
		form: {//新增考试det
	        name: this.$route.query.name,//考试名
	        courseitem: this.$route.query.courseitem,//考试课程
	        typeitem: {//考试类型
	        	value:this.$route.query.typevalue,
	        	label:this.$route.query.typelabel,
	        },
	        modelitem: {//考试形式
	        	value:this.$route.query.modelvalue,
	        	label:this.$route.query.modellabel,
	        }
	    },
  		selectpapershow:false,//选择试卷pop
        selectpaperitem:'',//已选试卷item
        papertime:'',//查询试卷时间
  		currentpage:1,//当前页码
		pagesize:10,//每页条数
  		total:0,//数据总数
  		coursename:'',//学科名
  		paperlist:[],//试卷列表
        courselist:[],//课程选择
        courseid:'',//选择课程id
        paperstartime:'',//试卷开始时间
        paperendtime:'',//试卷结束时间
        papername:'',//试卷名
  		pickerOptions: {//试卷操作时间限制
            disabledDate(time) {
	            return time.getTime() < Date.now() - 8.64e7;
	        }
        },
        dialogSelStu:false,//选择学生pop
        
        dataclass:[],//班级pop数据列表
        valueclass:[],//班级pop已选值列表
        filterclass(query, item) {//班级查询
            return item.rooms.indexOf(query) > -1;
        },
        classlist:[],//班级列表
		classselected:[],//已选班级
        
        questionlist:[],//操作题列表
        teacherlist:[],//教师列表
  	}
},
components: {
    breadcrumb,
    translist,
},
mounted(){
	this.queryteacherlist();
	this.queryCourse();
},
methods:{
	queryCourse(){//查询学科列表
        var self=this;
		post('/cls/selectCourses',{
            command:"cls/selectCourses",
            sessionid:getCookie('sid'),
            loginid:getCookie('uid')
        }).done((res)=>{
            if(res.errcode==0){
                self.courselist=res.courseslist;
                for (var i=0;i<self.courselist.length;i++) {
					if (self.courselist[i].id==self.form.courseitem) {
						self.coursename=self.courselist[i].name;
					}
				}
            }
        })
	},
	querypaper(currentpage,pagesize,courseid,starttime,endtime,name){//查询试卷
		var self=this;
		post('/exampaper/querypaper',{
            command:"exampaper/querypaper",
			sessionid:getCookie('sid'),
			loginid:getCookie('uid'),
			operator:getCookie('uid'),
			page:currentpage,
			reqnum:pagesize,
			majorid:courseid,
			name:name,
			type:2,
			starttime:starttime,
			endtime:endtime
        }).done((res)=>{
            if(res.errcode==0){
                self.paperlist=res.paperlist;
                self.total=res.totalcount;
            }
        })
	},
	getAllClass(){//查询班级
        let self = this;
        post('/unifyexam/queryclasslist',{
            command:'unifyexam/queryclasslist',
            sessionid:getCookie('sid'),
            loginid:getCookie('uid'),
            teacherId:getCookie('uid'),
            stuId:''
        }).done((data)=>{
            if(data.errcode==0){
                self.classlist=data.classlist;
            	var rooms=[];
                var id=[];
                for (var i=0;i<data.classlist.length;i++) {
					rooms.push(data.classlist[i].name)
					id.push(data.classlist[i].id)
				}
                rooms.forEach((room, index) => {
			      self.dataclass.push({
			        label: room,
			        key: id[index],
			        rooms: rooms[index]
			      });
			    });
			}
        })
    },
	/**************************************选择考生*******************************************/ 
    selectstu(){
		this.dialogSelStu=true;
		this.dataclass=[];
		this.getAllClass();
	},
	sureclass(){//确认选择班级
		var self=this;
		self.classselected=[];
		for (var i=0;i<self.valueclass.length;i++) {
			for(var j=0;j<self.classlist.length;j++){
				if (self.valueclass[i]==self.classlist[j].id) {
					self.classselected.push({
						name:self.classlist[j].name,
						id:self.classlist[j].id
					})
				}
			}
		}
		this.dialogSelStu=false;
	},
    /*****************************************选择试卷**************************************************/
    closepop(){//关闭弹窗
		this.selectpapershow=false;
		this.selectsiteshow=false;
	},
	selectpaper(){//打开选择试卷pop
		this.selectpapershow=true;
	    this.querypaper(this.currentpage,this.pagesize,this.courseid,this.paperstarttime,this.paperendtime,this.papername)
	},
	handleCurrentChange(val) {//试卷分页
	    this.currentpage=val;
	    this.querypaper(this.currentpage,this.pagesize,this.courseid,this.paperstarttime,this.paperendtime,this.papername)
	},
	papertimechange(val){//试卷时间查询
		console.log(val)
		this.paperstarttime=val.slice(0,11);
		this.paperendtime=val.slice(12,23);
	    this.querypaper(this.currentpage,this.pagesize,this.courseid,this.paperstarttime,this.paperendtime,this.papername)
	},
	searchpaper(){//试卷名查询
	    this.querypaper(this.currentpage,this.pagesize,this.courseid,this.paperstarttime,this.paperendtime,this.papername)
	},
	checkpaper(row){//选择试卷
		this.selectpaperitem=row;
		this.selectpapershow=false;
		this.selectlist(row.paperid)
	},
	queryteacherlist(){//查询授课教师
        var self=this;
		post('/cls/teacherlist',{
            command:'cls/teacherlist',
          	sessionid: $.cookie('sid'),
          	loginid:$.cookie('uid'),
          	roleid:3,
        }).done((res)=>{
            if(res.errcode==0){
            	for (var i=0;i<res.teacherlist.length;i++) {
            		self.teacherlist.push({
            			label:res.teacherlist[i].teacherame,
            			value:res.teacherlist[i].teacherid
            		})
            	}
            }
        })
    },
	selectlist(paperid){//查询试卷题目
        var self=this;
        self.questionlist=[];
		post('/exampaper/queryselectedquestion',{
            command:'exampaper/queryselectedquestion',
          	sessionid: $.cookie('sid'),
          	loginid:$.cookie('uid'),
          	paperid:paperid,
          	questiontypeid:7
        }).done((res)=>{
            if(res.errcode==0){
            	for (var i=0;i<res.questionlist.length;i++) {
            		self.questionlist.push({
            			questionname:res.questionlist[i].questionname,
            			questionid:res.questionlist[i].questionbaseid,
						questionstarttime:'',
						questionendtime:'',
            			questionteacher:'',
            		})
            	}
            	
            }
        })
    },
	save(){//保存考试
//		console.log('-------save------------',JSON.stringify(this.siteselected),JSON.stringify(this.selectpaperitem),JSON.stringify(this.checkedStu),this.starttime,this.endtime)
		
        let self = this;
        if (!self.selectpaperitem) {
        	this.$message({
	          showClose: true,
	          message: '请选择考试试卷!',
	          type: 'error'
	        });
			return false;
        }
        if (self.classselected.length==0) {
        	this.$message({
	          showClose: true,
	          message: '请选择考试班级!',
	          type: 'error'
	        });
			return false;
        }
        var itemteacherlist=[];
        for (var i=0;i<self.questionlist.length;i++){
	        if (!self.questionlist[i].questionteacher) {
	        	self.$message({
		            showClose: true,
		            message: '请设置第'+(i+1)+'操作题的评卷老师!',
		            type: 'error'
		        });
				return false;
	        }else{
	        	if(self.questionlist[i].questionstarttime&self.questionlist[i].questionendtime){
			        var stime=Date.parse(moment(self.questionlist[i].questionstarttime).format('YYYY-MM-DD HH:mm:ss'))/1000;
					var etime=Date.parse(moment(self.questionlist[i].questionendtime).format('YYYY-MM-DD HH:mm:ss'))/1000;
			        if(etime<stime){
						self.$message({
				          showClose: true,
				          message: '第'+(i+1)+'操作题考试结束时间不可以早于考试开始时间!',
				          type: 'error'
				        });
				        self.questionlist[i].queestionendtime='';
						return false;
			        }else{
			        	itemteacherlist.push({
			        		teacherid: self.questionlist[i].questionteacher,
							starttime:moment(self.questionlist[i].questionstarttime).format('YYYY-MM-DD HH:mm:ss'),
							endtime:moment(self.questionlist[i].questionendtime).format('YYYY-MM-DD HH:mm:ss'),
			        		questionid: self.questionlist[i].questionid,
			        	})
			        }
		        }else{
		        	self.$message({
			            showClose: true,
			            message: '请设置第'+(i+1)+'操作题的考试时间!',
			            type: 'error'
			        });
					return false;
		        }
	        }
        }
        var stuarr=[];
        for (var i=0;i<self.classselected.length;i++) {
        	stuarr.push(self.classselected[i].id)
        }
        post('/unifyexam/addexam',{
            command:'unifyexam/addexam',
            sessionid:getCookie('sid'),
            loginid:getCookie('uid'),
            teacherid:getCookie('uid'),
            name:self.form.name,
            courseid:self.form.courseitem,
            model:self.form.modelitem.value,
            type:self.form.typeitem.value,
            starttime:'',
            endtime:'',
            paperid:self.selectpaperitem.paperid,
            classlist:stuarr,
            placelist:self.value,
            itemteacherlist:itemteacherlist,
        }).done((data)=>{
            if(data.errcode==0){
                this.$router.push({
				    name:'exam_test',
				    query:{
				    	
				    }
			    })
            }else{
            	this.$message({
		          showClose: true,
		          message: data.errdesc,
		          type: 'error'
		        });
				return false;
            }
        })
	},
	cancel(){//取消新增试卷
		history.go(-1)
	}
},
watch:{
	courseid:function(val){
		this.querypaper(this.currentpage,this.pagesize,this.courseid,this.paperstarttime,this.paperendtime,this.papername)
	},
}

}
</script>

<style scoped>
.nav{
	font-size: 13px;
	margin: 5px 0;
}
.blue{
	color:#20a0ff;
	cursor: pointer;
}
.content{
	border: 1px solid #bfcbd9;
}
.top{
	border-bottom: 1px solid #bfcbd9;
	padding: 25px 30px;
}
.top span{
	margin-right: 70px;
}
.bottom{
	/*padding: 50px 0;*/
	text-align: center;
}
.line{
	display: inline-block;
	margin: 0 30px;
}
.cell_line{
	text-align: center;
	margin: 50px auto;
}
.borderbottom{
	width: 90%;
	border-bottom: 1px solid #bfcbd9;
	padding-bottom: 20px;
}
.questioncontent{
	text-align: left;
	margin: 50px auto;
}
.questioncontent .line{
	margin-bottom: 20px;
}
.addbtn{
	margin-left: 10px;
}
.cell_right{
	margin-left: 30px;
    vertical-align: middle;
    line-height: 35px;
    min-height: 35px; 
    height: auto;
    width: 250px;
    padding: 0 20px;
}
.box{
	border: 1px solid #bfcbd9;
	border-radius: 4px;
}
.popbox{
    position: fixed;	
	background-color: #fff;
    z-index: 1;
    border: 1px solid #bfcbd9;
    width: 700px;
    height: 600px;
    left: 25%;
    top: 100px;
    padding: 10px;
}
.poptitle{
	border-bottom: 1px solid #bfcbd9;
	position: relative;
	padding: 10px 0;
}
.poptitle i{
	position: absolute;
    right: 0;
}
.popcontent{
	margin: 10px 0;
	text-align: left;
	width: 100%;
}
.popcontent .el-input{
	width: 200px;
}
.popcontent .el-select{
	width: 100px;
}
.popcontent_table{
	height: 460px;
	overflow: auto;
}
.pagebox{
	margin: 10px 0;
	text-align: center;
}
.popbtn{
	text-align: center;
	margin-bottom: 30px;
}

.bgpurple{
	background-color: #9932cd;
}
.bgblack{
	background-color: #475669;
}
.bgorange{
	background-color: #ff9966;
}
.labelbox{
	border-radius: 50%;
	color: #fff;
	width: 30px;
	height: 30px;
	line-height: 30px;
	text-align: center;
	display: inline-block;
	margin: 0 10px;
}
</style>