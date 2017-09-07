(function() {
    $.extend(jQuery.jgrid.defaults, {
        mtype: "GET",
        datatype: "json",
        jsonReader: {
            repeatitems: false
        },
        prmNames: {
            rows:"sizePerPage",
            page:"requestPage",
            sort:"sortField",
            order:"sortDir"
        },
        //altRows: true,
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        
        rownumbers: true,
        autowidth: true,
        height: "auto",
        autoencode: false,
        hoverrows: false,
        loadui: "block",
        hidegrid: false,
        viewrecords: true,
        
        pagerpos: 'center',
        recordpos: 'right',
        
        pgbuttons: true,
        pginput: true,
        
        gridview: true, // must be false for treeGrid, subGrid.
        //caption: 'List Of Records',
        emptyrecords: '没有找到记录',
        
        pager: "#gridListNav", 
        
        onSelectRow: function(rowid, e) {
            $('#'+rowid).parents('table').resetSelection();
        }
    });
})();