;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-arrow_unfold" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M537.415 689.735l277.532-277.532c6.439-6.431 10.422-15.319 10.422-25.138s-3.983-18.707-10.422-25.137c-6.431-6.439-15.319-10.422-25.138-10.422-9.819 0-18.707 3.983-25.137 10.422l-252.388 252.388-252.388-252.388c-6.433-6.452-15.33-10.443-25.159-10.443-19.621 0-35.527 15.906-35.527 35.527 0 0.022 0 0.043 0 0.065-0 9.099 3.47 18.201 10.411 25.142l277.518 277.532c6.432 6.431 15.317 10.409 25.131 10.409 9.821 0 18.712-3.983 25.145-10.423z" fill="#040000" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-up" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M871.552 440.988444L537.173333 106.609778a36.181333 36.181333 0 0 0-5.475555-4.48c-0.796444-0.526222-1.649778-0.881778-2.474667-1.351111-1.194667-0.668444-2.360889-1.393778-3.640889-1.92-1.109333-0.455111-2.275556-0.711111-3.413333-1.052445-1.066667-0.327111-2.104889-0.739556-3.214222-0.952889a35.811556 35.811556 0 0 0-6.855111-0.696889L512 96.142222c-2.332444 0-4.664889 0.241778-6.968889 0.696889-1.038222 0.213333-2.005333 0.597333-3.000889 0.896-1.208889 0.355556-2.446222 0.64-3.626666 1.123556-1.208889 0.497778-2.289778 1.180444-3.427556 1.806222-0.896 0.497778-1.834667 0.881778-2.688 1.464889a35.811556 35.811556 0 0 0-5.461333 4.465778L152.448 440.988444a35.527111 35.527111 0 0 0 25.144889 60.686223c9.102222 0 18.204444-3.470222 25.144889-10.410667L476.444444 217.543111v683.192889a35.555556 35.555556 0 1 0 71.111112 0V217.543111l273.720888 273.720889c6.940444 6.940444 16.042667 10.410667 25.144889 10.410667s18.190222-3.470222 25.144889-10.410667a35.541333 35.541333 0 0 0-0.014222-50.275556z" fill="" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-list" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M120.888889 180.152889H910.222222a35.555556 35.555556 0 1 0 0-71.111111H120.888889a35.555556 35.555556 0 1 0 0 71.111111zM910.222222 478.819556H120.888889a35.555556 35.555556 0 1 0 0 71.111111H910.222222a35.555556 35.555556 0 1 0 0-71.111111zM910.222222 862.819556H120.888889a35.555556 35.555556 0 1 0 0 71.111111H910.222222a35.555556 35.555556 0 1 0 0-71.111111z" fill="#040000" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-arrow_next" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M697.529 479.374l-277.532-277.547c-6.431-6.439-15.319-10.422-25.138-10.422s-18.707 3.983-25.137 10.422c-6.439 6.431-10.422 15.319-10.422 25.138 0 9.819 3.983 18.707 10.422 25.137l252.388 252.402-252.388 252.388c-6.452 6.433-10.443 15.33-10.443 25.159 0 19.621 15.906 35.527 35.527 35.527 0.022 0 0.043-0 0.065-0 9.099 0 18.201-3.47 25.142-10.411l277.532-277.518c6.428-6.433 10.403-15.318 10.403-25.131 0-9.82-3.981-18.71-10.417-25.145z" fill="#040000" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-close" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M558.72 514.375l344.633-344.647c6.439-6.431 10.422-15.319 10.422-25.138s-3.983-18.707-10.422-25.137c-6.431-6.439-15.319-10.422-25.138-10.422-9.819 0-18.707 3.983-25.137 10.422l-344.633 344.647-344.633-344.647c-6.431-6.439-15.319-10.422-25.138-10.422s-18.707 3.983-25.137 10.422c-6.439 6.431-10.422 15.319-10.422 25.138 0 9.819 3.983 18.707 10.422 25.137l344.633 344.647-344.647 344.633c-6.452 6.433-10.443 15.33-10.443 25.159 0 19.621 15.906 35.527 35.527 35.527 0.022 0 0.043 0 0.065 0 9.099 0 18.201-3.47 25.142-10.411l344.633-344.633 344.633 344.647c6.94 6.94 16.043 10.411 25.145 10.411s18.19-3.47 25.145-10.411c6.439-6.431 10.422-15.319 10.422-25.138 0-9.819-3.983-18.707-10.422-25.137l-344.647-344.647z" fill="#040000" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-pop_close" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M569.387 512l189.554-189.554c6.439-6.431 10.422-15.319 10.422-25.138s-3.983-18.707-10.422-25.137c-6.431-6.439-15.319-10.422-25.138-10.422-9.819 0-18.707 3.983-25.137 10.422l-189.554 189.554-189.554-189.554c-6.431-6.439-15.319-10.422-25.138-10.422s-18.707 3.983-25.137 10.422c-6.439 6.431-10.422 15.319-10.422 25.138 0 9.819 3.983 18.707 10.422 25.137l189.554 189.554-189.554 189.554c-6.452 6.433-10.443 15.33-10.443 25.159 0 19.621 15.906 35.527 35.527 35.527 0.022 0 0.043-0 0.065-0 9.099 0 18.201-3.47 25.142-10.411l189.54-189.554 189.554 189.554c6.94 6.94 16.043 10.411 25.145 10.411s18.19-3.47 25.145-10.411c6.439-6.431 10.422-15.319 10.422-25.138 0-9.819-3.983-18.707-10.422-25.137l-189.568-189.554z" fill="#040000" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)