<template>
	<div class="exam">
		<el-button type="primary" class="addbtn" @click="confirmshow">新建考试</el-button>
		<div class="filtrate">
			<el-select v-model="courseid" @change="filtrate" placeholder="全部课程">
			    <el-option label="全部" value=""> </el-option>
			    <el-option v-for="item in courselist" :key="item.id" :label="item.name" :value="item.id"> </el-option>
			</el-select>
			<el-select v-model="typevalue" @change="filtrate" placeholder="全部类型">
			    <el-option v-for="item in typelist" :key="item.value" :label="item.label" :value="item.value"> </el-option>
			</el-select>
			<el-select v-model="modelvalue" @change="filtrate" placeholder="全部形式">
			    <el-option v-for="item in modellist" :key="item.value" :label="item.label" :value="item.value"> </el-option>
			</el-select>
			<el-select v-model="statusvalue" @change="filtrate" placeholder="全部状态">
			    <el-option v-for="item in statuslist" :key="item.value" :label="item.label" :value="item.value"> </el-option>
			</el-select>
			<el-select v-model="timevalue" @change="filtrate" placeholder="全部状态">
			    <el-option v-for="item in timelist" :key="item.value" :label="item.label" :value="item.value"> </el-option>
			</el-select>
		</div>
		<div class="table">
			<el-table :data="examlist" @row-click="checkexam" style="width: 100%">
			  <el-table-column width="80px">
		      	<template scope="scope">
		      		<span class="labelbox bgpurple" v-if="scope.row.model=='理论笔试'">笔</span>
		      		<span class="labelbox bggreen" v-if="scope.row.model=='理论机试'">机</span>
		      		<span class="labelbox bgblack" v-if="scope.row.model=='操作考试'">操</span>
			    </template>
		      </el-table-column>
		      <el-table-column label="考试名称">
		      	<template scope="scope">
			        <span style="margin-left: 10px">{{ scope.row.name }}</span>
			    </template>
		      </el-table-column>
		      <el-table-column width="120px">
		      	<template scope="scope">
			        <span class="namelabel bgblue" v-if="scope.row.status==0">待考试</span>
			        <span class="namelabel bggreen" v-if="scope.row.status==1">考试中</span>
			        <span class="namelabel bgorange" v-if="scope.row.status==2">待评卷</span>
			        <span class="namelabel bggray" v-if="scope.row.status==3">已结束</span>
			    </template>
		      </el-table-column>
		      <el-table-column prop="courseName" label="课程"></el-table-column>
		      <el-table-column prop="type" label="考试类型"></el-table-column>
		      <el-table-column prop="time" label="考试时间" width="180px"></el-table-column>
		      <el-table-column prop="site" label="考试地点">
		      	<template scope="scope">
			        <span style="margin-left: 10px" v-for="item in scope.row.place">{{item.placename}}</span>
			    </template>
		      </el-table-column>
		      <el-table-column label="操作" width="150px">
		      	<template scope="scope">
					<el-button size="small" type="primary" @click.stop="editexam(scope.row)" v-if="scope.row.status==0&&teacherid==scope.row.creator">编辑</el-button>
					<el-button size="small" type="danger" @click.stop="deleteexambtn(scope.row.examid)" v-if="scope.row.status==0&&teacherid==scope.row.creator">删除</el-button>
				</template>
		      </el-table-column>
		    </el-table>
		    <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    		</el-pagination>
		</div>
		<!--弹出窗口-->
		<el-dialog title="新增考试" :visible.sync="dialogFormVisible">
	      <el-form :model="form">
	      	<el-form-item label="考试名称：" :label-width="formLabelWidth">
	          <el-input class="popinput" :maxlength="50" v-model="form.name" placeholder="请输入考试名称"></el-input>
	        </el-form-item>
	        <el-form-item label="课程：" :label-width="formLabelWidth">
	          <el-select v-model="form.courseitem"  placeholder="请选择">
	            <el-option v-for="item in courselist" :key="item.id" :label="item.name" :value="item.id"> </el-option>
	          </el-select>
	        </el-form-item>
	        <el-form-item label="考试类型：" :label-width="formLabelWidth">
	          <el-select v-model="form.typeitem" placeholder="请选择">
			    <el-option v-for="item in typelist" :key="item.value" :label="item.label" :value="item" v-if="item.value!=-1"> </el-option>
	          </el-select>
	        </el-form-item>
	        <el-form-item label="考试形式：" :label-width="formLabelWidth">
	          <el-select v-model="form.modelitem" placeholder="请选择">
			    <el-option v-for="item in modellist" :key="item.value" :label="item.label" :value="item" v-if="item.value!=-1"> </el-option>
	          </el-select>
	        </el-form-item>
	      </el-form>
	      <div slot="footer" class="dialog-footer">
	        <el-button @click="dialogFormVisible = false">取 消</el-button>
	        <el-button type="primary" @click="dialogconfirm">确 定</el-button>
	      </div>
	    </el-dialog>
	    <!--弹出窗口-->
		<el-dialog title="删除试卷" :visible.sync="deleteshow">
	      <el-form :model="form">
	      	<el-form-item label="确定要删除此考试吗？"></el-form-item>
	      </el-form>
	      <div slot="footer" class="dialog-footer">
	        <el-button @click="deleteshow = false">取 消</el-button>
	        <el-button type="primary" @click="deleteexam(deleteexamid)">确 定</el-button>
	      </div>
	    </el-dialog>
		
	</div>
</template>

<script>
import {post,setCookie,getCookie,setTitle} from '../../config/util'
import $ from 'jquery'
export default {
data() {
  	return {
    	//弹框
	    dialogFormVisible: false,//新增考试pop
	    formLabelWidth: '120px',//新增考试pop宽度
	    form: {//新增考试det
	        name: '',//考试名
	        courseitem: '',//考试课程
	        typeitem: '',//考试类型
	        modelitem: '',//考试形式
	    },
  		courselist:[],//学科列表
  		typelist:[{value:'-1',label:'全部类型'},{value:'0',label:'单元考试'},{value:'1',label:'期中考试'},{value:'2',label:'期末考试'}],
//		modellist:[{value:'-1',label:'全部形式'},{value:'0',label:'理论笔试'},{value:'1',label:'理论机试'},{value:'2',label:'操作考试'}],
  		modellist:[{value:'-1',label:'全部形式'},{value:'1',label:'理论机试'},{value:'2',label:'操作考试'}],
  		//筛选
  		courseid:'',//学科id
  		typevalue:'-1',//类型
  		modelvalue:'-1',//形式
  		statusvalue:'-1',//状态
  		timevalue:'-1',//时间
  		statuslist:[{value:'-1',label:'全部状态'},{value:'0',label:'待考试'},{value:'1',label:'考试中'},{value:'2',label:'待评卷'},{value:'3',label:'已结束'}],
  		timelist:[{value:'-1',label:'全部时间'},{value:'0',label:'近三天'},{value:'1',label:'一周'},{value:'2',label:'一个月'},{value:'3',label:'一月以上'}],
	    examlist:[],//考试列表
	    currentPage:1,
  		pagesize:10,
  		total:0,
  		teacherid:getCookie('uid'),
	    deleteshow:false,
	    deleteexamid:''
  	}
},
mounted(){
	this.queryexam(this.currentPage,this.pagesize,this.courseid,this.modelvalue,this.typevalue,this.statusvalue,this.timevalue);
	this.queryCourse();
},
methods: {
	handleSizeChange(val) {//分页每页条数
		this.pagesize=val;
		this.queryexam(this.currentPage,this.pagesize,this.courseid,this.modelvalue,this.typevalue,this.statusvalue,this.timevalue);
	},
	handleCurrentChange(val) {//分页当前页
		this.currentPage=val;
		this.queryexam(this.currentPage,this.pagesize,this.courseid,this.modelvalue,this.typevalue,this.statusvalue,this.timevalue);
	},
	confirmshow(){
		this.form= {
	        name: '',//考试名
	        courseitem: '',//考试课程
	        typeitem: '',//考试类型
	        modelitem: ''//考试形式
	    }
		this.dialogFormVisible=true
	},
	dialogconfirm(){//确认新增考试
		var self=this;console.log(JSON.stringify(this.form))
		if (!self.form.name) {
	    	this.$message({
	          message: '请填写考试名称',
	          type: 'warning'
	        });
	        return false
	    }
	    if (!self.form.courseitem) {
	    	this.$message({
	          message: '请选择考试课程',
	          type: 'warning'
	        });
	        return false
	    }
	    if (!self.form.typeitem) {
	    	this.$message({
	          message: '请选择考试类型',
	          type: 'warning'
	        });
	        return false
	    }
	    if (!self.form.modelitem) {
	    	this.$message({
	          message: '请选择考试形式',
	          type: 'warning'
	        });
	        return false
	    }
	    if(self.form.modelitem.value==0||self.form.modelitem.value==1){//理论考试
	    	this.$router.push({
		      name:'examtheory',
		      query:{
		      	name:self.form.name,
		      	courseitem:self.form.courseitem,
		      	typevalue:self.form.typeitem.value,
		      	typelabel:self.form.typeitem.label,
		      	modelvalue:self.form.modelitem.value,
		      	modellabel:self.form.modelitem.label,
		      }
		    })
	    }
	    if(self.form.modelitem.value==2){//操作考试
	    	this.$router.push({
		      name:'examoperate',
		      query:{
		      	name:self.form.name,
		      	courseitem:self.form.courseitem,
		      	typevalue:self.form.typeitem.value,
		      	typelabel:self.form.typeitem.label,
		      	modelvalue:self.form.modelitem.value,
		      	modellabel:self.form.modelitem.label,
		      }
		    })
	    } 
	},
	queryCourse(){//查询学科列表
        var self=this;
		post('/cls/selectCourses',{
            command:"cls/selectCourses",
            sessionid:getCookie('sid'),
            loginid:getCookie('uid')
        }).done((res)=>{
            if(res.errcode==0){
                console.log(res)
                self.courselist=res.courseslist;
            }
        })
	},
	filtrate(){//筛选
		console.log(this.currentPage,this.pagesize,'courseid:'+this.courseid,'modelvalue:'+this.modelvalue,'typevalue:'+this.typevalue,'statusvalue:'+this.statusvalue,'timevalue:'+this.timevalue)
		this.queryexam(this.currentPage,this.pagesize,this.courseid,this.modelvalue,this.typevalue,this.statusvalue,this.timevalue);
	},
	queryexam(currentPage,pagesize,courseid,model,type,status,time){//查询考试列表
		var self=this;
		post('/unifyexam/queryExam',{
            command:"unifyexam/queryExam",
            loginid:getCookie('uid'),
            sessionid:getCookie('sid'),
            teacherid:getCookie('uid'),
            status:status,
			courseid:courseid,
			model:model,
			type:type,
			pagenum:currentPage,
			pagesize:pagesize,
			time:time
        }).done((res)=>{
            if(res.errcode==0){
                console.log(res)
                self.examlist=res.examlist;
                self.total=res.totalcount;
            }
        })
	},
	checkexam(row){//查看考试详情
		if(row.model=='理论笔试'){//理论考试
	    	this.$router.push({
		      name:'det_quiztheory',
		      query:{
		      	examid:row.examid,
		      }
		    })
	    }
		if(row.model=='理论机试'){//理论考试
	    	this.$router.push({
		      name:'det_quiztheory',
		      query:{
		      	examid:row.examid,
		      }
		    })
	    }
	    if(row.model=='操作考试'){//操作考试
	    	this.$router.push({
		      name:'det_operate',
		      params:{
		      	examid:row.examid
		      }
		    })
	    } 
	},
	deleteexambtn(id){
		this.deleteshow=true;
		this.deleteexamid=id;
	},
	deleteexam(examid){//删除考试
		var self=this;
		post('/unifyexam/deleteUnifyExam',{
            command:"unifyexam/deleteUnifyExam",
            loginid:getCookie('uid'),
            sessionid:getCookie('sid'),
            examid:examid
        }).done((res)=>{
            if(res.errcode==0){
               self.queryexam(self.currentPage,self.pagesize,self.courseid,self.modelvalue,self.typevalue,self.statusvalue,self.timevalue);
				this.deleteshow=false;
            }
        })
	},
	editexam(row){//编辑试卷
		var self=this;console.log(JSON.stringify(row))
		if(row.model=='理论机试'||row.model=='理论笔试'){//理论考试
	    	this.$router.push({
		      name:'editexamtheory',
		      query:{
		      	examid:row.examid,
		      }
		    })
	    }
	    if(row.model=='操作考试'){//操作考试
	    	this.$router.push({
		      name:'editexamoperate',
		      query:{
		      	examid:row.examid,
		      }
		    })
	    } 
	}
},



}
</script>
<style scoped> 
.addbtn{
	margin: 10px 20px;
}
.filtrate{
	margin: 10px 20px;
}
.filtrate .el-select{
	margin: 0 10px 10px 0;
	width: 17%;
}
.exam .table{
	width: 95%;
    margin: auto;
    margin-bottom: 10px; 
}
.page{
	margin: 20px 0;
	text-align:center;
}
.popinput{
	width: 221px;
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
.bgpurple{
	background-color: #9932cd;
}
.bgblack{
	background-color: #475669;
}
.bgorange{
	background-color: #ff9966;
}
.bggreen{
	background-color: #09f981;
}
.bgblue{
	background-color: #09d5f9;
}
.bggray{
	background-color: #a2a9aa;
}
.namelabel{
    color: #fff;
    padding: 3px 5px;	
    margin-left: 10px;
    border-radius: 5px;
}
</style>