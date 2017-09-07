import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Index from '@/page/index'
//report module route

//备课模块
import prepare_list from '@/page/prepare/list'
import prepare_detail from '@/page/prepare/detail'
import prepare from '@/page/prepare/prepare'

import qlist from '@/page/qmanage/qlist'
import newqdanxuan from '@/page/qmanage/newqdanxuan'
import newqduoxuan from '@/page/qmanage/newqduoxuan'
import newqpanduan from '@/page/qmanage/newqpanduan'
import newqwenda from '@/page/qmanage/newqwenda'
import newqzuhe from '@/page/qmanage/newqzuhe'
import judgetable from '@/page/qmanage/judgetable'
import newqcaozuo from '@/page/qmanage/newqcaozuo'
//考试&试卷管理模块
import exam_test from '@/page/examManage/exam_test'
import examManage from '@/page/examManage/examManage'
import testpaperManage from '@/page/examManage/testpaperManage'
import examtheory from '@/page/examManage/examtheory'
import editexamtheory from '@/page/examManage/editexamtheory'
import examoperate from '@/page/examManage/examoperate'
import editexamoperate from '@/page/examManage/editexamoperate'
import det_theory from '@/page/examManage/det_theory'
import det_quiztheory from '@/page/examManage/det_quiztheory'
import det_operate from '@/page/examManage/det_operate'
import testpaper_checktheory from '@/page/examManage/testpaper_checktheory'
import testpaper_checkoperate from '@/page/examManage/testpaper_checkoperate'
import testpaper_addtheory from '@/page/examManage/testpaper_addtheory'
import testpaper_addoperate from '@/page/examManage/testpaper_addoperate'
import editpaper from '@/page/examManage/editpaper'
import checkpaper from '@/page/examManage/checkpaper'

Vue.use(Router)

export default new Router({
  //mode:'history',
  history:true,
  //base:__dirname,
  routes: [
    {
      path: '/',
      redirect:{name:'Login'}
    },
    {
      path:'/login',
      name:'Login',
      component:require('@/page/login')
    },
    {
      path: '/index',
      name: 'Index',
      component: Index,
      children:[
        //考试&试卷
        {
          path: '/examManage/exam_test',
          name: 'exam_test',
          component: exam_test
        },{
          path: '/examManage/examManage',
          name: 'examManage',
          component: examManage
        },{
          path: '/examManage/testpaperManage',
          name: 'testpaperManage',
          component: testpaperManage
        },{
          path: '/examManage/examtheory',
          name: 'examtheory',
          component: examtheory
        },{
          path: '/examManage/editexamtheory',
          name: 'editexamtheory',
          component: editexamtheory
        },{
          path: '/examManage/examoperate',
          name: 'examoperate',
          component: examoperate
        },{
          path: '/examManage/editexamoperate',
          name: 'editexamoperate',
          component: editexamoperate
        },{
          path: '/examManage/det_theory',
          name: 'det_theory',
          component: det_theory
        },{
          path: '/examManage/det_quiztheory',
          name: 'det_quiztheory',
          component: det_quiztheory
        },{
          path: '/examManage/det_operate/:examid',
          name: 'det_operate',
          component: require('@/page/examManage/operateExam')
        },
        {
          path: '/examManage/ratevideo',
          name: 'ratevideo',
          component: require('@/page/examManage/rateVideo')
        },{
          path: '/examManage/testpaper_checktheory',
          name: 'testpaper_checktheory',
          component: testpaper_checktheory
        },{
          path: '/examManage/testpaper_checkoperate',
          name: 'testpaper_checkoperate',
          component: testpaper_checkoperate
        },{
          path: '/examManage/testpaper_addtheory',
          name: 'testpaper_addtheory',
          component: testpaper_addtheory
        },{
          path: '/examManage/testpaper_addoperate',
          name: 'testpaper_addoperate',
          component: testpaper_addoperate
        },{
          path: '/examManage/editpaper',
          name: 'editpaper',
          component: editpaper
        },{
          path: '/examManage/checkpaper',
          name: 'checkpaper',
          component: checkpaper
        },
        //备课模块
        {
          path: '/prepare/list',
          name: 'prepare_list',
          component: prepare_list
        },{
          path: '/prepare/detail',
          name: 'prepare_detail',
          component: prepare_detail
        },{
          path: '/prepare/prepare',
          name: 'prepare',
          component: prepare
        },
        //题库管理模块
        {
          path: '/qmanage/qlist',
          name: 'qlist',
          component: qlist
        }, {
          path: '/qmanage/newqdanxuan',
          name: 'newqdanxuan',
          component: newqdanxuan
        }, {
          path: '/qmanage/newqduoxuan',
          name: 'newqduoxuan',
          component: newqduoxuan
        }, {
          path: '/qmanage/newqpanduan',
          name: 'newqpanduan',
          component: newqpanduan
        }, {
          path: '/qmanage/newqwenda',
          name: 'newqwenda',
          component: newqwenda
        }, {
          path: '/qmanage/newqzuhe',
          name: 'newqzuhe',
          component: newqzuhe
        },
        {
          path: '/qmanage/judgetable',
          name: 'judgetable',
          component: judgetable
        }

        ,{
          path: '/qmanage/newqcaozuo',
          name: 'newqcaozuo',
          component: newqcaozuo
        },
        //report
        {
          path:'/report/allreport',
          name:'allreport',
          component:require('@/page/report/allReport')
        },
        {
          path:'/report/examcomputer/:examid',
          name:'examcomputer',
          component:require('@/page/report/examComputer')
        },
        {
          path:'/report/examoperate/:examid',
          name:'reportexamoperate',
          component:require('@/page/report/examOperate')
        },
        {
          path:'/report/afterclassreportdetail',
          name:'afterclassreportdetail',
          component:require('@/page/report/afterClassReportDetail')
        },
        //filemanage
        {
          path:'/filemanage',
          name:'filemanage',
          component:require('@/page/filemanage/filemanage')
        },

        //personal
        {
          path:'/personal',
          name:'personal',
          component:require('@/page/personal/personal'),
          children:[
            {
              path:'/personalinfo',
              name:'personalinfo',
              component:require('@/page/personal/personalInfo')
            },
            {
              path:'/modifypassword',
              name:'modifypassword',
              component:require('@/page/personal/modifyPassword')
            },
            {
              path:'/notification',
              name:'notification',
              component:require('@/page/personal/notification')
            }
          ]
        }
      ]
    }
  ]
})
