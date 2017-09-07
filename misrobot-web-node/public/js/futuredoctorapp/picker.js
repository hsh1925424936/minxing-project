//------------------仅用于todo.html---------------------

(function(win, doc) {

	function $(str) {
		return doc.querySelector(str)
	}

    function EasyPicker(opt) {
        this.input = $(opt.input);
        this.data = opt.data;
        this.callback = opt.callback

        this.startY = 0;
        this.lastOffset = 0;
        this.limit = 60;
        this.itemHeight = 0;

        this.renderDoms();
        this.initEvent();
    }

    EasyPicker.prototype = {
        constructor: EasyPicker,
        renderDoms: function() {
            var scrollDoms = '<li></li><li></li>';

            for (var i = 0; i < this.data.length; i++) {
                scrollDoms += '<li>' + this.data[i].taskname + '</li>';
            }

            $('#scrollArea').innerHTML = scrollDoms;

            this.itemHeight = $('#scrollArea li').clientHeight
        },
        initEvent: function() {
        	var self = this,
        		bg = $('.picker-modal'),
                wrap = $('.picker-wrap'),
        		scroll = $('#scrollArea'),
                confirmBtn = $('#confirm'),
                cancelBtn = $('#cancel');

        	this.input.addEventListener('touchstart', function(e) {
        		bg.classList.add('picker-modal-show');
        		wrap.classList.add('picker-wrap-show');
        	}, false)

            wrap.addEventListener('touchstart', function(e) {
                e.stopPropagation();
                e.preventDefault();
            }, false)

            confirmBtn.addEventListener('touchstart', function(e) {

                var index = Math.abs(self.lastOffset / self.itemHeight)

                bg.classList.remove('picker-modal-show');
                wrap.classList.remove('picker-wrap-show');

                self.callback(self.data[index])
            }, false)

            cancelBtn.addEventListener('touchstart', function(e) {

                bg.classList.remove('picker-modal-show');
                wrap.classList.remove('picker-wrap-show');

            }, false)

        	bg.addEventListener('touchstart', function(e) {
        		e.stopPropagation();
        		e.preventDefault();

        		bg.classList.remove('picker-modal-show');
        		wrap.classList.remove('picker-wrap-show');
        	}, false)

        	scroll.addEventListener('touchstart', function(e) {

        		self.startY = e.targetTouches[0].pageY;
        	}, false);

        	scroll.addEventListener('touchmove', function(e) {

        		var offset = e.targetTouches[0].pageY - self.startY,
	                distance = offset + self.lastOffset;

	            if (distance > self.limit) {
	                distance = self.limit
	            }

	            if (distance < -((self.data.length - 1) * self.itemHeight + self.limit)) {
	                distance = -((self.data.length - 1) * self.itemHeight + self.limit)
	            }

	            scrollArea.style.transform = 'translate3d(0, ' + distance + 'px, 0)'
        	}, false);

        	scroll.addEventListener('touchend', function(e) {
        		self.lastOffset += e.changedTouches[0].clientY - self.startY

	            if (self.lastOffset > 0) {
	                self.lastOffset = 0
	            }

	            if (Math.abs(self.lastOffset) % 36 !== 0) {
	                self.lastOffset = -(parseInt(Math.abs(self.lastOffset) / self.itemHeight) * self.itemHeight)
	            }

	            if (self.lastOffset < -((self.data.length - 1) * self.itemHeight)) {
	                self.lastOffset = -((self.data.length - 1) * self.itemHeight)
	            }

	            if (self.lastOffset > 0) return

	            scrollArea.style.transform = 'translate3d(0, ' + self.lastOffset + 'px, 0)'
        	}, false)
        }
    }

    win.EasyPicker = EasyPicker

})(window, document)
