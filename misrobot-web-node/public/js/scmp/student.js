$.ajax({
	type:"post",
	url:"/cls/studentlist",
	async:true,
	success:function(data){
		console.log(data);
	}
});
var vm=new Vue({
	el:"#message-student",
	data:{
		willShow:false,
		checkAllFlag:false,
		checkedOne:false,
		messageShow:false,
		deleteShow:false
	},
	methods:{
		add:function(){
			this.willShow=true;
		},
		remove:function(){
			this.willShow=false;
			this.messageShow=false;
			this.deleteShow=false;
		},
		checkedAll:function(){
			this.checkAllFlag=!this.checkAllFlag;
			var _this=this;
			if (this.checkAllFlag) {
				
				_this.checkedOne=true;
			}else{
				_this.checkedOne=false;
				
			}
		},
		cancel:function(){
			this.willShow=false;
			this.messageShow=false;
			this.deleteShow=false;
		},
		edit:function(){
			this.messageShow=true;
		},
		delete_message:function(){
			this.deleteShow=true;
		}
	}
})
var oA=document.querySelectorAll('.aaaa');
var oSure=document.querySelector('.delete_sure .btn-primary')
for (var i=0;i<oA.length;i++) {
	oA[i].onclick=function(){
		var oTr=this.parentElement.parentElement;
		oSure.onclick=function(){
			oTr.parentElement.removeChild(oTr);
			vm.deleteShow=false;
		}
		
	}
}