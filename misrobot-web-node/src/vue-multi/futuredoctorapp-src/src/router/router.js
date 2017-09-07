import Vue from 'vue';
import VueRouter from 'vue-router';
import layout from '../views/layout';
import welcome from '../views/welcome';
import selLab from '../views/booking/create/sel-lab';

Vue.use(VueRouter);

const routes = [{
    name: 'layout',
    // path: '/pages/futuredoctor',
    path: '/',
    component: layout,
    children: [{
        name: 'fdIndex',
        path: '',
        component: welcome
    }, {
        name: 'login',
        path: 'login',
        component: require('../views/login')
    },{
        name: 'fdCreate',
        path: 'booking/create',
        component: selLab
    },{
        name: 'fdCreateSelLab',
        path: 'booking/create/sel-lab',
        component: require('../views/booking/create/sel-lab')
    },{
        name: 'fdCreateSelTime',
        path: 'booking/create/sel-time',
        component: require('../views/booking/create/sel-time')
    },{
        name: 'fdCreateSubmit',
        path: 'booking/create/submit',
        component: require('../views/booking/create/submit')
    },{
        name: 'fdCreateSubmitfirst',
        path: 'booking/create/submitfirst',
        component: require('../views/booking/create/submitfirst')
    },{
        name: 'fdCreateSubmitsecond',
        path: 'booking/create/submitsecond',
        component: require('../views/booking/create/submitsecond')
    },{
        name: 'fdCreateSelLabTable',
        path: 'booking/create/sellabtable',
        component: require('../views/booking/create/sel-time-table')
    },{
        name: 'fdCreateJoinCourse',
        path: 'booking/create/joincourse',
        component: require('../views/booking/create/joincourse')
    },{
        name: 'fdCreateUpdateAppoint',
        path: 'booking/create/updateappoint',
        component: require('../views/booking/create/updateappoint')
    },{
        name: 'fdMy',
        path: 'my',
        component: require('../views/booking/my/my')
    },{
        name: 'fdAudit',
        path: 'audit',
        component: require('../views/booking/audit/audit')
    },{
        name: 'fdkey_door',
        path: 'key-door',
        component: require('../views/key_door/key-door')
    },{
        name: 'fdto_time',
        path: 'result/totime',
        component: require('../views/key_door/result/totime')
    },{
        name: 'fdopen_result',
        path: 'result/k-result',
        component: require('../views/key_door/result/k-result')
    },{
        name: 'fd_manage',
        path: 'manage',
        component: require('../views/booking/manage/start')
    }
    ,{
        name: 'fdnewTest',
        path: 'ck_exam/new_test',
        component: require('../views/ck_exam/new_test/main')
    }
    ,{
        name: 'fdnewTestSave',
        path: 'ck_exam/new_test/save_appoint',
        component: require('../views/ck_exam/new_test/save_appoint')
    }
    ,{
        name: 'fdnewTestRecord',
        path: 'ck_exam/new_test_record',
        component: require('../views/ck_exam/new_test_record/main')
    },{
        name: 'fdnewTestRecordToCheck',
        path: 'ck_exam/new_test_record/tocheck',
        component: require('../views/ck_exam/new_test_record/tocheck')
    },{
        name: 'fdnewTestRecordRunning',
        path: 'ck_exam/new_test/save_appoint',
        component: require('../views/ck_exam/new_test_record/running')
    },{
        name: 'fdnewTestRecordCanceled',
        path: 'ck_exam/new_test/save_appoint',
        component: require('../views/ck_exam/new_test_record/canceled')
    },{
        name: 'fdnewTestTime',
        path: 'ck_exam/new_test/choose_time',
        component: require('../views/ck_exam/new_test/choosetime')
    },{
        name: 'fdEnlist',
        path: 'enlist',
        component: require('../views/ck_exam/new_enlist/enlist')
    },{
        name: 'fdEnlistSure',
        path: 'enlist_Sure',
        component: require('../views/ck_exam/new_enlist/enlist_sure')
    },{
        name: 'fdCkExamExamMy',
        path: 'ck_exam/exam/my',
        component: require('../views/ck_exam/exam/my')
    },{
        name: 'fdCkExamExamSelStu',
        path: 'ck_exam/exam/sel-stu',
        component: require('../views/ck_exam/exam/sel-stu')
    },{
        name: 'fdnewTestNewPlace',
        path: 'ck_exam/new_test/newplace',
        component: require('../views/ck_exam/new_test/newplace')
    },{
        name: 'fdtourexaminer',//出科考试巡考入口
        path: 'ck_exam/tourexaminer',
        component: require('../views/ck_exam/examiner/tour-examiner')
    },
    {
        name: 'fdnewTestNewPlaceSave',
        path: 'ck_exam/new_test/save_newplace',
        component: require('../views/ck_exam/new_test/save_newplace')
    },{
        name: 'fdstudentTest',//学生报名记录入口
        path: 'ck_exam/student_test',
        component: require('../views/ck_exam/examination/student_test')
    },{
        name: 'fdscorequery',//考官成绩查询
        path: 'ck_exam/scorequery',
        component: require('../views/ck_exam/exam/scorequery')
    },{
        name: 'fdscoreanalysis',//考官成绩分析
        path: 'ck_exam/scoreanalysis',
        component: require('../views/ck_exam/exam/scoreanalysis')
    },{
        name: 'fdgrade',//巡考打分
        path: 'ck_exam/grade',
        component: require('../views/ck_exam/exam_person/grade')
    },{
        name: 'fdgradeover',//巡考打分
        path: 'ck_exam/gradeover',
        component: require('../views/ck_exam/exam_person/gradeover')
    },{
        name: 'fdgradeover2',//巡考打分
        path: 'ck_exam/gradeover2',
        component: require('../views/ck_exam/exam_person/gradeover2')
    },{
        name: 'fdgrade2',//巡考打分
        path: 'ck_exam/grade2',
        component: require('../views/ck_exam/exam_person/grade2')
    },
    {
        name: 'fdlaborquery',//学生报名记录入口
        path: 'laborquery',
        component: require('../views/laborquery/laborquery')
    },{
        name: 'fdlabortimetable',//学生报名记录入口
        path: 'labortimetable',
        component: require('../views/laborquery/labortimetable')
    },{
        name: 'fdscore_statistics',
        path: 'scoring/statistics',
        component: require('../views/scoring/score-statistics')
    },{
        name:'fdsk_grade',//上课评分
        path: 'sk_grade',
        component: require('../views/scoring/sk_grade')
    },
    {
        name:'fdselectStu',//选择学生
        path:'sk_grade/selectStu',
        component:require('../views/scoring/sk_grade_selectStu')
    },
        {
        name: 'fdStuAppoint',//学生个人预约主入口
        path: 'stuAppoint',
        component: layout,
        children:[
            {
                name: 'fdnew_learninfo',//学生新增个人预约-选训练项
                path: 'stu_subscribe/new_learninfo',
                component: require('../views/stu_subscribe/new_learninfo')
            },{
                name: 'fdsubscribe_confirm',//学生新增个人预约-补充完整
                path: 'stu_subscribe/subscribe_confirm',
                component: require('../views/stu_subscribe/subscribe_confirm')
            },{
                name: 'fdselect_room',//学生新增个人预约-选实验室
                path: 'stu_subscribe/select_room',
                component: require('../views/stu_subscribe/select_room')
            },{
                name: 'fdpersonal',//学生我预约的
                path: 'personal',
                component: require('../views/stu_subscribe/personal')
            },{
                name: 'fdstuscoreanalysis',//学生我的预约，训练成绩
                path: 'stuscoreanalysis',
                component: require('../views/stu_subscribe/scoreanalysis')
            }
        ]
    },{
        name: 'fdTrainingSign',//外训报名主入口
        path: 'trainingsign',
        component: layout,
        children:[
            {
                name: 'fdtraining_courselistapp',//外训报名课程列表,app端
                path: 'courselistapp',
                component: require('../views/training_sign/courselistapp')
            },{
                name: 'fdtraining_coursedetailapp',//外训报名课程详情,app端
                path: 'coursedetailapp',
                component: require('../views/training_sign/coursedetailapp')
            },{
                name: 'fdtraining_signedlistapp',//外训报名记录,app端
                path: 'signedlistapp',
                component: require('../views/training_sign/signedlistapp')
            },{
                name: 'fdtraining_signeddetailapp',//外训报名详情,app端
                path: 'signeddetailapp',
                component: require('../views/training_sign/signeddetailapp')
            },
            {
                name: 'fdtraining_courselist',//外训报名课程列表,weixin端
                path: 'courselist',
                component: require('../views/training_sign/courselist')
            },{
                name: 'fdtraining_coursedetail',//外训报名课程详情,weixin端
                path: 'coursedetail',
                component: require('../views/training_sign/coursedetail')
            },{
                name: 'fdtraining_signedlist',//外训报名记录,weixin端
                path: 'signedlist',
                component: require('../views/training_sign/signedlist')
            },{
                name: 'fdtraining_signeddetail',//外训报名详情,weixin端
                path: 'signeddetail',
                component: require('../views/training_sign/signeddetail')
            },{
                name: 'fdtraining_login',//外训登陆,weixin端
                path: 'login',
                component: require('../views/training_sign/login')
            },{
                name: 'fdtraining_signin',//外训注册,weixin端
                path: 'signin',
                component: require('../views/training_sign/signin')
            }
        ]
    },{
            name: 'fdMyAppoint_Weixin',//个人预约（微信）主入口
            path: 'myappoint_weixin',
            component: layout,
            children:[
                {
                    name: 'fdMyAppoint_Weixin_login',//个人预约（微信）登陆
                    path: 'login',
                    component: require('../views/myappoint_weixin/login')
                },{
                    name: 'fdMyAppoint_Weixin_signin',//个人预约（微信）注册
                    path: 'signin',
                    component: require('../views/myappoint_weixin/signin')
                }
            ]
        },{
            name: 'fditemManagement_wx',//物品信息
            path: 'itemManagement_wx',
            component: layout,
            children:[
                {
                    name: 'fditemManagement',//物品信息
                    path: 'item_managements',
                    component: require('../views/itemManagement_wx/item_management')
                }
            ]
        },{
            name: 'fdRotation',//轮转主入口
            path: 'rt',
            component: layout,
            children:[
                {
                    name:'fdRotation_secretary',
                    path:'rotation_secretary',
                    component:require('../views/rotation/secretary/rotation_secretary')
                },
// 住院医
                {
                    name:'fdRotation_doctor',
                    path:'rotation_doctor',
                    component:require('../views/rotation/doctor/rotation_doctor')
                },
// 轮转计划查看
                {
                    name:'fdRotation_doctor_plan',
                    path:'rotation_doctor/plan',
                    component:require('../views/rotation/doctor/rd_rotation_plan')
                },
                {
                    name:'fdRotation_doctor_exam',
                    path:'rotation_doctor/exam',
                    component:require('../views/rotation/doctor/rd_check_exam')
                },
                {
                    name:'fdRotation_doctor_exam_date',
                    path:'rotation_doctor/date',
                    component:require('../views/rotation/doctor/rd_evaluate_date')
                },
// 日常评价
                {
                    name:'fdRotation_doctor_evaluate',
                    path:'rotation_doctor/evaluate',
                    component:require('../views/rotation/doctor/rd_evaluate')
                },
// 评价带教老师
                {
                    name:'fdRotation_doctor_evaluate_score',
                    path:'rotation_doctor/score',
                    component:require('../views/rotation/doctor/rd_evaluate_score')
                },
// 带教老师
                {
                    name:'fdRotation_teacher',
                    path:'rotation_teacher',
                    component:require('../views/rotation/teacher/rotation_teacher')
                },
// 日常考核日期
                {
                    name:'fdRotation_teacher_date',
                    path:'rotation_teacher/date',
                    component:require('../views/rotation/teacher/rd_teacher_date')
                },
// 日常考核详情查看
                {
                    name:'fdRotation_teacher_detail',
                    path:'rotation_teacher/detail',
                    component:require('../views/rotation/teacher/rd_teacher_detail')
                },
// 带教老师日常考核住院医
                {
                    name:'fdRotation_teacher_evaluate',
                    path:'rotation_teacher/score',
                    component:require('../views/rotation/teacher/rd_teacher_evaluate')
                }
            ]
        },
        // 调查问卷入口
        {
            name:'fdSurvey_question',
            path:'survey_question',
            component:require('../views/survey_question/survey_question')
        },
        {
            name:'fdSurvey_question_submit',
            path:'survey_question_submit',
            component:require('../views/survey_question/submit_success')
        },
        {
            name: 'integratedClass',//一体化课堂-小测试 入口
            path: 'ct',
            component: layout,
            children:[
                {//我的考试
                    name:'fdIntegrated_my_test',
                    path:'my_test',
                    component:require('../views/class_test/my_test')
                },
                 {//考试提交
                    name:'fdIntegrated_my_test_exam',
                    path:'my_test_exam',
                    component:require('../views/class_test/my_test_exam')
                },
                {//考试成绩查询
                    name:'fdIntegrated_my_test_detail',
                    path:'my_test_detail',
                    component:require('../views/class_test/my_test_detail')
                },
            ]
        },
        {
            name: 'dataBase',//资料库入口
            path: 'db',
            component: layout,
            children:[
                {//资料库首页
                    name:'fdDataBase',
                    path:'data_base',
                    component:require('../views/disk_box/data_base')
                },
                {//资料库文件夹二级页面
                    name:'fdDataBaseFile',
                    path:'data_base_file',
                    component:require('../views/disk_box/data_file_two')
                },
            ]
        },
    ]
}];


const router = new VueRouter({
    // mode:'history', //这样url就没有/#/XXX,而是常见的url形式
    routes:routes, // short for routes: routes
    linkActiveClass:'active',     //router-link的选中状态的class，也有一个默认的值
    history:true
});

export default router
