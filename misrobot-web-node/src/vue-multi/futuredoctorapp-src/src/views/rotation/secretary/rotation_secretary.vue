<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            住培轮转
        </c-header>
            <c-tabs :bus="bus" @change-tab="changeTab">
                <c-tab title="轮转中" :active="type == 1 ? true: false" :bus="bus" data="1">

                </c-tab>
                <c-tab title="待入科" :active="type == 2 ? true: false"  :bus="bus" data="2">

                </c-tab>
            </c-tabs>
             <div class="g-main">
                <div v-show='type == 1'>
                    <rotation-ready></rotation-ready>
                </div>
                <div v-show='type == 2'>
                    <rotation-wating></rotation-wating>
                </div>
            </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import cHeader from '../../header'
    import methods from '../../../methods'
    import cTab from '../../../components/tab'
    import cTabs from '../../../components/tabs'
    import rotationReady from './rotation_ready'
    import rotationWating from './rotation_wating'
    let bus = new Vue()
    export default {
        name: 'rotation_admin',
        components: {
            cTab,
            cTabs,
            rotationReady,
            rotationWating,
            cHeader,
            methods
        },
        data() {
            return {
                type: 1,
                bus: bus
            }
        },
        //  computed: {
        //     bactive: function(){
        //         return this.type - 1;
        //     }
        // },
        mounted() {
            let self = this
            self.registerToNative('goBack', function (data) {
                self.back();
            });
        },
        methods: {
            ...methods,
            back:function () {
                location.href = '/pages/futuredoctorapp/application.html';
            },
            changeTab(tab) {
                this.type = tab.data;
            },
            // confirmDepts:function(){
            //     this.type = 1
            // }
        }
    }

</script>
<style scoped>


</style>
