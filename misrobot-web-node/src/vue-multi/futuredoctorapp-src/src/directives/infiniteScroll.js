/**
 * @author liuchuanyang
 * @date 2017-03-13
 */

import $ from 'jquery'
import Utils from '../assets/js/utils/utils'

export default {
    inserted (el, binding, vnode) {
        let self = this;
        let $el = $(el);
        let distance = (binding.value && binding.value.distance) || 10;
        let callback = (binding.value && binding.value.callback) || binding.expression;
        let fn = Utils.fixInterval(function () {
            vnode.context[callback] && vnode.context[callback]()
        }, 100);

        $el.on('scroll', () => {
            let height = parseFloat($el.height())
            let scrollTop = parseFloat($el.scrollTop())
            let totalHeight = height + scrollTop
            if ($el[0].scrollHeight - totalHeight <= distance) {
                fn();
            }
        })
    }
}
