(function(){
    var viewport = document.querySelector("meta[name=viewport]");

    var doc = window.document,
        r = doc.documentElement,
        n = window.navigator.appVersion.match(/iphone/gi),
        v = window.devicePixelRatio;

    if(viewport) {
        var o = viewport.getAttribute("content").match(/initial\-scale=(["']?)([\d\.]+)\1?/);
        o && (window.viewScale = parseFloat(o[2]), v = parseInt(1 / window.viewScale));
    } else {
        v = n ? v >= 3 ? 3 : v >= 2 ? 2 : 1 : 1;
        window.viewScale = 1 / v;
        viewport = document.createElement("meta");
        viewport.setAttribute("name", "viewport");
        viewport.setAttribute("content", "initial-scale=" + viewScale + ", maximum-scale=" + viewScale + ", minimum-scale=" + viewScale + ", user-scalable=no");
        document.documentElement.firstElementChild.appendChild(viewport);
    }

    function w() {
        var a = r.getBoundingClientRect().width;
        a / v > 540 && (a = 540 * v);
        var u = a / v;
        //414, 376, 320
        a = u <= 320 ? a * 1.2 : u <= 376 ? a * 1.05 : a;
        
        if(v == 1) {
            window.rem = 60;
        } else {
            window.rem = a / 16 * 2.5532;
        }
        
        r.style.fontSize = window.rem + "px";
    }

    w();




    /*window.viewScale = 1;
    var htmlFontSize = 60;
    var pratio = window.devicePixelRatio;
    if(viewport) {
        //var o = viewport.getAttribute("content").match(/initial\-scale=(["']?)([\d\.]+)\1?/);
        //o && (viewScale = parseFloat(o[2]), pratio = parseInt(1 / viewScale));
    } else {
        if(window.navigator.appVersion.match(/iphone/gi)) {
            pratio = pratio >= 3 ? 3 : pratio >= 2 ? 2 : 1;
            viewScale = 1/pratio;
            htmlFontSize *= pratio;
        }
        
        viewport = document.createElement("meta");
        viewport.setAttribute("name", "viewport");
        viewport.setAttribute("content", "target-densitydpi=device-dpi,initial-scale=" + viewScale + ", maximum-scale=" + viewScale + ", minimum-scale=" + viewScale + ", user-scalable=no");
        document.documentElement.firstElementChild.appendChild(viewport);
        document.querySelector('html').style.fontSize = htmlFontSize + 'px';
    }*/
})();
