<template>
    <div class="root">
        <c-header>
            <div slot="center">
                商品详情
            </div>
        </c-header>
        <div class="main" ref="main">
            <div class="left" ref="left">
                    <ul>
                        <li v-for="(item,index) in menuList" :class="{'active':currentIndex==index}">{{item.name}}</li>
                    </ul>
            </div>
            <div class="right" ref="right">
                <div>
                    <div v-for="(item,index) in menuList" class="list">
                        <h1 :class="{'active':currentIndex==index}">{{item.name}}</h1>
                        <div v-for="girl in item.girls">
                            <img :src="girl.url" alt="">
                            <span>{{girl.name}}</span>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</template>
<script>
    import cHeader from './header'
    import BScroll from 'better-scroll'
    export default {
        name:'shopDetail',
        components:{
            cHeader
        },
        data(){
            return{
                leftScroll:null,
                rightScroll:null,
                scrollY:0,
                listHeight:[],
                currentIndex:0,
                menuList:[
                    {name:'热销榜',girls:[{url:require('../assets/img/1.jpg'),name:'小小'},{url:require('../assets/img/2.jpg'),name:'小红'},{url:require('../assets/img/3.jpg'),name:'小白'}]},
                    {name:'校花榜',girls:[{url:require('../assets/img/4.jpg'),name:'小彤彤'},{url:require('../assets/img/5.jpg'),name:'小A'},{url:require('../assets/img/6.jpg'),name:'小B'}]},
                    {name:'模特榜',girls:[{url:require('../assets/img/7.jpg'),name:'小爱'},{url:require('../assets/img/8.jpg'),name:'小青'},{url:require('../assets/img/9.jpg'),name:'小C'}]},
                    {name:'小草榜',girls:[{url:require('../assets/img/10.jpg'),name:'小小'},{url:require('../assets/img/11.jpg'),name:'小红'},{url:require('../assets/img/12.jpg'),name:'小'}]},
                    {name:'无名氏',girls:[{url:require('../assets/img/13.jpg'),name:'小小奴'}]},
                ]
            }
        },
        created(){
            // const main = this.$refs.main;
            // console.log(main)
            this.$nextTick(()=>{
                this._initScroll();
            })
        },
        computed:{
            // currentIndex(){
            //     for(let i=0;i<this.listHeight.length;i++){
            //         let height1 = this.listHeight[i];
            //         let height2 = this.listHeight[i+1];
            //         if(!height2 || (this.scrollY >= height1 && this.scrollY <= height2)){
            //             return i;
            //         }
            //     }
            //     return 0;
            // }
        },
        methods:{
            _initScroll(){
                // this.leftScroll = new BScroll('.left',{
                //     scrollY:true,
                //     click:true
                // })
                this.rightScroll = new BScroll('.right',{
                    scrollY:true,
                    click:true,
                    // probeType:3
                })
                // this.rightScroll.on('scroll',(pos)=>{
                //     this.scrollY = Math.abs(Math.round(pos.y));
                // })
            },
            // _calculateHeight(){
            //     let list = this.$refs.right.getElementsByClassName('list');
            //     let height=0;
            //     this.listHeight.push(height);
            //     for(let i = 0;i<list.length;i++){
            //         let item = list[i];
            //         height+=item.clientHeight
            //         this.listHeight.push(height);
            //     }
            // }
        }
    }
</script>
<style scoped>
    .main{
        width:100%;
        /* height:100vh; */
        position:absolute;
        top:2rem;
        /* bottom:2rem; */
        /* display:flex; */
        /* padding-top:2rem; */
        /* box-sizing: border-box; */
        /* overflow:hidden;  */
    }
    .left{
        width:5rem;
        /* position:fixed; */
        float:left;
        /* top:2rem; */
        height:calc(100vh - 2rem);
        overflow:hidden;
    }
    .left li{
        width:100%;
        text-align:center;
        height:9rem;
        line-height: 3rem;
    }
    .right{
        width:calc(100% - 5rem);
        /* border:solid 1px black; */
        height:calc(100vh - 2rem); 
        margin-left:5rem;
        /* margin-top:0.5rem; */
         overflow:hidden; 
    }
    .right img{
        width:8rem;
    }
    h1{
        font-size:1.5rem;
        -webkit-text-stroke: 2px #2099db;
        color:transparent;
         font-style:italic; 
    }
    .active{
        /* background:#2099db; */
        color:gray;
    }
</style>