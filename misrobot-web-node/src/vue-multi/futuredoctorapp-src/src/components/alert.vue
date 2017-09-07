<template>
    <c-modal :config="alert">
        <template v-if="!alert.title">
            <template slot="header"></template>
        </template>
        {{alert.msg}}
        <template slot="buttons">
            <button type="button" class="btn" @click.stop="ok()">确定</button>
        </template>
    </c-modal>
</template>
<style></style>
<script>
    import { mapState, mapActions } from 'vuex';
    import cModal from './modal.vue';

    export default {
        data(){
            return {
                zIndex: 0
            };
        },
        components: {
            cModal
        },
        computed: mapState([
            'alert',
            'maxZIndex'
        ]),
        methods: {
            ...mapActions([
                'hideAlert',
                'increaseZIndex'
            ]),
            ok: function(){
                this.alert && this.alert.ok && this.alert.ok();
                this.hideAlert();
            }
        },
        watch: {
            'alert.show': function(val, oldVal){
                if(val === true) {

                    console.log(JSON.stringify(this.alert));
                    this.zIndex = this.maxZIndex;
                    this.increaseZIndex();
                }
            }
        }
    }
</script>
