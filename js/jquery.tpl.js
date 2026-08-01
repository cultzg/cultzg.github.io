!function($){
    $.fn.tpl = function(data={}, type='tpl') {
        $(this).each(function(i, el){
            let slot = $(el).attr('slot') ? $(el).attr('slot') : this;
            let html = $(this).html()||'';
            if(Array.isArray(data)) {
                if(type==='table') {
                    html = $(this).tpl.table(data);
                } else if(type==='ul') {
                    html = $(this).tpl.ul(data);
                } else {
                    html = $(this).tpl.rows(data);
                }
            } else {
                html = $(this).tpl.row(data);
            }
            return $(slot).html(html);
        });
    }
    $.fn.tpl.row = function(row){ //{$key}=>val로 변경 1차원 객체처리
        let html = $(this).html()||'';
        Object.keys(row).map(key => html=html.replaceAll(`{${key}}`, row[key])).join('');
        return html;
    }
    $.fn.tpl.rows = function(rows){ //2차원 객체 배열처리
        return rows.map(row => $(this).tpl.row(row)).join('');
    }
    $.fn.tpl.li = function(row) {
        return '<ul>'+Object.keys(row).map(key => '<li>{_val}</li>'.replace(`{_val}`, row[key])).join('');
    }
    $.fn.tpl.ul = function(rows) {
        return rows.map(row => $(this).tpl.li(row)).join('</ul>');
    }
    $.fn.tpl.th = function(row) {
        return '<tr>'+Object.keys(row).map(key => '<th>{_key}</th>'.replace(`{_key}`, key)).join('');
    }
    $.fn.tpl.td = function(row) {
        return '<tr>'+Object.keys(row).map(key => '<td>{_val}</td>'.replace(`{_val}`, row[key])).join('');
    }
    $.fn.tpl.table = function(rows) {
        return '<table>'+ $(this).tpl.th(rows[0]) + rows.map(row => $(this).tpl.td(row)).join(''); 
    }
}(jQuery);