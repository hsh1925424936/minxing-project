import $ from 'jquery'

export default {
    changeMainMenu: ({ commit }, mainMenu) => commit('CHANGE_MAIN_MENU', mainMenu),
    increaseZIndex: ({ commit }) => commit('INCREASE_MAX_ZINDEX'),
    showAlert: ({ commit }, prop) => {  //{msg, title, ok}
        let kv = prop;
        
        if(typeof kv === 'string') {
            kv = {
                msg: kv
            };
        }

        commit('SHOW_ALERT', kv);
    },
    hideAlert: ({ commit }) => commit('HIDE_ALERT'),
    showConfirm: ({ commit }, prop) => {    // {msg, title, ok, cancel}
        commit('SHOW_CONFIRM', prop)
    },
    hideConfirm: ({ commit }) => commit('HIDE_CONFIRM'),
    showLoading: ({ commit }, msg, html) => commit('SHOW_LOADING', msg),
    hideLoading: ({ commit }) => commit('HIDE_LOADING'),
    toast: ({ commit }, param) => {
  
        let kv = param;
    
        if(typeof kv === 'string') {
            kv = {
                msg: kv
            };
        }
        commit('SHOW_TOAST', kv)
    },
    hideToast: ({ commit }) => commit('HIDE_TOAST')
}
