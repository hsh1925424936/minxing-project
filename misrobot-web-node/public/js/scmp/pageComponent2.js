Vue.component("page_component",{
    template:"<div class='clearfix' id='pagecomponent'>"+
        "<div class='left'  style='float:left'>"+
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
        "<div class='right directToPage' style='width:200px;float:right'>"+
            "<div class='input-group search'>"+
                "<input type='text' class='form-control' placeholder='输入页码' v-model='directToPageNum'>"+
                "<span class='input-group-btn'>"+
                    "<span class='btn btn-default' @click='directToPage()'>转到</span>"+
                "</span>"+
            "</div>"+
        "</div>"+
        "<nav aria-label='Page navigation' class='right' style='float:right;margin-right:20px;'>"+
            "<ul class='pagination' style='margin-top:0'>"+
                "<li v-show='pageconf.current != 1' @click='(pageconf.current=1) && goto(1,pageconf.itemsPerPage,pageconf.itemName,pageconf.type,pageconf.person,pageconf.status,pageconf.subject,pageconf.label,pageconf.difficult)'><span>首页</span></li>"+
                "<li v-show='pageconf.current != 1' @click='pageconf.current-- && goto(pageconf.current--,pageconf.itemsPerPage,pageconf.itemName,pageconf.type,pageconf.person,pageconf.status,pageconf.subject,pageconf.label,pageconf.difficult)' ><span aria-hidden='true'>&laquo;</span></li>"+
                "<li v-for='index in pages' @click='goto(index,pageconf.itemsPerPage,pageconf.itemName,pageconf.type,pageconf.person,pageconf.status,pageconf.subject,pageconf.label,pageconf.difficult)' :class='{active:pageconf.current == index}'>"+
                "<span>{{index}}</span>"+
                "</li>"+
                "<li v-show='pageconf.allpage != pageconf.current && pageconf.allpage != 0 ' @click='pageconf.current++ && goto(pageconf.current++,pageconf.itemsPerPage,pageconf.itemName,pageconf.type,pageconf.person,pageconf.status,pageconf.subject,pageconf.label,pageconf.difficult)'><span aria-hidden='true'>&raquo;</span></li>"+
                "<li v-show='pageconf.allpage != pageconf.current && pageconf.allpage != 0 ' @click='(pageconf.current=pageconf.allpage) && goto(pageconf.allpage,pageconf.itemsPerPage,pageconf.itemName,pageconf.type,pageconf.person,pageconf.status,pageconf.subject,pageconf.label,pageconf.difficult)'><span>尾页</span></li>"+
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
        	let type=this.pageconf.type;
            	if (type==-1) {
            		type='';
            	}
            	let status=this.pageconf.status;
            	if (status==-1) {
            		status="";
            	}
            	let subject=this.pageconf.subject;
            	if (subject==-1) {
            		subject='';
            	}
            	let difficult=this.pageconf.difficult;
            	if (difficult==-1) {
            		difficult='';
            	}
            this.goto(1,curVal,this.pageconf.itemName,type,this.pageconf.person,status,subject,this.pageconf.label,difficult)
        }
    },
    methods:{
        goto:function(index,itemsperpage,a,b,c,d,e,f,g){//index表示查看第几页,itemsperpage表示每页多少条
            this.pageconf.current = index;
            document.getElementsByTagName('body')[0].scrollTop = 0;
            let type=b;
            	if (type==-1) {
            		type='';
            	}
            	let status=d;
            	if (status==-1) {
            		status="";
            	}
            	let subject=e;
            	if (subject==-1) {
            		subject='';
            	}
            	let difficult=g;
            	if (difficult==-1) {
            		difficult='';
            	}
            this.pageconf.onchange(index,itemsperpage,a,type,c,status,subject,f,difficult)
        },
        directToPage:function(){
            var self=this
            if(self.directToPageNum==''){
                layer.msg('请输入页码')
            }else if(isNaN(self.directToPageNum)){
                layer.msg('页码必须是数字')
            }else if(self.directToPageNum<1 || self.directToPageNum>self.pageconf.allpage){
                layer.msg('不存在该页码')
            }else if(!((self.directToPageNum-0)%1 === 0)){
                layer.msg('请输入整数')
            }else{
            	let type=self.pageconf.type;
            	if (type==-1) {
            		type='';
            	}
            	let status=self.pageconf.status;
            	if (status==-1) {
            		status="";
            	}
            	let subject=self.pageconf.subject;
            	if (subject==-1) {
            		subject='';
            	}
            	let difficult=self.pageconf.difficult;
            	if (difficult==-1) {
            		difficult='';
            	}
                this.goto(self.directToPageNum,self.pageconf.itemsPerPage,self.pageconf.itemName,type,self.pageconf.person,status,subject,self.pageconf.label,difficult)
            }
        }
    }
})
