(function($){
    $.fn.loadTemplate = function(rows=[], tag='ul', tmpl='' ) {
        let html = '';
        const text = tmpl||$(this).html();
        const slot = $(this).prop('slot')||this;
        
        if(tag==='table') {
            let th = $.templateRow(rows[0], '<th>{_key}</th>', '<tr>');
            let tr = $.templateRows(rows, text||'<td>{_val}</td>','<tr>');
            html = $(`<${tag}>`).append(th).append(tr);
        } else if(tag==='ul') {
            let li = $.templateRows(rows, text||'<li>{_val}</li>');
            html = $(`<${tag}>`).append(li);
        } else {
            let div = $.templateRows(rows, text||'<div>{_val}</div>');
            html = $(`<${tag}>`).append(div);
        }              
        return $(slot).html(html);
    }
    $.templateRows = function(rows, text, tag=''){ //2차원 객체 배열처리
        return rows.map(row => tag + $.templateRow(row, text)).join('');
    }
    $.templateRow = function(row, text, tag=''){ //{$key}=>val로 변경 1차원 객체처리
        if(typeof row === 'object') {
            if( text.includes("{_key}") ) return Object.keys(row).map(key => text.replace(`{_key}`, key)).join('');
            if( text.includes("{_val}") ) return Object.keys(row).map(key => text.replace(`{_val}`, row[key])).join('');
            return tag + Object.keys(row).reduce((acc, cur) => acc.replaceAll(`{${cur}}`, row[cur]), text);
        } else {
            return tag + text.replaceAll(`{_val}`, row);
        }
        return tag + $.templateAdapt(row, text);
    }
    // $.templateAdapt = function(row, text) {
    //     if(typeof row === 'object') {
    //         if( text.includes("{_key}") ) return Object.keys(row).map(key => text.replace(`{_key}`, key)).join('');
    //         if( text.includes("{_val}") ) return Object.keys(row).map(key => text.replace(`{_val}`, row[key])).join('');
    //         return Object.keys(row).reduce((acc, cur) => acc.replaceAll(`{${cur}}`, row[cur]), text);
    //     } else {
    //         return text.replaceAll(`{_val}`, row);
    //     }
    // }
}(jQuery));