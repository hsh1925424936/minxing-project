<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            训练成绩
        </c-header>
        <div class='g-main'>
        	<div class="statistics">
            <p class="title">完成情况统计</p>
            <div class="staboxleft">
            	<img src="../../assets/images/yuan.png" />
            	<p>{{totalscore}}<span>分</span></p>
            </div>
        	<div class="staboxright">
                <div><img src="../../assets/images/shichang.png" /><span>总时长：</span><span>{{totaltime}} 分钟</span> </div>
                <div><img src="../../assets/images/dati.png" /><span>答题数：</span><span>{{doneitems}}/{{totalitems}}题</span> </div>
                <div><img src="../../assets/images/jibai.png" /><span>击败同学：</span><span>{{beat}}%</span> </div>
           </div>
        </div>
        <div class="statistics">
            <p class="title">胜任力模型</p>
            <template>
                <div class="content">
                    <div id="echart"></div>
                </div>
            </template>
        </div>
        <div class="statistics err">
            <p class="title">操作错误详情</p>
            <table border="1" class="ldpoints">
                <tr>
                    <th>步骤</th>
                    <th>实际操作</th>
                    <th>得分</th>
                </tr>
                <tr v-for="item in scoreList">
                    <td>{{item.opstepcontent}}</td>
                    <td>{{item.subitemcontent}}</td>
                    <td>{{parseInt(item.score)}}</td>
                </tr>
            </table>
        </div>
        </div>

    </div>
</template>
<script>
    import $ from 'jquery';
    import methods from '../../methods';
    import cModal from '../../components/modal';
    import cHeader from '../header';
    import xieFn from '../../vuex/xie';
    import noContent from '../no_content.vue';
    import { mapState, mapActions } from 'vuex';
    import echarts from'echarts/lib/echarts';
    import 'echarts/lib/chart/radar'


    export default {
        data() {
            return {
            	scoreid: '',
            	totalscore:'',
            	totaltime:'',
            	doneitems:'',
            	totalitems:'',
            	beat:'',
            	abilities:[],
            	scoreList:'',
            	typescore:[],
            	echartsradius:'',
            	echartsfont:''
            }
        },
        components: {
            cHeader,
            cModal,
            noContent
        },
        mounted () {
            this.setTitle('训练成绩')
            let self=this;
            this.scoreid = this.$route.query.scoreid;
//
            this.post('/grade/getscore', {
	            command:'grade/getscore',
                operatorsessionid:$.cookie('sid'),
                operatoraccount:$.cookie('uid'),
	            scoreid:self.scoreid,
	            uid: $.cookie('uid'),
	            loginid: $.cookie('uid')
	        }).done(function(data){
                self.scoreList=data.score;
                self.totalscore=parseInt(data.totalscore);
                self.doneitems=data.doneitems;
                self.totalitems=data.totalitems;
                self.beat=parseFloat(data.beat*100).toFixed(2);
                self.scoreList=data.score;

				var datebegin=new Date(data.begintime.split('.')[0]);
				var dateend=new Date(data.endtime.split('.')[0]);
				var datetotal=dateend.getTime() - datebegin.getTime() ;
				var days=parseFloat(datetotal/60000).toFixed(2);

                self.totaltime=days;
                self.typescore=[
	                data.braq_score,
	                data.yhgt_score,
	                data.zysy_score,
	                data.lcsw_score,
	                data.zyjn_score,
	                data.zyzs_score,
	                data.rwgh_score,
	                data.wjgn_score
                ];
                self.abilities=
			            [
			                { text: '病人安全', max: 100 },
			                { text: '医患沟通', max: 100 },
			                { text: '职业素养', max: 100 },
			                { text: '临床思维', max: 100 },
			                { text: '专业技能', max: 100 },
			                { text: '专业知识', max: 100 },
			                { text: '人文关怀', max: 100 },
			                { text: '无菌观念', max: 100 }
			            ];
	 			self.$nextTick(function() {
	                self.drawGraph('echart',self.typescore)
	           });
	        }).fail(function () {
	        });
            if(navigator.userAgent.indexOf("iPhone")!=-1){
				self.echartsradius=140,
				self.echartsfont=30
            } else {
                self.echartsradius=70
                selfechartsfont=15
            }
            console.log(self.echartsradius)
        },
        methods: {
            ...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
        init(){
        },
        query(){
       },
        drawGraph(id,score){
            this.chart = echarts.init(document.getElementById(id));
            this.chart.showLoading();
            this.chart.setOption({
			    radar: [
			        {
			            indicator:this.abilities,
			            center: ['50%', '50%'],
			            radius: this.echartsradius,
			            startAngle: 90,
			            splitNumber: 5,
			            shape: 'polygon',
			            name: {
			                formatter:'{value}',
			                textStyle: {
			                    color:'#666',
			                    fontSize:this.echartsfont,
			                }
			            },
			            nameGap:10,
			            splitArea: {
			                areaStyle: {
			                    color: ['#fff','#fff', '#fff','#fff', '#fff'],
			                    shadowColor: 'rgba(0, 0, 0, 0.3)',
			                    shadowBlur: 10,
			                }
			            },
			            axisLine: {
			                show:false,
			            },
			            splitLine: {
			            	show:false,
			            }
			        },
			    ],
			    series: [
			        {
			            type: 'radar',
			            data: [
			                {
			                    value:
			                    score,
//			                    [100,100,100,100,90,80,70,90],
			                    areaStyle: {
			                        normal: {
			                            opacity: 0.9,
			                            color: 'rgba(183,226,255,0.6)'
			                        }
			                    },
			                    lineStyle:{
			                    	normal:{
			                    		width:0,
			                    	}
			                    },
			                    itemStyle:{
			                    	normal:{
			                    		borderWidth:0,
			                    		borderColor:'b7e2ff'
			                    	}
			                    },
			                    symbolSize:0
			                }
			            ]
			        },
			    ]
            });
            this.chart.hideLoading();
        },
        back(){
            this.$router.push({
                name: 'fdpersonal'
            })
        }
    }
    }
</script>
<style>
    .statistics {
        padding: 0 0.2rem;
        background: #fff;
        font-size: 0;
        margin-bottom: 0.2rem;
    }
    .title {
        padding-top:0.2rem;
        color: #3499db;
        width: 100%;
        display: block;
    	font-size: 0.267rem;
    	margin: 0 0 0.1rem 0;
    }
    .statistics div{
    }
    .staboxleft{
    	display: inline-block;
    	width: 35%;
    	font-size: 0.267rem;
    	position: relative;
    	text-align: center;
    	vertical-align: middle;
    }
    .staboxleft p{
    	position: absolute;
    	top: 33%;
    	width: 100%;
    	color: #fff;
    	font-size: 0.5rem;
    }
    .staboxleft p span{
    	font-size: 0.25rem;
    }
    .staboxleft img{
    	width: 100%;
    }
    .staboxright{
    	display: inline-block;
    	width: 65%;
    	font-size: 0.267rem;
    	vertical-align: middle;
    }
    .staboxright div{
    	line-height: 0.6rem;
    }
    .staboxright img{
    	width: 0.35rem;
    	vertical-align: middle;
    	margin: 0 0.2rem;
    }
    .staboxright span{
    	vertical-align: middle;
    	line-height: 0.35rem;
    }
    .content {
        height:4rem;
        padding:0.2rem;
        background:#fff;
    }
    #echart {
            width: 5rem;
            height: 4rem;
            margin: auto;
        }
    .err {
    	font-size: 0.267rem;
    }
    .ldpoints {
        width:100%;
        margin:0.2rem auto;
    }
    .ldpoints tr{
    	text-align: center;
    	height: 0.5rem;
    }
    .ldpoints th{
    	font-weight: 100;
    	color: #3499db;
    }
    .ldpoints td{
    	color: #333;
    	font-weight: 100;
    	text-align: center;
    }
</style>
