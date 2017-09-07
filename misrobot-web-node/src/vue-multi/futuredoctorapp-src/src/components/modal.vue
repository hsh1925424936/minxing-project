<template>
    <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut" >
        <div v-show="config.show"
             class="modal flex"
             :class="modalTheme"
             style="animation-duration: .5s"
             :style="{
                 zIndex:zIndex,
                 animationDuration: config.duration,
                 'animation-duration': config.duration
             }">
            <div class="modal-backdrop in show" @click="clickBack"></div>
            <transition
                :enter-active-class="dialogEnterClass"
                :leave-active-class="dialogLeaveClass" >
                <div v-show="config.show"
                     class="modal-dialog"
                     style="animation-duration: .5s"
                     :style="{width: config.width}">
                    <!--<div class="modal-content">-->
                        <slot name="content">
                            <slot name="header">
                                <div class="modal-header">
                                    <slot name="title">
                                        <h4 class="modal-title">{{config.title}}</h4>
                                    </slot>
                                </div>
                            </slot>
                            <div class="modal-body">
                                <slot></slot>
                            </div>
                            <slot name="footer">
                                <div class="modal-footer">
                                    <slot name="buttons">
                                        <button type="button" class="btn" @click.stop="close()">关闭</button>
                                    </slot>
                                </div>
                            </slot>
                        </slot>
                    <!--</div>-->
                </div>
            </transition>
        </div>
    </transition>
</template>
<script type="text/javascript">

import { mapState, mapActions } from 'vuex';

export default {
    props: {
        config: {
            default: function(){
                return {
                    show: false,
                    title: '',
                    hideOnClickOut: true,
                    theme: '',
                    duration: 1,
                    position: 'bottom'  //top center bottom
                }
            }
        }
    },
    data() {
        return {
            zIndex: 0
        }
    },
    mounted: function () {

        this.zIndex = this.maxZIndex;
        this.config.position = this.config.position || 'bottom';
        $(this.$el).css('animationDuration', this.config.duration || '.5s');
    },
    methods: {
        ...mapActions([
            'increaseZIndex'
        ]),
        close(){
            this.config.show = false;
        },
        clickBack() {
            if(this.config.hideOnClickOut) {
                this.config.show = false;
            }
        }
    },
    watch: {
        'config.show': function(val, oldVal){
            if(val === true) {
                this.increaseZIndex();
                this.zIndex = this.maxZIndex;
            }
        }
    },
    computed: {
        ...mapState([
            'maxZIndex'
        ]),
        'dialogEnterClass': function () {

            let pos = this.config.position || 'bottom';

            if(pos === 'bottom') {
                return 'animated fadeInUp';
            } else if(pos === 'top') {
                return 'animated fadeInDown';
            } else if(pos === 'center') {
                return 'animated zoomIn';
            }
        },
        'dialogLeaveClass': function () {

            let pos = this.config.position || 'bottom';

            if(pos === 'bottom') {
                return 'animated fadeOutDown';
            } else if(pos === 'top') {
                return 'animated fadeOutUp';
            } else if(pos === 'center') {
                return 'animated zoomOut';
            }
        },
        'modalTheme': function () {

            let theme = this.config.theme || '';
            let pos = this.config.position || 'bottom';

            if(pos === 'bottom') {
                theme += ' flex-v-end';
            } else if(pos === 'top') {
                theme += ' flex-v-start';
            } else if(pos === 'center') {
                theme += ' flex-v-center';
            }

            return theme;
        }
    }
}
</script>
