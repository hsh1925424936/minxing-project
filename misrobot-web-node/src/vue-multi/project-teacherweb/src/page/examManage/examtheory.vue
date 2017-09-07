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
				<p class="cell_line">
					考试时间:
					<el-date-picker v-model="timeval1" @change="stimechange" type="datetime" placeholder="开始时间" :picker-options="pickerOptions" class="cell_right"></el-date-picker>
					<el-date-picker v-model="timeval2" @change="etimechange" type="datetime" placeholder="结束时间" :picker-options="pickerOptions" class="cell_right"></el-date-picker>
				</p>
				<p class="cell_line">
					考试试卷:
					<label class="cell_right box" style="min-height: 35px; height: auto;width: 310px;padding: 0 20px;">{{selectpaperitem.name}}</label><el-button type="primary" class="addbtn" @click="selectpaper">选择</el-button>
				</p>
				<p class="cell_line">
					考生范围:
					<label class="cell_right box" style="min-height: 35px; height: auto;width: 310px;padding: 0 20px;"><span v-for="item in classselected">{{item.name}}</span> </label><el-button type="primary" class="addbtn" @click="selectstu">选择</el-button>
				</p>
				<p class="cell_line" v-if="form.modelitem.value==1">
					答题方式:
					<el-radio-group class="cell_right" v-model="radio">
					    <el-radio :label="0">电脑答题</el-radio>
					    <el-radio :label="1">手机答题</el-radio>
					</el-radio-group>
				</p>
				<p class="cell_line">
					考试地点:
					<label class="cell_right box" style="min-height: 35px; height: auto;width: 310px;padding: 0 20px;"><p v-for="item in siteselected">{{item.name}}</p></label><el-button type="primary" class="addbtn" @click="selectsite">选择</el-button>
				</p>
				<p class="cell_line" style="text-align: center;">
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
        <el-dialog  title="选择试卷" :visible.sync="selectpapershow" :close-on-click-modal="false" @close="">
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
		</el-dialog>
		<!--考试地点-->
        <el-dialog  title="选择教室" :visible.sync="selectsiteshow" :close-on-click-modal="false" @close="">
			<p class="popcontent">
				<el-transfer
				    filterable
				    :filter-method="filterMethod"
				    filter-placeholder="请输入楼栋或教室"
				    v-model="value"
				    :data="data"
				    style="margin: auto;width: 460px;">
				</el-transfer>
			</p>
			<p class="popcontent" style="text-align: center;margin-top: 20px;">
				<el-button type="primary" @click="sure">确认</el-button>
				<el-button @click="closepop">取消</el-button>
			</p>
		</el-dialog>
	</div>
</template>

<script>
import {post,setCookie,getCookie,setTitle} from '../../config/util'
import breadcrumb from '../../components/breadcrumb'
import translist from '../../components/translist'
import $ from 'jquery'
export default {
	
data() {
  	return {
		form: {//新增考试det
	        name: this.$route.query.name,//考试名
	        courseitem: this.$route.query.courseitem,//考试课程
	        typeitem: {
	        	value:this.$route.query.typevalue,
	        	label:this.$route.query.typelabel,
	        },//考试类型
	        modelitem: {
	        	value:this.$route.query.modelvalue,
	        	label:this.$route.query.modellabel,
	        }//考试形式
	    },
		coursename:'',
  		starttime:'',//考试开始时间
        endtime:'',//考试结束时间
		timeval1:'',//考试开始时间value
		timeval2:'',//考试结束时间value
		selectpapershow:false,//选择试卷pop
        selectpaperitem:'',//已选试卷item
        papertime:'',//查询试卷时间
  		currentpage:1,//当前页码
		pagesize:10,//每页条数
  		total:0,//数据总数
  		paperlist:[],//试卷列表
        courselist:[],//课程选择
        courseid:'',//选择课程id
        paperstarttime:'',//试卷开始时间
        paperendtime:'',//试卷技术时间
        papername:'',//试卷名
  		pickerOptions: {//试卷操作时间快捷
        	disabledDate(time) {
	            return time.getTime() < Date.now() - 8.64e7;
	        }
        },
        
        dialogSelStu:false,//选择学生pop
        dataclass:[],
        valueclass:[],
        filterclass(query, item) {//班级查询
          return item.rooms.indexOf(query) > -1;
        },
        classlist:[],//班级列表
		classselected:[],//已选班级
        
  		selectsiteshow:false,//教室pop
		data:[],//教室pop数据
        value: [],//已选教室id列表
        filterMethod(query, item) {//教室查询
          return item.sites.indexOf(query) > -1;
        },
		radio:'',//选择考试模式
        sitelist:[],//教室列表
        siteselected:[]//已选教室列表
  	}
},
components: {
    breadcrumb,
    translist
},
mounted(){
	if(this.form.modelitem.value==1){
		this.radio=0
	}
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
	querysite(){//查询场地
		var self=this;
		post('/site/listplace',{
            command:"site/listplace",
			sessionid:getCookie('sid'),
			loginid:getCookie('uid'),
			pagenum:1,
			pagepersize:1000,
        }).done((res)=>{
            if(res.errcode==0){
				var sites=[];
				self.sitelist=res.placelist;
				var id=[];
				for (var i=0;i<res.placelist.length;i++) {
					sites.push(res.placelist[i].name)
					id.push(res.placelist[i].id)
				}
				sites.forEach((site, index) => {
			      self.data.push({
			        label: site,
			        key: id[index],
			        sites: sites[index]
			      });
			  });
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
			type:6,
			starttime:starttime,
			endtime:endtime
        }).done((res)=>{
            if(res.errcode==0){
                self.paperlist=res.paperlist;
                self.total=res.totalcount;
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
	stimechange(val){//考试开始时间
		var nowtime=Date.parse(new Date())/1000;
		var stime=Date.parse(val)/1000;
        if(stime>nowtime){
			this.starttime=val;
        }else{
			this.$message({
	          showClose: true,
	          message: '考试开始时间不可以早于当前时间!',
	          type: 'error'
	        });
	        this.timeval1='';
			return false;
        }
	},
	etimechange(val){//考试结束时间
		if(!this.starttime){
			this.$message({
	          showClose: true,
	          message: '请选择开始时间!',
	          type: 'error'
	       });
			return false;
		}
		var stime=Date.parse(this.starttime)/1000;
		var etime=Date.parse(val)/1000;
        if(etime>stime){
			this.endtime=val
        }else{
			this.$message({
	          showClose: true,
	          message: '考试结束时间不可以早于考试开始时间!',
	          type: 'error'
	        });
	        this.timeval2='';
			return false;
        }
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
	},
    /*****************************************选择场地**************************************************/
	selectsite(){
		this.selectsiteshow=true;
		this.data=[];
		this.querysite();
	},
	sure(){//确定场地选择
		var self=this;
		self.siteselected=[];
		for (var i=0;i<self.value.length;i++) {
			for(var j=0;j<self.sitelist.length;j++){
				if (self.value[i]==self.sitelist[j].id) {
					self.siteselected.push({
						name:self.sitelist[j].build+self.sitelist[j].floor+self.sitelist[j].name,
						id:self.sitelist[j].id
					})
				}
			}
		}
		this.selectsiteshow=false;
	},
	
	save(){//保存考试
        let self = this;
        if(!self.starttime&&!self.endtime){
        	this.$message({
	          showClose: true,
	          message: '请选择考试时间!',
	          type: 'error'
	        });
			return false;
        }
        var stime=Date.parse(this.starttime)/1000;
		var etime=Date.parse(this.endtime)/1000;
        if(etime<stime){
			this.$message({
	          showClose: true,
	          message: '考试结束时间不可以早于考试开始时间!',
	          type: 'error'
	        });
	        this.timeval2='';
			return false;
        }
        if(!self.selectpaperitem){
        	this.$message({
	          showClose: true,
	          message: '请选择考试试卷!',
	          type: 'error'
	        });
			return false;
        }
        if(self.classselected.length==0){
        	this.$message({
	          showClose: true,
	          message: '请选择考生范围!',
	          type: 'error'
	        });
			return false;
        }
        if(self.siteselected.length==0){
        	this.$message({
	          showClose: true,
	          message: '请选择考试地点!',
	          type: 'error'
	        });
			return false;
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
            starttime:self.starttime,
            endtime:self.endtime,
            answermode:self.radio,
            paperid:self.selectpaperitem.paperid,
            classlist:stuarr,
            placelist:self.value,
            itemteacherlist:[],
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
	}
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
	padding: 100px 0;
}
.cell_line{
	text-align: left;
    margin-bottom: 30px;
    width: 600px;
    margin: 0 auto 30px;
}
.addbtn{
	margin-left: 10px;
}
.cell_right{
	margin-left: 30px;
	width: 192px;
	height: 35px;
    vertical-align: middle;
    line-height: 35px;
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
    cursor: pointer;
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
.transfer-footer {
    margin-left: 20px;
    padding: 6px 5px;
  }
</style>