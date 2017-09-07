Vue.component("headerbox",{
    template:"<div><p>{{ thistitle }}</p><span onclick='goBack()'><img src='../../images/futuredoctorapp/icon_fanhui.png' class='tp' alt=''>&nbsp;</span></div>",
    props:["thistitle"]
});
function goBack(){
	window.location.href='msg.html' 
};
//消息url
