<template>
    <div>

        <c-tabs :bus="bus">
            <c-tab title=" 待审批 " :active="type == 1 ? 'true': 'false'" :bus="bus">
                <div class="list list-cut">
                    <a v-for="it in list" class="item item-icon-left item-icon-right valign-center">
                        <i class="iconfont icon-clock"></i>
                        <div class="auto-width">
                            <h3>{{it.name}}</h3>
                            <p>{{it.addr}}</p>
                        </div>
                        <i class="iconfont icon-go txt-999"></i>
                    </a>
                </div>
            </c-tab>
            <c-tab title=" 审批不通过 " :active="type == 2 ? 'true': 'false'" :bus="bus">
                审批不通过审批不通过审批不通过审批不通过审批不通过
            </c-tab>
            <c-tab title=" 待训练 " :active="type == 3 ? 'true': 'false'" :bus="bus">
                待训练待训练待训练
            </c-tab>
            <c-tab title=" 已完成 " :active="type == 4 ? 'true': 'false'" :bus="bus">
                已完成已完成已完成
            </c-tab>
        </c-tabs>
    </div>
</template>
<script>
    import Vue from 'vue';
    import cTabs from "../../../components/tabs";
    import cTab from "../../../components/tab";

    let bus = new Vue();

    export default {
        data() {
            return {
                type: 2,
                bus: bus,
                list: [],
                list2: []
            }
        },
        route: {
            data: function(transition) {

            }
        },
        components: {
            cTabs,
            cTab
        },
        created() {
            this.type = Number(this.$route.query.type || 2);
            let self = this;

            setTimeout(function () {
                self.list = [{
                    name: 'hello',
                        addr: 'world'
                },{
                    name: 'hello',
                        addr: 'world'
                },{
                    name: 'hello',
                        addr: 'world'
                }];
            }, 5000)

            /*$.get({
                success: function(data){
                    self.list = data;
                }
            });*/
        }
    }
</script>
