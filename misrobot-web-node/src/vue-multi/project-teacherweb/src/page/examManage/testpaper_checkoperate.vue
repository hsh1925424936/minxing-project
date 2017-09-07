<template>
	<div class="checkoperate">
		<p class="nav"><span class="blue"  @click="cancel">考试&试卷</span> > 查看试卷</p>
		<div class="content">
			<div class="line">
	    		<p class="box marginright">试卷名称：{{papername}}</p>
	    		<p class="box marginright">试卷类型：{{papertype}}</p>
	    		<p class="box marginright">试卷总分：{{score}}</p>
	    		<p class="box marginright">题目总数：{{questiontotalnum}}</p>
	    		<el-button @click="cancel">返回</el-button>
	    	</div>
	    	<div class="line">
	    		<p class="box" style="margin-bottom: 20px;">分值设置：</p>
	    		<el-table :data="selectquestionlist" border style="width: 100%">
			      <el-table-column type="index" label="序号" width="150"></el-table-column>
			      <el-table-column prop="questionname" label="题目名称"></el-table-column>
			      <el-table-column prop="coursename" label="所属类别"></el-table-column>
			      <el-table-column prop="labname" label="标签"></el-table-column>
			      <el-table-column prop="score" label="分值"></el-table-column>
			      <el-table-column label="操作" width="200">
			      	<template scope="scope">
						<el-button type="primary" size="small" @click="check(scope.row)">查看</el-button>
					</template>
			      </el-table-column>
			    </el-table>
	    	</div>
		</div>	
		<!--弹出窗口-->
		<el-dialog title="查看题目-操作题" :visible.sync="dialogFormVisible">
	      
	      <p><span>题目</span>{{popname}}</p>
	      <p><span>题目描述</span>{{popcomment}}</p>
	      <div class="operatepop">
	      	<span>评分表</span>
	      	<div v-for="(item,index) in operatelist">
	      		<p>{{item.title}}</p>
		      	<el-table :data="item.objlist" border style="width: 100%">
			      	<el-table-column type="index" label="序号" width="50"></el-table-column>
			        <el-table-column prop="rightoperation" label="评分项"></el-table-column>
			        <el-table-column prop="gradeitemscore" label="分值"></el-table-column>
			        <el-table-column prop="gradelevel" label="步长"></el-table-column>
			        <el-table-column prop="gradelevel" label="评分表级别"></el-table-column>
			        <el-table-column prop="classification1" label="分级1"></el-table-column>
			        <el-table-column prop="classification2" label="分级2"></el-table-column>
			        <el-table-column prop="classification3" label="分级3"></el-table-column>
			        <el-table-column prop="classification4" label="分级4"></el-table-column>
			        <el-table-column prop="classification5" label="分级5"></el-table-column>
			    </el-table>
	      	</div>
	      	
	      </div>
	      
	      
	      <div slot="footer" class="dialog-footer">
	        <el-button @click="dialogFormVisible = false">关闭</el-button>
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
		    popname:'',//操作题名
		    popcomment:'',//操作题描述
		    poptype:'',//操作项类型
		    operatelist:[],//操作项列表
		    
	  		selectquestionlist:[],//已选题目列表
	  		paperid:this.$route.query.paperid,
	  		papername:'',
	  		papertype:'',
	  		coursename:'',
	  		score:'',
	  		questiontotalnum:'',
	  		
			list:[{quename:'男性导尿术操作',category:'内科学',label:'症状',score:'15'},{quename:'男性导尿术操作',category:'内科学',label:'症状',score:'15'},{quename:'男性导尿术操作',category:'内科学',label:'症状',score:'15'},{quename:'男性导尿术操作',category:'内科学',label:'症状',score:'15'},{quename:'男性导尿术操作',category:'内科学',label:'症状',score:'15'},{quename:'男性导尿术操作',category:'内科学',label:'症状',score:'15'},{quename:'男性导尿术操作',category:'内科学',label:'症状',score:'15'},{quename:'男性导尿术操作',category:'内科学',label:'症状',score:'15'},{quename:'男性导尿术操作',category:'内科学',label:'症状',score:'15'},{quename:'男性导尿术操作',category:'内科学',label:'症状',score:'15'},{quename:'男性导尿术操作',category:'内科学',label:'症状',score:'15'},],
	  	}
	},
	mounted(){
		this.getselectlist();
		this.querypaperinfo()
	},
	methods:{
		dialogconfirm(){//查看操作题
			
		},
		querypaperinfo(){//查询试卷信息
			var self=this;
			post('/exampaper/viewpaper',{
	            command:"exampaper/viewpaper",
	            sessionid:getCookie('sid'),
	            loginid:getCookie('uid'),
				paperid:self.paperid,
	        }).done((res)=>{
	            if(res.errcode==0){
	            	self.papername=res.paperinfo.name;
	            	self.papertype=res.paperinfo.type;
	            	self.coursename=res.paperinfo.majorname;
	            	self.score=res.paperinfo.score;
	            }
	        })
		},
        getselectlist(){
            var self=this;
			post('/exampaper/queryselectedquestion',{
	            command:'exampaper/queryselectedquestion',
              	sessionid: $.cookie('sid'),
              	loginid:$.cookie('uid'),
              	paperid:self.paperid,
              	questiontypeid:7
	        }).done((res)=>{
	            if(res.errcode==0){
	            	self.selectquestionlist=res.questionlist;
	            	self.questiontotalnum=res.allcount;
	            }
	        })
        },
		cancel(){
			this.$router.push({
		        name:'exam_test',
		        query:{
		      	    value:'2'
		        }
		    })
		},
		check(row){
			var self=this;
			self.dialogFormVisible = true
			post('/question/queryoprquestion',{
	            command:'question/queryoprquestion',
              	sessionid: $.cookie('sid'),
              	loginid:$.cookie('uid'),
              	questionbaseid:row.questionbaseid,
	        }).done((res)=>{
	            if(res.errcode==0){
	            	self.popname=res.name;
	            	self.popcomment=res.comment;
	            }
	        })
	        post('/question/queryoperation',{
	            command:'question/queryoperation',
              	sessionid: $.cookie('sid'),
              	loginid:$.cookie('uid'),
              	questionid:row.questionbaseid,
	        }).done((res)=>{
	            if(res.errcode==0){
					var titlelist=[];
					for(var i=0;i<res.queryOperationlist.length;i++){
						var value=true;
						for (var j=0;j<self.operatelist.length;j++) {
							if (res.queryOperationlist[i].opstepcontent==self.operatelist[j].title) {
								value=false
							}
						}
						if (value) {
//							titlelist.push(res.queryOperationlist[i].opstepcontent)
							self.operatelist.push({
								title:res.queryOperationlist[i].opstepcontent,
								objlist:[]
							})
						}
					}
//					console.log(JSON.stringify(self.operatelist))
					for (var i=0;i<self.operatelist.length;i++) {
						for (var j=0;j<res.queryOperationlist.length;j++) {
							if(self.operatelist[i].title==res.queryOperationlist[j].opstepcontent){
								self.operatelist[i].objlist.push(res.queryOperationlist[j])
							}
						}
					}
//					console.log(JSON.stringify(self.operatelist))
	            }
	        })
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
	padding: 20px 0;
}
.center{
	text-align: center;
	margin-bottom: 30px;
}
.cell_line{
	text-align: center;
}
.line{
	margin: 20px;
}
.box{
	display: inline-block;
	margin-right: 50px;
}
.marginright{
	margin: 0 80px 30px 0;	
}

</style>