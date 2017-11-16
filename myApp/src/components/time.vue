<template>
    <div>
        {{currentTime|timeFilter}}
    </div>
</template>
<script>
    export default {
        name:'time',
        data(){
            return{
                name:'hushihao',
                currentTime:0,
            }
        },
        filters:{
			timeFilter(val){
				let hour = Math.floor(val/3600);
				hour = hour<10?('0'+hour):hour
				let min = Math.floor((val-hour*3600)/60);
				min = min<10?('0'+min):min
				let s = val%60;
				s = s<10?('0'+s):s;
				return hour+':'+min+':'+s;
			}
		},
        mounted(){
            let self = this
            this.timer = setInterval(function(){
				self.currentTime++;
			},1000)
        },
        methods:{

        }
    }
</script>