Vue.component("page_component",{
    template:"<div class='clearfix' id='pagecomponent'>"+
        "<div class='left'>"+
        "<ul class='list-inline mt20'>"+
            "<li>每页显示</li>"+
            "<li>"+
                "<select v-model='pageconf.itemsPerPage' class='form-control'>"+
                    "<option>10</option>"+
                    "<option>20</option>"+
                    "<option>30</option>"+
                    "<option>50</option>"+
                "</select>"+
            "</li>"+
            "<li>条</li>"+
            "<li>共 {{ pageconf.totalnum }} 条</li>"+
        "</ul>"+
        "</div>"+
        "<div class='right directToPage'>"+
            "<div class='input-group'>"+
                "<input type='text' class='form-control' placeholder='输入页码' v-model='directToPageNum'>"+
                "<span class='input-group-btn'>"+
                    "<span class='btn btn-default' @click='directToPage()'>转到</span>"+
                "</span>"+
            "</div>"+
        "</div>"+
        "<nav aria-label='Page navigation' class='right'>"+
            "<ul class='pagination'>"+
                "<li v-show='pageconf.current != 1' @click='(pageconf.current=1) && goto(1,pageconf.itemsPerPage)'><span>首页</span></li>"+
                "<li v-show='pageconf.current != 1' @click='pageconf.current-- && goto(pageconf.current--,pageconf.itemsPerPage)' ><span aria-hidden='true'>&laquo;</span></li>"+
                "<li v-for='index in pages' @click='goto(index,pageconf.itemsPerPage)' :class='{active:pageconf.current == index}'>"+
                "<span>{{index}}</span>"+
                "</li>"+
                "<li v-show='pageconf.allpage != pageconf.current && pageconf.allpage != 0 ' @click='pageconf.current++ && goto(pageconf.current++,pageconf.itemsPerPage)'><span aria-hidden='true'>&raquo;</span></li>"+
                "<li v-show='pageconf.allpage != pageconf.current && pageconf.allpage != 0 ' @click='(pageconf.current=pageconf.allpage) && goto(pageconf.allpage,pageconf.itemsPerPage)'><span>尾页</span></li>"+
            "</ul>"+
        "</nav>"+
    "</div>",
    props:['pageconf','pages'],
    data:function(){
        return {
            // itemsPerPage:10,
            directToPageNum:'',
        }
    },
    mounted:function(){

        if(this.pageconf) {
            if(!this.pageconf.itemsPerPage) {
                this.pageconf.itemsPerPage = 10;
            }
        }
        $('.pagination>li>span').css({
            cursor:'pointer'
        })
        $('.directToPage').css({
            width:'136px',
            paddingTop:'20px',
            marginLeft:'20px'
        })
        $('#pagecomponent').css({
            padding:'0 20px'
        })
    },
    watch:{
        'pageconf.itemsPerPage':function(curVal,oldVal){
            this.goto(1,curVal)
        }
    },
    methods:{
        goto:function(index,itemsperpage){//index表示查看第几页,itemsperpage表示每页多少条
            document.getElementsByTagName('body')[0].scrollTop = 0;
            this.pageconf.current = index
            this.pageconf.onchange(index,itemsperpage)
        },
        directToPage:function(){
            var self=this;
            if(self.directToPageNum==''){
                layer.msg('请输入页码')
            }else if(isNaN(self.directToPageNum)){
                layer.msg('页码必须是数字')
            }else if(self.directToPageNum<1 || self.directToPageNum>self.pageconf.allpage){
                layer.msg('不存在该页码')
            }else if(!((self.directToPageNum-0)%1 === 0)){
                layer.msg('请输入整数')
            }else{
                this.goto(self.directToPageNum,self.pageconf.itemsPerPage)
            }
        }
    }
})
