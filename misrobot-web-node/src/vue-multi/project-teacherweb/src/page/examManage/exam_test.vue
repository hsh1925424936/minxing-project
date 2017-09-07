<template>
	<div class="exam_test">
		<div class="left box">
			<el-col :span="8">
		    <el-menu :default-active="index" class="el-menu-vertical-demo" @select="select">
		      <el-menu-item index="1">考试管理</el-menu-item>
		      <el-menu-item index="2">试卷管理</el-menu-item>
		    </el-menu>
		  </el-col>
		</div>
		<div class="right box">
			<template v-if="index == '1'">
		      <exam-manage></exam-manage>
		    </template>
			<template v-if="index == '2'">
		      <testpaper-manage :newpaper="newpaper"></testpaper-manage>
		    </template>
		</div>
	</div>
</template>

<script>
import examManage from './examManage';
import testpaperManage from './testpaperManage';
export default {
	data() {
	  return {
	  	index:'1',
	  	value:this.$route.query.value,
	  	newpaper:this.$route.query.newpaper
	  }
	},
	components: {
	    examManage,
	    testpaperManage
	},
	mounted(){
		if (this.value=='2') {
			this.index='2';
		}else{
			this.index='1'
		}
	},
	methods:{
		select(index){
			this.index=index;
		}
	}
}
</script>
<style scoped>
.exam_test{
	background-color: #fff;
	width: 100%;
}
.box{
	display: inline-block;
	vertical-align: top;
	font-size: 15px;
}
.left{
	width: 10%;
	margin-right: 15px;
}
.left .el-col-8{
	width: 100%;
}
.right{
	width: 85%;
	border: 1px solid #eef1f6;
}

</style>

