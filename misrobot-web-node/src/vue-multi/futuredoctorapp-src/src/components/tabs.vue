<template>
    <div class="tabs-container"
         :class="{
            'g-wrapper': mode === 'pin'
         }">
        <div class="tabs" :class="className">
            <div class="tab" :class="{'active': btn.active}" tapmode=""
                 v-for="(btn, index) in tabBtns" @click="activeTab(index)">
                <label>{{btn.title}}</label>
                <template v-if="index <= 0">
                    <div class="tab-current-bg"></div>
                </template>
            </div>
        </div>
        <div class="tabs-content" :class="contentclass">
            <slot></slot>
        </div>
    </div>
</template>

<script>

import $ from 'jquery';

export default {
    props: {
        active: {
            type: Number,
            default: 0
        },
        type: {
            type: String,
            require: true
        },
        shape: {
            type: String,
            default: ''
        },
        className: {
            type: String,
            default: ''
        },
        contentClassName: {
            type: String,
            default: ''
        },
        bus: {

        },
        mode: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            tabBtns: []
        }
    },
    events: {
        /*addTabBtn (data) {
            this.tabBtns.push(data);
        }*/
    },
    computed: {
        'contentclass': function(){
            return this.contentClassName + ' ' + (this.mode === 'pin' ? 'g-main': '')
        }
    },
    components: {

    },
    created() {
        let triggerOne = true;
        this.bus.$on('addtabbtn', data => {
            this.tabBtns.push(data);

            for(let i = 0; i< this.tabBtns.length; i++) {
                if(this.tabBtns[i].active) {
                    this.active = i;
                }
            }

            if(triggerOne && this.active === 0) {
                triggerOne = false;
                this.$emit('change-tab', this.tabBtns[0]);
            }

            this.$nextTick(function () {
                this.moveBg(this.active);
            })
        });
    },
    mounted() {

    },
    watch: {
        'active': function (val, old) {
            this.moveBg(val);
            this.$emit('change-tab', this.tabBtns[val]);
        }
    },
    methods: {
        activeTab: function(index) {
            this.active = index;
            for(let i = 0; i< this.tabBtns.length; i++) {
                if(index === i) {
                    this.tabBtns[i].active = true;
                } else {
                    this.tabBtns[i].active = false;
                }
            }
        },
        moveBg(val){

            let $el = $(this.$el);
            let $tabs = $el.find('.tabs');
            let $tab = $tabs.find(`.tab:eq(${val})`);
            let $bg = $tabs.find('.tab-current-bg');
            let $label = $tab.find('label');
            let tabOffset = $bg.closest('.tab').offset();
            let labelOffset = $label.offset();
            let left = ((labelOffset && labelOffset.left) || 0) - ((tabOffset && tabOffset.left) || 0);

            $bg.css({
                width : $label.outerWidth(),
                '-webkit-transform' : 'translate3d(' + left + 'px,0,0)',
                transform: 'translate3d(' + left + 'px,0,0)'
            });
        }
    }
}
</script>
