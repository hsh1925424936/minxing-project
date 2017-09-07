window.onload = function () {
	'use strict';
	common();
	
	var oDiv = $('.instrumentPanel')[0];
	writemeter(oDiv);
	$('.littleChart div').each(function () {
		$(this)[0].radialObj = radialIndicator($(this),{
			radius:35,
			barBgColor:'#4fb6d7',
	        barColor: '#fff',
	        barWidth: 5,
	        initValue: 0,
	        displayNumber:false,
	        roundCorner : true,
	    });	
	});	
	
	//查询成长趋势
	Api.R({
		url: "/learningindex/querymyindex",
		isShade:1,
		json:{
			'1':{
				command:'learningindex/querymyindex',
				sessionid: getCookie('gy_t'),
				accountname: getCookie('gy_un'),
				loginid: getCookie('gy_u'),
				uid: getCookie('gy_u')
			}
		},
		fn:function (base) {
			var json = base[1];
			console.log(json);
			if (json.errcode!=0) {
				uselayer(3,json.errdesc);
				return false;
			}						
			
			oDiv.option.series[0].data[0].value = parseInt(isnull(json.learningindex));
		    oDiv.myChart.setOption(oDiv.option, true);				
		    var timer = null;
		    var i = 0;
		    if( parseInt(isnull(json.learningindex)) < 1 ){
		    	$('.point').html(i);
		    }else{
			    timer = setInterval(function () {
			    	i++;
			    	$('.point').html(i);
			    	if (i>=parseInt(isnull(json.learningindex))) {
			    		clearInterval(timer);
			    	}
			    },400/parseInt(isnull(json.learningindex)));
		    }
		    

			$('.littleChart div').eq(0)[0].radialObj.animate(parseFloat(isnull(json.studiousindex)));
			$('.littleChartNum1').eq(0).html(parseFloat(isnull(json.studiousindex)).toFixed(2));
			$('.littleChart div').eq(1)[0].radialObj.animate(parseFloat(isnull(json.quickindex)));
			$('.littleChartNum1').eq(1).html(parseFloat(isnull(json.quickindex)).toFixed(2));
			$('.littleChart div').eq(2)[0].radialObj.animate(parseFloat(isnull(json.medicalindex)));
			$('.littleChartNum1').eq(2).html(parseFloat(isnull(json.medicalindex)).toFixed(2));
			$('.littleChart div').eq(3)[0].radialObj.animate(parseFloat(isnull(json.kindindex)));
			$('.littleChartNum1').eq(3).html(parseFloat(isnull(json.kindindex)).toFixed(2));
			
			$('.learnRank').eq(0).html('排名&nbsp;'+isnull(json.studiousindexrank));
			$('.learnRank').eq(1).html('排名&nbsp;'+isnull(json.quickindexrank));
			$('.learnRank').eq(2).html('排名&nbsp;'+isnull(json.medicalindexrank));
			$('.learnRank').eq(3).html('排名&nbsp;'+isnull(json.kindindexrank));
			 
		}
	});	


	Api.R({
		url: "/learningindex/querymygrowthtrend",
		isShade: 1,
		json: {
			"1": {
				command:'learningindex/querymygrowthtrend',
				sessionid: getCookie('gy_t'),
				accountname:getCookie('gy_un'),
				loginid: getCookie('gy_u'),
				uid: getCookie('gy_u')
			}
		},
		fn: function(result){
			if(result["1"].errcode != 0){
				console.log(result["1"].errdesc);
				return;
			}
			writegrow(result["1"]);
		}
	});

	Api.R({
		url: "/learningindex/querymyability",
		isShade: 1,
		json: {
			"1": {
				command:'learningindex/querymyability',
				sessionid: getCookie('gy_t'),
				accountname:getCookie('gy_un'),
				loginid: getCookie('gy_u'),
				uid: getCookie('gy_u')
			}
		},
		fn: function(result){
			if(result["1"].errcode != 0){
				console.log(result["1"].errdesc);
				return;
			}
			writeability(result["1"]);
		}
	})			
		

};
