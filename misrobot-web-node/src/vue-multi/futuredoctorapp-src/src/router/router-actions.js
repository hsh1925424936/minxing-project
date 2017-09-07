let getMenuCode = (path) => {
    for (let p in mainMenuMap) {
        let regExp = new RegExp(p)
        if (regExp.test(path)) return mainMenuMap[p]
    }
    return 'home'
}

export default function (router) {

  router.afterEach(route => {
      console.log(`成功浏览到: ${route.path}`);
      // $.refreshScroller()
      // store.commit('CHANGE_MAIN_MENU', getMenuCode([route.path]))
      // store.commit('CHANGE_MENU_HIDE', getIsHidePage(route.path))
   })
}
