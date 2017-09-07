Vue.component("headerbox",{
    template:"<div><p>{{ thistitle }}</p><span onclick='goBack()'><img src='../../images/futuredoctorapp/icon_fanhui.png' class='tp' alt=''>&nbsp;</span><b onclick='fabu()' id=fabu v-show='ispublic'>发公告</b></div>",
    props:["thistitle",'ispublic']
});
function goBack(){
    window.location.href='application.html';
};
