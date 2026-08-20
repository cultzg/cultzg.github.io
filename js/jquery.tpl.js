(function($){
    $.fn.tpl = function(rows=[], tag='ul') {
        var html = '';
        const tmpl = $(this).html();
        const slot = $(this).prop('slot')||this;
        //console.log(tmpl);
        
        if(tag==='table')     {
            let th = '';//'<tr>'+$().tpl.row(rows[0], tmpl||'<th>{_key}</th>');
            let tr = $().tpl.rows(rows, tmpl||'<td>{_val}</td>','<tr>');
            html = $('<table>').append(th).append(tr);
        } else {
            let child = $().tpl.rows(rows, tmpl||'<li>{_val}</li>');
            html = $(`<${tag}>`).append(child);
        }                  
        return $(slot).html(html);
        //return this;
    }
    $.fn.tpl.rows = function(rows, html, pre=''){ //2차원 객체 배열처리
        return rows.map(row => pre+$().tpl.row(row, html)).join('');
    }
    $.fn.tpl.row = function(row, html){ //{$key}=>val로 변경 1차원 객체처리
        return $().tpl.replace(row, html);
    }
    $.fn.tpl.replace = function(row, str) {
        if( str.includes("{_key}") ) return Object.keys(row).map(key => str.replace(`{_key}`, key)).join('');
        if( str.includes("{_val}") ) return Object.keys(row).map(key => str.replace(`{_val}`, row[key])).join('');
        return Object.keys(row).reduce((acc, cur) => acc.replaceAll(`{${cur}}`, row[cur]), str);
    }
}(jQuery));