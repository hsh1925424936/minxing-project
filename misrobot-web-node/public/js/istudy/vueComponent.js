/**
 * Created by lenovo on 2017/1/15.
 */

Vue.component("headerbox",{
    template:"<div><p>{{ thistitle }}</p><span onclick='goBack()' class='glyphicon glyphicon-chevron-left'></span><img src='../../images/istudy/refreshnew.png' alt='' onclick='refresh()'></div>",
    props:["thistitle"]
});
function goBack(){
    if(window.location.href.indexOf("interaction")!=-1){//这个页面不能回退
        return
    }
    window.location.href="startstu.html"
};
function refresh(){
    window.location.reload();
}
var vm=new Vue({
    el:"#header",
    data:{
    },
});
