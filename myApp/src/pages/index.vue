<template>
    <div>
        <current-time></current-time>
        <!-- <button type="button" @click="$router.push('/shop')">去购物车页面</button> -->
        <button type="button" @click="$router.push('/shopDetail')">去商品详情页面</button>
        <!-- <high-charts :options="options" ref="simpleChart"></high-charts>  -->
    </div>
</template>
<style scoped>
    h1{font-size:2rem;}
</style>
<script>
    import {mapState,mapActions} from 'vuex';
    import currentTime from '@/components/time';
    import highCharts from '@/components/highchart';
    export default {
        name:'index',
        components:{
            currentTime,
            highCharts,
        },
        data(){
            return{
                options:[29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            }
        },
        computed:{...mapState(['message'])},
        mounted(){

        },
        methods:{

        }
    }
</script>