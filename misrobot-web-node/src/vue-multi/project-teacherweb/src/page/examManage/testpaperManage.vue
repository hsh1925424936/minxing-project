<template>
	<div class="exam">
		
		<el-button type="primary" class="addbtn" @click="newpapershow">新建试卷</el-button>
		<div class="top">
			<el-input placeholder="请输入试卷名" v-model="papername"></el-input>
			<el-button type="primary" class="addbtn" @click="searchpaper">查询</el-button>
		</div>
		<div class="filtrate">
			<el-select v-model="courseid" placeholder="全部课程">
			    <el-option :key="all.value" :label="all.label" :value="all.vale"> </el-option>
			    <el-option v-for="item in courselist" :key="item.id" :label="item.name" :value="item.id"> </el-option>
			</el-select>
			<el-select v-model="type" placeholder="全部类型">
			    <el-option :key="all.value" :label="all.label" :value="all.vale"> </el-option>
			    <el-option v-for="item in typelist" :key="item.value" :label="item.label" :value="item.value"> </el-option>
			</el-select>
			 <el-date-picker v-model="time" @change="timechange" type="daterange" align="right" placeholder="选择日期范围" :picker-options="pickerOptions"> </el-date-picker>
		</div>
		<div class="table">
			<el-table :data="paperlist" @row-click="checkpaper" border style="width: 100%">
		      <el-table-column label="试卷名称">
		      	<template scope="scope">
		      		<div class="labelbox bgpurple" v-if="scope.row.type==1">理</div>
		      		<div class="labelbox bgblack" v-if="scope.row.type==2">操</div>
		      		<div class="labelbox bgorange" v-if="scope.row.type==5">随</div>
		      		<span>{{scope.row.name}}</span>
		      	</template>
		      </el-table-column>
		      <el-table-column prop="majorname" label="课程"></el-table-column>
		      <el-table-column prop="operatortime" label="考试时间"></el-table-column>
		      <el-table-column label="操作">
		      	<template scope="scope">
					<el-button size="small" type="primary" @click.stop="editpaper(scope.row.paperid,scope.row.type)">编辑</el-button>
					<el-button size="small" type="danger" @click.stop="deletepaperbtn(scope.row.paperid)">删除</el-button>
				</template>
		      </el-table-column>
		    </el-table>
		    <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentpage" :page-sizes="[10, 20, 30, 50]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    		</el-pagination>
		</div>
		
		<!--弹出窗口-->
		<el-dialog title="新增试卷" :visible.sync="dialogFormVisible">
	      <el-form :model="form">
	      	<el-form-item label="试卷名称：" :label-width="formLabelWidth">
	          <el-input class="popinput" maxlength="50" v-model="form.name" placeholder="请输入试卷名称"></el-input>
	        </el-form-item>
	        <el-form-item label="课程：" :label-width="formLabelWidth">
	          <el-select v-model="form.courseid" placeholder="请选择">
	            <el-option v-for="item in courselist" :label="item.name" :value="item.id"></el-option>
	          </el-select>
	        </el-form-item>
	        <el-form-item label="试卷类型：" :label-width="formLabelWidth">
	          <el-select v-model="form.type" placeholder="请选择">
	            <el-option v-for="item in typelist" :label="item.label" :value="item.value"></el-option>
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
	      	<el-form-item label="确定要删除此试卷吗？" :label-width="formLabelWidth"></el-form-item>
	      </el-form>
	      <div slot="footer" class="dialog-footer">
	        <el-button @click="deleteshow = false">取 消</el-button>
	        <el-button type="primary" @click="deletepaper(deletepaperid)">确 定</el-button>
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
  		currentpage:1,//当前页码
  		pagesize:10,//每页条数
  		total:0,//数据总数
  		paperlist:[],//试卷列表
  		courselist:[],//课程列表
  		typelist: [{value: '1',label: '理论试卷'}, {value: '2',label: '操作试卷'}, {value: '5',label: '随堂小测'}],//类型列表
  		all:{value:'',label:'全部'},
  		courseid:'',//课程id
  		type:'',//试卷类型学
  		time:'',//时间范围
  		starttime:'',//开始时间
  		endtime:'',//结束时间
  		papername:'',//试卷名
  		pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        //弹框
	    dialogFormVisible: false,
	    form: {
	        name: '',
	        type: '',
	        courseid:''
	    },
	    formLabelWidth: '200px',
	    deleteshow:false,
	    deletepaperid:''
  	}
},
props: {
  	newpaper:Boolean,
},
mounted(){
	if (this.newpaper) {
		this.dialogFormVisible=true
	}
	this.querypaper(this.currentpage,this.pagesize,this.courseid,this.type,this.starttime,this.endtime,this.papername)
	this.queryCourse();
},
methods: {
	handleSizeChange(val) {
	    this.pagesize=val;
	    this.querypaper(this.currentpage,this.pagesize,this.courseid,this.type,this.starttime,this.endtime,this.papername)
	},
	handleCurrentChange(val) {
	    this.currentpage=val;
	    this.querypaper(this.currentpage,this.pagesize,this.courseid,this.type,this.starttime,this.endtime,this.papername)
	},
	timechange(val){
		this.starttime=val.slice(0,11);
		this.endtime=val.slice(12,23);
		this.querypaper(this.currentpage,this.pagesize,this.courseid,this.type,this.starttime,this.endtime,this.papername)
	},
	newpapershow(){
		this.dialogFormVisible = true;
		this.form= {
	        name: '',
	        type: '',
	        courseid:''
	    }
	},
	dialogconfirm(){
	    var self=this
	    if (!self.form.name) {
	    	this.$message({
	          message: '请填写试卷名称',
	          type: 'warning'
	        });
	        return false
	    }
	    if (!self.form.type) {
	    	this.$message({
	          message: '请选择试卷类型',
	          type: 'warning'
	        });
	        return false
	    }
	    if (!self.form.courseid) {
	    	this.$message({
	          message: '请选择所属课程',
	          type: 'warning'
	        });
	        return false
	    }
	    post('/exampaper/addpaper',{
            command:"exampaper/addpaper",
			sessionid:getCookie('sid'),
			loginid:getCookie('uid'),
			name:self.form.name,
			type:self.form.type,
			majorid:self.form.courseid,
        }).done((res)=>{
            if(res.errcode==0){
               if(self.form.type==1||self.form.type==5){//理论试卷
			    	this.$router.push({
				      name:'testpaper_addtheory',
				      query:{
				      	type:self.form.type,
				      	paperid:res.paperid
				      }
				    })
			    }
			    if(self.form.type==2){//操作试卷
			    	this.$router.push({
				      name:'testpaper_addoperate',
				      query:{
				      	form:self.form,
				      	paperid:res.paperid
				      }
				    })
			    } 
            }
        })
	},
	querypaper(currentpage,pagesize,courseid,type,starttime,endtime,name){
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
			type:type,
			starttime:starttime,
			endtime:endtime
        }).done((res)=>{
            if(res.errcode==0){
                self.paperlist=res.paperlist;
                self.total=res.totalcount;
            }
        })
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
	searchpaper(){//根据试卷名查询
		this.querypaper(this.currentpage,this.pagesize,this.courseid,this.type,this.starttime,this.endtime,this.papername)
	},
	deletepaperbtn(id){
		this.deleteshow=true;
		this.deletepaperid=id;
	},
	deletepaper(paperid){//删除试卷
		var self=this;
		post('/exampaper/deletepaper',{
            command:'exampaper/deletepaper',
			sessionid:getCookie('sid'),
			loginid:getCookie('uid'),
			paperid:paperid
        }).done((res)=>{
            if(res.errcode==0){
                console.log(res)
                this.$message({
		          showClose: true,
		          message: '删除试卷成功',
		          type: 'success'
		        });
                this.querypaper(this.currentpage,this.pagesize,this.courseid,this.type,this.starttime,this.endtime,this.papername)
                self.deleteshow=false;
            }
        })
	},
	editpaper(paperid,type){
		var self=this
	    if(type==1||type==5){//理论试卷||随堂小测
	    	this.$router.push({
		      name:'testpaper_addtheory',
		      query:{
		      	type:type,
		      	paperid:paperid
		      }
		    })
	    }
	    if(type==2){//操作试卷
	    	this.$router.push({
		      name:'testpaper_addoperate',
		      query:{
		      	type:type,
		      	paperid:paperid
		      }
		    })
	    }
	},
	checkpaper(row){
		console.log(JSON.stringify(row))
		var self=this
	    if(row.type==1||row.type==5){//理论试卷||随堂小测
	    	this.$router.push({
		      name:'testpaper_checktheory',
		      query:{
//		      	type:row.type,
		      	paperid:row.paperid
		      }
		    })
	    }
	    if(row.type==2){//操作试卷
	    	this.$router.push({
		      name:'testpaper_checkoperate',
		      query:{
//		      	type:row.type,
		      	paperid:row.paperid
		      }
		    })
	    }
	}
},
watch:{
	courseid:function(val){
		console.log(this.courseid)
		this.querypaper(this.currentpage,this.pagesize,this.courseid,this.type,this.starttime,this.endtime,this.papername)
	},
	type:function(val){
		this.querypaper(this.currentpage,this.pagesize,this.courseid,this.type,this.starttime,this.endtime,this.papername)
	},
}



}
</script>
<style scoped>
.exam{
	text-align: left;
	position: relative;
}
.top{
	display: inline-block;
	width: 370px;
	float: right;
}
.top .el-input {
	width: 60%;
	display: inline-block;
}
.addbtn{
	margin: 10px 30px;
}
.filtrate{
	margin: 10px 30px;
}
.filtrate .el-select{
	margin: 0 10px 10px 0;
}
.exam .table{
	width: 95%;
    margin: auto;
    margin-bottom: 10px;
    text-align: left;
}
.page{
	margin: 20px 0;
	text-align: center;
}
.el-table th{
	text-align: center;
}
.popinput{
	width: 220px;
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
</style>