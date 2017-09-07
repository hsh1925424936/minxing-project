import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex);

const state = {
	login:false,//是否登录
	userRole:[],//所属角色
	menuList:[],//pc菜单列表
	appMenuList:[],//app菜单列表
	deptBase:[],//所属基地
	deptRoom:[],//所属科室
	deptIdList:[],//所属部门

	deptList:[],//所有轮转科室

	deptBaseList:[],//所有基地
	gradeList:[],//所有年级
	roleList:[],//所有角色

	//下拉框数据
	degreeList:[],//职工学位下拉项
	studentDegreeList:[],//学生学位下拉
	professionList:[],//培训专业
	stuTypeList:[],//学员类型
	nationList:[],//民族
	titleList:[],//职位
	educationList:[],//学历
	cardList:[],//证件类型
	techniqueList:[],//技术职称
	techingList:[],//教学职称
	turnYearsList:[],//培训年限 

	//页面级下拉框
	medicalList:[],//医疗卫生机构
	hospitalAttributesList:[],//医院属性
	hospitalCategoryList:[],//医院类别
	primaryMedicalList:[],//基层医疗卫生机构
	hospitalList:[],//单位性质
}

export default new Vuex.Store({
	state,
	getters,
	mutations,
	actions
})