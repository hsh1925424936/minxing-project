<template>
	<div class="adddtheory">
		<p class="nav"><span class="blue" @click="cancel">考试&试卷</span> > 新增试卷</p>
		<div class="content">
			<p class="tab" v-if="listshow==true"><span class="spanselect">选择题目</span><span>编辑试卷</span></p>
			<p class="tab" v-else><span>选择题目</span><span class="spanselect">编辑试卷</span></p>
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
						          	
						          	
						            <el-select v-model="seltype" @change="filtrate" placeholder="全部题型">
						            	<el-option v-for="item in qtype" :key="item.value" :label="item.label" :value="item.value"></el-option>
						          	</el-select>
						
						          	<el-select v-model="selauthor" @change="filtrate" placeholder="全部题目">
						            	<el-option v-for="item in qauthor" :key="item.value" :label="item.label" :value="item.value"></el-option>
						          	</el-select>
						          	
						          	<el-input class="searchbox" placeholder="输入题目名查询" icon="search" v-model="questionname" :on-icon-click="handleIconClick"></el-input>
						        </div>
						        <ul class="qbox">
						          	<li class="flex qdetail" v-for="(item,index) in questionlist">
						            	<div class="r bgblue" v-if="item.questiontypeid==1">单</div>
						            	<div class="r bgpurple" v-if="item.questiontypeid==2">多</div>
						            	<div class="r bggreen" v-if="item.questiontypeid==4">判</div>
						            	<div class="r bgorange" v-if="item.questiontypeid==5">问</div>
						            	<div class="r bgblack" v-if="item.questiontypeid==6">组</div>
						            	<div class="qtitle">
							              	<span>{{index+1}}.</span>
							              	<span>{{item.questionname}}</span>
						            	</div>
							            <div class="dificulty">
							              	<div>
							                	<el-tag type="gray" v-for="labitem in item.lablist">{{labitem.labname}}</el-tag>
							              	</div>
							              	<div class="fgraysmall">
								                <span>所属类别：</span>
								                <span>{{item.categoryname}}</span>
							             	 </div>
							              	<div class="flex">
								                <span>难度：</span>
								                <el-rate v-model="item.difficult" disabled></el-rate>
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
				    <el-tab-pane :label="selectnum" name="second">
				    	<div class="flex_fill quebox">
					        <div class="mb10">
					          	<el-select v-model="seltype_selected" @change="filtrate_selected" placeholder="全部题型">
					            	<el-option v-for="item in qtype" :key="item.value" :label="item.label" :value="item.value"></el-option>
					          	</el-select>
					          	<!--<el-select v-model="selauthor_selected" @change="filtrate_selected" placeholder="全部题目">
					            	<el-option v-for="item in qauthor" :key="item.value" :label="item.label" :value="item.value"></el-option>
					          	</el-select>此处注释勿删-->
					          	<el-input class="searchbox" placeholder="输入题目关键字查询" icon="search" v-model="quesstionname_selected" :on-icon-click="handleIconClick_selected"></el-input>
					        </div>
					
					        <ul class="qbox">
					          	<li class="flex qdetail" v-for="(item,index) in selectquestionlist">
					            	<div class="r bgblue" v-if="item.questiontypeid==1">单</div>
					            	<div class="r bgpurple" v-if="item.questiontypeid==2">多</div>
					            	<div class="r bggreen" v-if="item.questiontypeid==4">判</div>
					            	<div class="r bgorange" v-if="item.questiontypeid==5">问</div>
					            	<div class="r bgblack" v-if="item.questiontypeid==6">组</div>
					            	<div class="qtitle">
						              	<span>{{index+1}}.</span>
						              	<span>{{item.questionname}}</span>
					            	</div>
						            <div class="dificulty">
						              	<div>
						                	<el-tag type="gray" v-for="labitem in item.lablist">{{labitem.labname}}</el-tag>
						              	</div>
						              	<div class="fgraysmall">
							                <span>所属类别：</span>
							                <span>{{item.categoryname}}</span>
						             	 </div>
						              	<div class="flex">
							                <span>难度：</span>
							                <el-rate v-model="item.difficult" disabled></el-rate>
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
					<el-button @click="cancel">返回</el-button>
				</p>
			</div>
			<div class="bottom" v-show="editshow">
				<template v-if="editshow==true">
			      <editpaper :paperid="this.paperid" @topstep="topstep" :type="this.type"></editpaper>
			    </template>
					
			</div>
		</div>
		
	</div>
</template>

<script>
import {post,setCookie,getCookie,setTitle} from '../../config/util'
import $ from 'jquery'	
import editpaper from './editpaper';	
export default{
	data(){
		return{
			activeName:'first',
			listshow:true,
			editshow:false,
			currentpage:1,//当前页码
	  		pagesize:10,//每页条数
	  		total:0,//数据总数
			treedata:[],//分类栏
			sellabel:'',//所选标签
			seltype:9,//所选类型
			selauthor:1,//所选题目
			questionname:'',//题目名
			categoryid:'',//类别id
			questionlist:[],//题目列表
			selectquestionlist:[],//已选题目列表
			//已选列表参数
			seltype_selected:9,
			selauthor_selected:1,
			quesstionname_selected:'',
			currentpage_selected:1,
			pagesize_selected:10,
			total_selected:0,
			selecttxtnum:'',
			
			paperid:this.$route.query.paperid,
			type:this.$route.query.type,//试卷信息
//			form:{"name":"发多少是","type":"1","courseid":3},
//			paperid:149,
			
			lablist:[],//标签列表
			qtype:[],//题目类型 0查1,2,4,5,6;;9查1,2,4
			liqtype: [{value: 0,label: '全部题型'},{value: 1,label: '单选题'}, {value: 2,label: '多选题' }, { value: 4, label: '判断题' }, { value: 5,  label: '问答题' }, { value: 6, label: '组合题' }],
			suiqtype: [{value: 9,label: '全部题型'},{value: 1,label: '单选题'}, {value: 2,label: '多选题' }, { value: 4, label: '判断题' }],
			qauthor: [{value: 1,label: '全部题目'}, {value: 0,label: '我的题目'}],
			treeProps: {
	            children: 'children',
	            label: 'label'
	        },
		}
	},
	components:{
		editpaper
	},
	mounted(){
//		if (this.type==1) {
//			this.qtype=this.liqtype;
//			this.seltype=0;
//		}else{
//			this.qtype=this.suiqtype;
//			this.seltype=9;
//		}
		this.qtype=this.suiqtype;//当前理论考试，随堂测试都只能用suiqtype
//		this.seltype=9;
//		this.selauthor=1;
        this.gettree();
        this.querylablist();
		this.getqlist(this.currentpage,this.pagesize,this.seltype,this.selauthor,this.questionname,this.sellabel,this.categoryid);
		this.getselectlist(this.currentpage_selected,this.pagesize_selected,this.seltype_selected,this.selauthor_selected,this.quesstionname_selected);
	},
    computed:{
      selectnum(){
        return '已选（'+this.total_selected+'）'
      }
    },
	methods: {
		handleSizeChange(val) {console.log(val)
			this.pagesize=val;
			this.getqlist(this.currentpage,this.pagesize,this.seltype,this.selauthor,this.questionname,this.sellabel,this.categoryid);
		},
		handleCurrentChange(val) {console.log(val)
			this.currentpage=val;
			this.getqlist(this.currentpage,this.pagesize,this.seltype,this.selauthor,this.questionname,this.sellabel,this.categoryid);
		},
        handleIconClick(){
            console.log(this.quesstionname)
			this.getqlist(this.currentpage,this.pagesize,this.seltype,this.selauthor,this.questionname,this.sellabel,this.categoryid);
        },
		handleSizeChange_selected(val) {console.log(val)
			this.pagesize_selected=val;
			this.getselectlist(this.currentpage_selected,this.pagesize_selected,this.seltype_selected,this.selauthor_selected,this.quesstionname_selected);
		},
		handleCurrentChange_selected(val) {console.log(val)
			this.currentpage_selected=val;
			this.getselectlist(this.currentpage_selected,this.pagesize_selected,this.seltype_selected,this.selauthor_selected,this.quesstionname_selected);
		},
        handleIconClick_selected(){
            console.log(this.quesstionname_selected)
			this.getselectlist(this.currentpage_selected,this.pagesize_selected,this.seltype_selected,this.selauthor_selected,this.quesstionname_selected);
        },
        handleNodeClick(data){//筛选类别
            console.log('categoryid----------',data.id);
            this.categoryid=data.value;
            this.getqlist(this.currentpage,this.pagesize,this.seltype,this.selauthor,this.questionname,this.sellabel,this.categoryid);
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
        getqlist(currentpage,pagesize,questiontypeid,createperson,questionname,labelid,categoryid){//categoryid类别，questiontypeid题型(9:所有，1：单选，2：多选，4：判断，5：问答)，createperson创建人(0:我的，1：全部)，分页参数page,reqnum
            var self=this;
			post('/exampaper/queryquestionlist',{
	            command:'exampaper/queryquestionlist',
              	sessionid: $.cookie('sid'),
              	loginid:$.cookie('uid'),
              	questionname:questionname,
              	questiontypeid:questiontypeid,
              	courseid:'',
              	difficult:'',
              	creator:'',
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
	            	console.log(JSON.stringify(self.questionlist)+'-------------questionlist----------')
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
        getselectlist(currentpage,pagesize,questiontypeid,createperson,questionname){//categoryid类别，questiontypeid题型(9:所有，1：单选，2：多选，4：判断，5：问答)，createperson创建人(0:我的，1：全部)，分页参数page,reqnum
            var self=this;
			post('/exampaper/queryselectedquestion',{
	            command:'exampaper/queryselectedquestion',
              	sessionid: $.cookie('sid'),
              	loginid:$.cookie('uid'),
              	createUid:$.cookie('uid'),
             	page:currentpage,
              	reqnum:pagesize,
              	paperid:self.paperid,
              	questiontypeid:questiontypeid,
              	createperson:createperson,
              	questionname:questionname,
//            	labid:labelid,
//            	categoryid:categoryid,
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
        	var self=this;console.log(ischoose)
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
		            	self.getselectlist(self.currentpage_selected,self.pagesize_selected,self.seltype_selected,self.selauthor_selected,self.quesstionname_selected);
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
		            	self.getselectlist(self.currentpage_selected,self.pagesize_selected,self.seltype_selected,self.selauthor_selected,self.quesstionname_selected);
		            }
		        })
        	}
        },
        filtrate(){//筛选题目
        	this.getqlist(this.currentpage,this.pagesize,this.seltype,this.selauthor,this.questionname,this.sellabel,this.categoryid);
        },
        filtrate_selected(){//已选列表筛选题目
        	this.getselectlist(this.currentpage_selected,this.pagesize_selected,this.seltype_selected,this.selauthor_selected,this.quesstionname_selected);
        },
        nextstep(){//下一步
        	this.listshow=false;
        	this.editshow=true;
        },
        topstep(){//上一步
			this.listshow=true;
			this.editshow=false;
		},
		cancel(){//返回到exam_test
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
    			this.questionname="";
    			this.getqlist(this.currentpage,this.pagesize,this.seltype,this.selauthor,this.questionname,this.sellabel,this.categoryid);
    		}
    		if(val=='second'){
    			console.log('-----second-----')
    			this.questionname="";
    			this.seltype_selected=9;
    			this.getselectlist(this.currentpage_selected,this.pagesize_selected,this.seltype_selected,this.selauthor_selected,this.quesstionname_selected);
    		}
    		
    	}
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
.bgpurple{
	background-color: #9932cd;
}
.bgblack{
	background-color: #475669;
}
.bgorange{
	background-color: #ff9966;
}
.bgblue{
	background-color: #58B7FF;
}
</style>