<template>
    <div class="g-wrapper">
        <!--<c-header>-->
            <!--<div slot="headerLeft">-->
                <!--<a @click="back()" class="header-back-btn">-->
                    <!--<img src="../../assets/images/icon_fanhui.png" />-->
                <!--</a>-->
            <!--</div>-->
            <!--物品信息-->
        <!--</c-header>-->
        <div class="g-main">
            <ul>
                <li>
                    <label>物品编号</label><i></i>
                    <span>{{item.number}}</span>
                </li>
                <li>
                    <label>物品名称</label><i></i>
                    <span>{{item.name}}</span>
                </li>
                <li>
                    <label>分类</label><i></i>
                    <span>{{item.ass}}</span>
                </li>
                <li v-show="item.description !=='' ">
                    <label>功能说明</label><i></i>
                    <span>{{item.description}}</span>
                </li>
                <li v-show="item.parts !=='' ">
                    <label>配件清单</label><i></i>
                    <span>{{item.parts}}</span>
                </li>
                <li>
                    <label>存放地址</label><i></i>
                    <span>{{item.address}}</span>
                </li>
                <li>
                    <label>厂家</label><i></i>
                    <span>{{item.vender}}</span>
                </li>
                <li>
                    <label>供应商</label><i></i>
                    <span>{{item.Supplier}}</span>
                </li>
                <li>
                    <label>入库时间</label><i></i>
                    <span>{{item.storagetime}}</span>
                </li>
                <li>
                    <label>采购人</label><i></i>
                    <span>{{item.purchaser}}</span>
                </li>
                <li v-show="item.listscore && item.listscore !==[]">
                    <label>使用记录</label><i></i>
                </li>
            </ul>
            <div class="users" v-show="item.listscore && item.listscore !==[]">
                <table border="1">
                    <tr>
                        <th>使用人</th>
                        <th>使用日期</th>
                    </tr>
                    <tr v-for="(val,index) in item.listscore">
                        <td>{{val.userinfo.users[0].name}}</td>
                        <td>{{val.submitlist.starttime | substr(0,10)}}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery'
    import methods from '../../methods';
    import cHeader from '../header.vue';
    import cModal from '../../components/modal';
    import { mapState, mapActions } from 'vuex';
    export default {
        data() {
            return {
                item:''
            }
        },
        components: {
            cHeader,
            cModal
        },
        mounted () {
            $('title').html('物品信息')
            this.init();
        },
        methods:{
            ...methods,
            init(){
                let _this=this;
                let url = window.location.href.split("=")[1];
                if (url<=4){
                    this.post('/deviceusage/deviceusagehis', {
                        command: 'deviceusage/deviceusagehis',
                        deviceid:'00:FF:10:C0:A7:08'
                    }).done(function (data) {
                        _this.item={
                            number:'IM'+20160801000+url,
                            name:'综合穿刺智能训练系统',
                            ass:'智能设备',
                            description:'胸腔穿刺术、腹膜腔穿刺术、腰椎穿刺术、骨髓穿刺术',
                            parts:'操作器械托盘1套， 操作器械1套：含穿刺针、麻醉注射器、多功能操控笔等',
                            address:'临床技能中心6号楼301教室',
                            vender:'敏行医学信息技术有限公司',
                            Supplier:'敏行医学信息技术有限公司',
                            storagetime:'2016-08-01',
                            purchaser:'张珊',
                            listscore:data.listscore
                        }
                    });
                }else if (url==5){
                    this.post('/deviceusage/deviceusagehis', {
                        command: 'deviceusage/deviceusagehis',
                        deviceid:'PAL2017-7-21-YTHJS-XC'
                    }).done(function (data) {
                        _this.item={
                            number:'PAL2017-7-21-YTHJS-XC',
                            name:'胸腔穿刺模型人',
                            ass:'模型人',
                            description:'胸腔穿刺',
                            parts:'',
                            address:'临床技能中心6号楼301教室',
                            vender:'敏行医学信息技术有限公司',
                            Supplier:'敏行医学信息技术有限公司',
                            storagetime:'2014-11-02',
                            purchaser:'张珊',
                            listscore:data.listscore
                        }
                    });
                }else if (url==6){
                    this.post('/deviceusage/deviceusagehis', {
                        command: 'deviceusage/deviceusagehis',
                        deviceid:'PAL2017-7-21-KFXL-XC'
                    }).done(function (data) {
                        _this.item={
                            number:'PAL2017-7-21-KFXL-XC',
                            name:'胸腔穿刺模型人',
                            ass:'模型人',
                            description:'胸腔穿刺',
                            parts:'',
                            address:'临床技能中心6号楼301教室',
                            vender:'敏行医学信息技术有限公司',
                            Supplier:'敏行医学信息技术有限公司',
                            storagetime:'2014-11-02',
                            purchaser:'张珊',
                            listscore:data.listscore
                        }
                    });
                }else if (url==9){
                    _this.item={
                        number:'ED20150623001',
                        name:'摄像头',
                        ass:'电子设备',
                        description:'',
                        parts:'',
                        address:'临床技能中心6号楼301教室',
                        vender:'海康威视',
                        Supplier:'京东商城',
                        storagetime:'2015-06-23',
                        purchaser:'李东梅'
                    }
                }else if (url==10){
                    _this.item={
                        number:'ED20150623002',
                        name:'投影仪',
                        ass:'电子设备',
                        description:'',
                        parts:'',
                        address:'临床技能中心6号楼301教室',
                        vender:'海康威视',
                        Supplier:'京东商城',
                        storagetime:'2015-06-23',
                        purchaser:'李东梅'
                    }
                }
            },
            back(){
                setTimeout(window.history.go(-1),1500);
            }
        }
    }
</script>
<style lang="scss" scoped>
    .users {
        background: #fff;
        padding:0.3rem 0;
    }
    .users table {
        margin:0 auto;
        text-align: center;
        width:90%;
    }
    th,td {
        padding:0.1rem;
    }
    label {
        width:1.5rem;
        text-align: justify;
        text-align-last:justify;
        color: #666;
    }
    i {
        font-style: normal;
    }
    li i:after {
        content: ':';
        padding:0.1rem;
    }
    li {
        background: #fff;
        padding:0.2rem;
        border-bottom: 1px solid #DBDBDB;
        display: flex;
    }
    li span {
        flex:1;
    }
</style>
