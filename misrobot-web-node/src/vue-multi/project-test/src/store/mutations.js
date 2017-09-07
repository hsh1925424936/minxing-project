var _ = require('lodash');
import router from '../router'
export default {
	initLogin(state,login){
		state.login = login;
	},
	initUserRole(state,role){
		state.userRole = role;
	},
	initDeptIdList(state,list){
		state.deptIdList = list;
	},
	initDeptBase(state,list){
		_.union(state.deptBase,list);
	},
	initDeptRoom(state,list){
		_.union(state.deptRoom,list);
	},
	initMenuList(state,list){
		state.menuList = list;
		/*if(state.menuList.length>0){
			router.push({path:state.menuList[0].url});
		}*/
		
	},
	initDeptBase(state,list){
		state.deptBase = list;
	},
	initDeptRoom(state,list){
		state.deptRoom = list;
	},
	initDeptList(state,list){
		state.deptList = list;
	},
	initDeptBaseList(state,list){
		state.deptBaseList = list;
	},
	initGradeList(state,list){
		state.gradeList = list;
	},
	initDegreeList(state,list){
		state.degreeList = list;
	},
	initStudentDegreeList(state,list){
		state.studentDegreeList = list;
	},
	initProfessionList(state,list){
		state.professionList = list;
	},
	initStuTypeList(state,list){
		state.stuTypeList = list;
	},
	initNationList(state,list){
		state.nationList = list;
	},
	initTitleList(state,list){
		state.titleList = list;
	},
	initEducationList(state,list){
		state.educationList = list;
	},
	initTechniqueList(state,list){
		state.techniqueList = list;
	},
	initTechingList(state,list){
		state.techingList = list;
	},
	initCardList(state,list){
		state.cardList = list;
	},
	initTurnYearsList(state,list){
		state.turnYearsList = list;
	},
	initMedicalList(state,list){
		state.medicalList = list;
	},
	initHospitalAttributesList(state,list){
		state.hospitalAttributesList = list;
	},
	initHospitalCategoryList(state,list){
		state.hospitalCategoryList = list;
	},
	initPrimaryMedicalList(state,list){
		state.primaryMedicalList = list;
	},
	initHospitalList(state,list){
		state.hospitalList = list;
	}

}