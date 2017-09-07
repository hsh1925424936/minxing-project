<template>
	<div class="adddtheory">
		<p class="nav"><span class="blue" @click="cancel">考试&试卷</span> > 新增试卷</p>
		<div class="content">
			<p class="tab" v-if="listshow==true">
				<span class="spanselect">选择题目</span>
				<span>设置分值</span>	
			</p>
			<p class="tab" v-else>
				<span>选择题目</span>
				<span class="spanselect">设置分值</span>	
			</p>
			<div class="bottom" v-show="listshow">	
				<el-tabs v-model="activeName">
				    <el-tab-pane label="全部题目" name="first">
				      	<div class="flex quebox">
					        <div class="tree">
					            <el-tree :data="treedata" :props="treeProps" @node-click="handleNodeClick"></el-tree>
					        </div>
					      
					        <div class="flex_fill">
						        <div class="mb10">
						        	<el-select v-model="sellabel" @change="filtrate" placeholder="全部标签">
						            	<el-option label="全部标签" value=""></el-option>
						            	<el-option v-for="item in lablist" :key="item.id" :label="item.name" :value="item.id"></el-option>
						          	</el-select>
						          	
						
						          	<el-select v-model="selauthor" @change="filtrate" placeholder="全部题目">
						            	<el-option v-for="item in qauthor" :key="item.value" :label="item.label" :value="item.value"></el-option>
						          	</el-select>
						          	
						          	<el-input class="searchbox" placeholder="输入题目名查询" icon="search" v-model="questionname" :on-icon-click="handleIconClick"></el-input>
						        </div>
					
						        <ul class="qbox">
						          	<li class="flex qdetail" v-for="(item,index) in questionlist">
						            	<div class="r bgblue">操</div>
						            	<div class="qtitle">
							              	<span>{{index+1}}.</span>
							              	<span>{{item.questionname}}</span>
						            	</div>
							            <div class="dificulty">
							              	<div>
							                	<el-tag type="gray" v-for="labitem in item.labitem">{{labitem.labname}}</el-tag>
							              	</div>
							              	<div class="fgraysmall">
								                <span>所属类别：</span>
								                <span>{{item.categoryname}}</span>
							             	 </div>
							              	<div class="flex">
								                <span>难度：</span>
								                <el-rate v-model="item.dificulty" disabled></el-rate>
							              	</div>
							            </div>
						            <div class="p10rl">
						              	<el-checkbox v-model="item.ischoose" @change="add_deleteque(item.ischoose,item.questiontypeid,item.questionbaseid)">
						              		<span v-if="item.ischoose==1">已加入</span>
						              		<span v-else>加入试卷</span>
						              	</el-checkbox>
						            </div>
						          </li>
						        </ul>
					        </div>
					    </div>
						<div class="pagebox">
							<el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentpage" :page-sizes="[10, 20, 30, 50]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
						</div>
				    </el-tab-pane>
				    <el-tab-pane label="已选" name="second">
				    	<div class="flex_fill quebox">
					        <div class="mb10">
					          	<el-select v-model="selauthor_selected" @change="filtrate_selected" placeholder="全部题目">
					            	<el-option v-for="item in qauthor" :key="item.value" :label="item.label" :value="item.value"></el-option>
					          	</el-select>
					          	<el-input class="searchbox" placeholder="输入题目名查询" icon="search" v-model="quesstionname_selected" :on-icon-click="handleIconClick"></el-input>
					        </div>
					
					        <ul class="qbox">
					          	<li class="flex qdetail" v-for="(item,index) in selectquestionlist">
					            	<div class="r bgblue">操</div>
					            	<div class="qtitle">
						              	<span>{{index+1}}.</span>
						              	<span>{{item.questionname}}</span>
					            	</div>
						            <div class="dificulty">
						              	<div>
						                	<el-tag type="gray" v-for="labitem in item.labitem">{{labitem.labname}}</el-tag>
						              	</div>
						              	<div class="fgraysmall">
							                <span>所属类别：</span>
							                <span>{{item.categoryname}}</span>
						             	 </div>
						              	<div class="flex">
							                <span>难度：</span>
							                <el-rate v-model="item.dificulty" disabled></el-rate>
						              	</div>
						            </div>
						            <div class="p10rl">
						              	<el-checkbox v-model="item.ischoose" @change="add_deleteque(item.ischoose,item.questiontypeid,item.questionbaseid)">
						              		<span>已加入</span>
						              	</el-checkbox>
						            </div>
					          	</li>
					        </ul>
					    </div>
						<div class="pagebox">
							<el-pagination class="page" @size-change="handleSizeChange_selected" @current-change="handleCurrentChange_selected" :current-page="currentpage_selected" :page-sizes="[10, 20, 30, 50]" :page-size="pagesize_selected" layout="total, sizes, prev, pager, next, jumper" :total="total_selected"></el-pagination>
						</div>
				    </el-tab-pane>
				</el-tabs>
				<p class="line">
					<el-button type="primary" @click="nextstep">下一步</el-button>
					<el-button>取消</el-button>
				</p>
			</div>
			<div class="bottom" v-show="editshow">
				<div class="quebox">
					<p class="cellbox">设置分值:</p>
					<p class="cellbox">总分 
						<!--<el-input class="inputbox" v-model="grade"></el-input>-->  
						<input  onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" v-model="grade" class="inputbox"/>
						分
					</p>
				</div>
				<div class="quebox">
					<p class="cellbox">分值设置:</p>
					<el-table :data="selectquestionlist" border style="width: 100%">
				      <el-table-column type="index" label="序号" width="150"></el-table-column>
				      <el-table-column prop="questionname" label="题目名称"></el-table-column>
				      <el-table-column prop="coursename" label="所属类别"></el-table-column>
				      <el-table-column label="标签">
				      	<template scope="scope">
							<span v-for="item in scope.row.labitem">{{scope.row.labname}}</span>
						</template>
				      </el-table-column>
				      <el-table-column label="分值" width="200">
				      	<template scope="scope">
							<input  onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" @change="inputFn" v-model="scope.row.score" class="inputscore"/>
						</template>
				      </el-table-column>
				    </el-table>
				</div>
				<p class="line" style="margin-top: 20px;">
					<el-button @click="topstep">上一步</el-button>
					<el-button type="primary" @click="save">保存</el-button>
					<el-button @click="cancel">取消</el-button>
				</p>	
			</div>
		</div>
		
	</div>
</template>

<script>	
import {post,setCookie,getCookie,setTitle} from '../../config/util'
import $ from 'jquery'	
export default{
	data(){
		return{activeName:'first',
			listshow:true,
			editshow:false,
			currentpage:1,//当前页码
	  		pagesize:10,//每页条数
	  		total:0,//数据总数
			treedata:[],//分类栏
			sellabel:'',//所选标签
			selauthor:'',//所选题目
			questionname:'',//题目名
			categoryid:'',//类别id
			questionlist:[],//题目列表
			selectquestionlist:[],//已选题目列表
			//已选列表参数
			selauthor_selected:'',
			quesstionname_selected:'',
			currentpage_selected:1,
			pagesize_selected:10,
			total_selected:0,
			
			paperid:this.$route.query.paperid,
			form:{"name":"dfada","type":"2","courseid":3},
			
			lablist:[],//标签列表
			qauthor: [{value: 1,label: '全部题目'}, {value: 0,label: '我的题目'}],
			grade:0,

			
			
			checked:true,
//			treedata: [],
            treeProps: {
                children: 'children',
                label: 'label'
              },
              //两个select
            value:'',
            options:[],
			dificulty:4,
			searchq:'',
		    
		    re:/^[0-9]+$/,//判断正整数
		}
	},
	mounted(){console.log(JSON.stringify(this.$route.query.form),this.$route.query.paperid)
		this.selauthor=1;
        this.gettree();
        this.querylablist();
		this.getqlist(this.currentpage,this.pagesize,this.selauthor,this.questionname,this.sellabel,this.categoryid);
	},
	methods: {
		handleSizeChange(val) {console.log(val)
			this.pagesize=val;
			this.getqlist(this.currentpage,this.pagesize,this.selauthor,this.questionname,this.sellabel,this.categoryid);
		},
		handleCurrentChange(val) {console.log(val)
			this.currentpage=val;
			this.getqlist(this.currentpage,this.pagesize,this.selauthor,this.questionname,this.sellabel,this.categoryid);
		},
        handleIconClick(){
            console.log(this.quesstionname)
			this.getqlist(this.currentpage,this.pagesize,this.selauthor,this.questionname,this.sellabel,this.categoryid);
        },
		handleSizeChange_selected(val) {console.log(val)
			this.pagesize_selected=val;
			this.getselectlist(this.currentpage_selected,this.pagesize_selected,this.selauthor_selected,this.quesstionname_selected);
		},
		handleCurrentChange_selected(val) {console.log(val)
			this.currentpage_selected=val;
			this.getselectlist(this.currentpage_selected,this.pagesize_selected,this.selauthor_selected,this.quesstionname_selected);
		},
        handleIconClick_selected(){
            console.log(this.quesstionname_selected)
			this.getselectlist(this.currentpage_selected,this.pagesize_selected,this.selauthor_selected,this.quesstionname_selected);
        },
        handleNodeClick(data){//筛选类别
            console.log('categoryid----------',data.id);
            this.categoryid=data.id;
            this.getqlist(this.currentpage,this.pagesize,this.selauthor,this.questionname,this.sellabel,this.categoryid);
        },
        gettree(){//查询类别
            var self=this;
			post('/question/questioncategorytree',{
	            command:'question/questioncategorytree',
                sessionid: $.cookie('sid'),
                loginid:$.cookie('uid'),
	        }).done((res)=>{
	            if(res.errcode==0){
	                self.treedata=res.children
	            }
	        })
        },
        getqlist(currentpage,pagesize,createperson,questionname,labelid,categoryid){//categoryid类别，questiontypeid题型(9:所有，1：单选，2：多选，4：判断，5：问答)，createperson创建人(0:我的，1：全部)，分页参数page,reqnum
            var self=this;
			post('/exampaper/queryquestionlist',{
	            command:'exampaper/queryquestionlist',
              	sessionid: $.cookie('sid'),
              	loginid:$.cookie('uid'),
              	questionname:questionname,
              	questiontypeid:7,
//            	courseid:'',
//            	difficult:'',
//            	creator:'',
             	page:currentpage,
              	reqnum:pagesize,
              	labid:labelid,
              	categoryid:categoryid,
              	createperson:createperson,
              	createUid:$.cookie('uid'),
              	paperid:self.paperid,
	        }).done((res)=>{
	            if(res.errcode==0){
	            	self.questionlist=res.questionlist;
	            	self.total=res.allcount;
	            	console.log(JSON.stringify(self.questionlist))
	            	for(var i=0;i<self.questionlist.length;i++){
	            		if(self.questionlist[i].ischoose==1){
	            			self.questionlist[i].ischoose=true
	            		}else{
	            			self.questionlist[i].ischoose=false
	            		}
	            	}
	            }
	        })
        },
        getselectlist(currentpage,pagesize,createperson,questionname){//categoryid类别，questiontypeid题型(9:所有，1：单选，2：多选，4：判断，5：问答)，createperson创建人(0:我的，1：全部)，分页参数page,reqnum
            var self=this;
			post('/exampaper/queryselectedquestion',{
	            command:'exampaper/queryselectedquestion',
              	sessionid: $.cookie('sid'),
              	loginid:$.cookie('uid'),
             	page:currentpage,
              	reqnum:pagesize,
              	paperid:self.paperid,
              	questiontypeid:7,
              	createperson:createperson,
              	questionname:questionname,
	        }).done((res)=>{
	            if(res.errcode==0){
	            	self.selectquestionlist=res.questionlist;
	            	self.total_selected=res.allcount;
//	            	console.log(JSON.stringify(self.questionlist))
					for(var i=0;i<self.selectquestionlist.length;i++){
	            		if(self.selectquestionlist[i].ischoose==1){
	            			self.selectquestionlist[i].ischoose=true
	            		}else{
	            			self.selectquestionlist[i].ischoose=false
	            		}
	            		if (self.selectquestionlist[i].score==null) {
	            			self.selectquestionlist[i].score=0;
	            		}
	            		self.grade+=parseInt(self.selectquestionlist[i].score)
	            	}
	            }
	        })
        },
        querylablist(){//查询标签列表
        	var self=this;
			post('/question/querylablist',{
	            command:'question/querylablist',
              	sessionid: $.cookie('sid'),
              	loginid:$.cookie('uid'),
	        }).done((res)=>{
	            if(res.errcode==0){
	                self.lablist=res.lablist;
	            }
	        })
        },
        add_deleteque(ischoose,cateid,questionid){//加入或删除题目
        	var self=this;
        	if (ischoose==1) {
        		post('/exampaper/joinpaperquestion',{
		            command:'exampaper/joinpaperquestion',
	              	sessionid: $.cookie('sid'),
	              	loginid:$.cookie('uid'),
	              	paperid:self.paperid,
	              	cateid:cateid,
	              	questionid:questionid
		        }).done((res)=>{
		            if(res.errcode==0){
		            	
		            }
		        })
        	} else{
        		post('/exampaper/cancelpaperquestion',{
		            command:'exampaper/cancelpaperquestion',
	              	sessionid: $.cookie('sid'),
	              	loginid:$.cookie('uid'),
	              	paperid:self.paperid,
	              	questionid:questionid
		        }).done((res)=>{
		            if(res.errcode==0){
		            	if (self.activeName=="second") {
		            		self.getselectlist(this.currentpage_selected,this.pagesize_selected,this.selauthor_selected,this.quesstionname_selected);
		            	}
		            }
		        })
        	}
        },
        filtrate(){//筛选题目
			this.getqlist(this.currentpage,this.pagesize,this.selauthor,this.questionname,this.sellabel,this.categoryid);
        },
        filtrate_selected(){//已选列表筛选题目
        	this.getselectlist(this.currentpage_selected,this.pagesize_selected,this.seltype_selected,this.selauthor_selected,this.questionname);
        },
        nextstep(){//下一步
        	this.listshow=false;
        	this.editshow=true;
        	this.getselectlist(this.currentpage_selected,this.pagesize_selected,this.selauthor_selected,this.quesstionname_selected);
        },
        topstep(){//上一步
			this.listshow=true;
			this.editshow=false;
		},
		inputFn(){//监听分值设置 分值加入scorelist
			this.grade=0;
			for (var i=0;i<this.selectquestionlist.length;i++) {
				if (this.selectquestionlist[i].score==null||this.selectquestionlist[i].score=='') {
					this.selectquestionlist[i].score=0;
				}
				if(!(this.re.test(this.selectquestionlist[i].score))){
		             this.$message({
			          message: '第'+(i+1)+'题请输入正整数!',
			          type: 'warning'
			        });
			        this.selectquestionlist[i].score=0;
			        continue
		        }
				this.grade+=parseFloat(this.selectquestionlist[i].score);
			}
		},
		save(){
			var self=this;
			var scorelist=[];
			for (var i=0;i<this.selectquestionlist.length;i++) {console.log(JSON.stringify(this.selectquestionlist[i].score))
				scorelist.push({
					id:this.selectquestionlist[i].id,
					score:this.selectquestionlist[i].score,
					questionbaseid:this.selectquestionlist[i].questionbaseid
				})
			}
			if (this.grade!=this.updatescore) {
//				layer.msg('当前分值不等于设置总分！')
//				return false;
			}
			post('/unifyexam/operatquestionscore',{
	           command:"exampaper/operatquestionscore",
				sessionid:getCookie("sid"),
				loginid:getCookie("uid"),
				paperid:self.paperid,
				cateid:7,
				scoreall:self.grade,
				questionlist:scorelist,
	        }).done((res)=>{
	            if(res.errcode==0){
	                console.log(res)
	                self.$router.push({
				        name:'exam_test',
				        query:{
				      	    value:'2'
				        }
				    })
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
		}
    },
    watch:{
    	activeName:function(val){
    		if(val=="first"){
    			console.log('-----first-----')
				this.getqlist(this.currentpage,this.pagesize,this.selauthor,this.questionname,this.sellabel,this.categoryid);
    		}
    		if(val=='second'){
    			console.log('-----second-----')
    			this.getselectlist(this.currentpage_selected,this.pagesize_selected,this.selauthor_selected,this.quesstionname_selected);
    		}
    		
    	},
    }
}
</script>

<style scoped>
 @import "../../assets/css/common.css";
.p10rl{
	width: 100px;
}
.nav{
	font-size: 13px;
	margin: 5px 0;
}
.blue{
	color:#20a0ff;
	cursor: pointer;
}
.tab{
	font-size: 0;
	text-align: center;
}
.tab span{
	width: 50%;
	font-size: 15px;
	padding: 10px 0;
}
.spanselect{
	color: #20a0ff;
	border-bottom: 2px solid #20a0ff;
}
.content{
	border: 1px solid #bfcbd9;
	padding-bottom: 20px;
}
.el-tabs__header{
	border-bottom: none;
}
.pagebox{
    margin: 20px 0;
    text-align: center;
}
.quebox{
	width: 95%;
	margin: auto;
}
.searchbox{
	width: 200px;
	float: right;
}
.line{
	text-align: center;
	margin: 0 30px;
}
.inputbox{
	width: 120px;
    border: 1px solid #bfcbd9;
    line-height: 24px;
    padding: 0 10px;
}
.cellbox{
	margin: 10px 0;
}
.inputscore{
	border: 1px solid #bfcbd9;
    width: 60%;
    line-height: 24px;
    padding: 0 10px;
}
</style>