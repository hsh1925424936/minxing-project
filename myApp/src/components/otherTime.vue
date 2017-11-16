<template>
    <div class="time">
        {{hour | time}}:{{min | time}}:{{sec | time}}:{{millisec | time}}
    </div>
</template>
<script>
    import bus from '@/bus.js'
    export default {
        name:'learnTime',
        data(){
            return{
                hour:0,
                min:0,
                sec:0,
                millisec:0
            }
        },
        filters:{
            'time':function(val){
                if(val<10){
                    return '0'+val
                }
                return val;
            }
        },
        mounted(){
            let self = this
            let time = localStorage.getItem('time');
            this.hour = Math.floor(time/3600);
            this.min = Math.floor((time-this.hour*3600)/60);
            this.sec = time%60;
            let init = setInterval(this.timer,10);
            let setStorage = setInterval(this.setLocalStorage,1000);
            bus.$on('stop',function(){
                clearInterval(init);
                clearInterval(setStorage);
                localStorage.setItem("time",0);
            })
        },
        methods:{
            setLocalStorage(){
                let self = this
                localStorage.setItem("time",self.hour*3600+self.min*60+self.sec+1);
            },
            timer(){
                if(this.millisec >= 99){
                    this.millisec = 0
                    if(this.sec>=59){
                        this.sec = 0
                        if(this.min>=59){
                            this.min = 0
                            this.hour++
                        }else{
                            this.min++
                        }
                    }else{
                        this.sec++
                    }
                }else{
                    this.millisec++
                }
            }
        }
    }
</script>
<style scoped>

</style>