/*分页*/
function quePage(pageJson,learnid){
	var $foo = 12;
	var pageBtn = '<li><a href="javascript:pagesComm('+1+','+pageJson.status+','+learnid+')" class="firsPage">首页</a></li>';
	pageBtn += '<li><a href="javascript:pagejian('+pageJson.status+','+learnid+')">上一页</a></li>';
	for(var i=1;i<=pageJson.pages;i++){
		if(pageJson.pages <= $foo){
			pageBtn += '<li page="'+i+'"><a href="javascript:pagesComm('+i+','+pageJson.status+','+learnid+')">'+(i)+'</a></li>';
		}else if(pageJson.pages > $foo){
			if(pageJson.page >= pageJson.pages-4){
				if(i<=3 || i > pageJson.pages-($foo-3)){
					pageBtn += '<li page="'+i+'"><a href="javascript:pagesComm('+i+','+pageJson.status+','+learnid+')">'+(i)+'</a></li>';
				}else if(i==4){
					pageBtn += '<li page="'+i+'"><a href="javascript:void(0)">...</li>';
				}
			}else if(pageJson.page >$foo-3 && i>=pageJson.page -($foo-3)){
				if(i>pageJson.page -$foo-3 && i<=pageJson.page){
					pageBtn += '<li page="'+i+'"><a href="javascript:pagesComm('+i+','+pageJson.status+','+learnid+')">'+(i)+'</a></li>';
				}else if(i<pageJson.pages-2 && i>pageJson.page - 9){
					if(i==pageJson.page+1){
						pageBtn += '<li page="'+i+'"><a href="javascript:void(0)">...</li>';
					}
				}else{
					pageBtn += '<li page="'+i+'"><a href="javascript:pagesComm('+i+','+pageJson.status+','+learnid+')">'+(i)+'</a></li>';
				}
			}else if(pageJson.page <=$foo-3 && i>=pageJson.page - ($foo-3)){
				if(i>$foo-3 && i< pageJson.pages-2){
					if(i == ($foo-3)+1){
						pageBtn += '<li page="'+i+'"><a href="javascript:void(0)">...</li>';
					}
				}else{
					pageBtn += '<li page="'+i+'"><a href="javascript:pagesComm('+i+','+pageJson.status+','+learnid+')">'+(i)+'</a></li>';

				}
			}	
		}
	
	}
	pageBtn += '<li><a href="javascript:pagejia('+pageJson.status+','+learnid+')">下一页</a></li>';
	var ses = "";
	for(var j=1;j<=pageJson.pages;j++){
		ses += '<option>'+j+'</option>';
	}
	pageBtn += '<li><select class="go goTxt" id="goTxt">'+ses+'</select><input value="go" class="go goBtn" type="button" onclick="goPage()"></li>';
	pageBtn += '<li class="lastPage"><a  href="javascript:pagesComm('+pageJson.pages+','+pageJson.status+','+learnid+')">末页</a></li>';
	$("#pagesBtn").html(pageBtn);
	$("#pagesBtn").find("li[page="+pageJson.page+"]").find("a").addClass("on").parents("li").siblings().find("a").removeClass("on");
	$("#pagesBtn").find("li[page="+pageJson.page+"]").addClass("on").siblings().removeClass("on");
}

function pagesComm(pas,status,learnid){
	page = pas;
	jsonDataQueList.page = pas;
	queList(learnid,status)
}

function pagejia(status,learnid){

	page++;
	if(page>pages){
		page = pages;
		return ;
	}else{
		jsonDataQueList.page = page;
		queList(learnid,status)
	}
}
function pagejian(status,learnid){
	page--;
	if(page<1){
		page = 1;
		return;
	}else{
		jsonDataQueList.page = page;
		queList(learnid,status);
	}
}

function goPage(){
	var gopage = $("#goTxt").val();
	pagesComm(gopage,status,learnid);
	queList(learnid,status);
}
