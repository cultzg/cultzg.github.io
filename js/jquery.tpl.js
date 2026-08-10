(function($){

    $.fn.tpl = function(rows=[], tag='<ul>') {
        let $el = $(this);
        let tmpl = $el.html();
        if(tag==='<table>')     {
            tmpl = $().tpl.table(rows, tmpl);
        } else if(tag==='<ul>') {
            tmpl = $().tpl.rows(rows, tmpl||'<li>{_val}</li>');
        } else {
            tmpl = $().tpl.rows(rows, tmpl||'<div>');
        }                   
        $el.html($(tag).append(tmpl));
    }

    $.fn.tpl.rows = function(rows, html){ //2차원 객체 배열처리
        return rows.map(row => $().tpl.row(row, html)).join('');
    }
    $.fn.tpl.row = function(row, html){ //{$key}=>val로 변경 1차원 객체처리
        return $().tpl.replace(row, html);
    }
    $.fn.tpl.replace = function(row, str) {
        if( str.includes("{_key}") ) return Object.keys(row).map(key => str.replace(`{_key}`, key)).join('');
        if( str.includes("{_val}") ) return Object.keys(row).map(key => str.replace(`{_val}`, row[key])).join('');
        return Object.keys(row).reduce((acc, cur) => acc.replaceAll(`{${cur}}`, row[cur]), str);
    }
    $.fn.tpl.table = function(rows, str='<td>{_val}</td>') {
        const th = '<tr>'+$().tpl.replace(rows[0], '<th>{_key}</th>');
        const tr = rows.map(row => '<tr>'+$().tpl.replace(row, str)).join('');
        return th + tr; 
    }
}(jQuery));