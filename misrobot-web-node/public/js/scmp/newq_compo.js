/**
 * Created by 54160 on 2017/5/27.
 */
Vue.component('cpagetitle',{
    template:
    "<div class='pagetitle clearfix'>"+
    "<p class='pagetitletext left'>{{ title }}</p>"+
    "<button class='btn btn-primary right' v-show='showback' @click='goback()'>返回</button>"+
    "</div>",
    props:['title','showback'],
    methods:{
        goback:function(){
            window.history.go(-1)
        }
    }
})
Vue.component('cmain',{
    template:
    "<div class='main'>"+
    "<h3 class='maintitle'>{{ maintitle }}</h3>"+
    "<slot></slot>"+
    "</div>",
    props:['maintitle'],
})
Vue.component('cfooter',{
    template:
    "<div class='footer flexcenter'>"+
    "<button class='btn btn-primary' @click='submitnewq()' v-text='btnlefttext?btnlefttext:textdefault'></button>"+
    "<button class='btn btn-default mleft20' @click='goback()'>取消</button>"+
    "</div>",
    props:['submitnewq','btnlefttext'],
    data:function(){
        return{
            textdefault:'添加题目'
        }
    },
    methods:{
        goback:function(){
            window.history.go(-1)
        }
    }
})
Vue.component('cupdate',{
    template:
    "<div class='footer flexcenter'>"+
        "<button class='btn btn-primary' @click='submitnewq()'>修改题目</button>"+
        "<button class='btn btn-default mleft20' @click='close()'>取消</button>"+
    "</div>",
    props:['submitnewq'],
    methods:{
        close:function(){
            var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
            parent.layer.close(index)
        }
    }
})
