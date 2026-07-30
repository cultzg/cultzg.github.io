!function($){
    $.fn.tpl = function(data={}, type='tpl') {
        $(this).each(function(i, el){
            let slot = $(el).attr('slot') ? $(el).attr('slot') : this;
            let html = $(this).html()||'';
            if(Array.isArray(data)) {
                if(type==='table') {
                    html = $(this).tpl_table(data);
                } else if(type==='ul') {
                    html = $(this).tpl_ul(data);
                } else {
                    html = $(this).tpl_rows(data);
                }
            } else {
                html = $(this).tpl_row(data);
            }
            return $(slot).html(html);
        });
    }
    $.fn.tpl_row = function(row){ //{$key}=>val로 변경 1차원 객체처리
        let html = $(this).html()||'';
        Object.keys(row).map(key => html=html.replaceAll(`{${key}}`, row[key])).join('');
        return html;
    }
    $.fn.tpl_rows = function(rows){ //2차원 객체 배열처리
        return rows.map(row => $(this).tpl_row(row)).join('');
    }
    $.fn.tpl_li = function(row) {
        return '<ul>'+Object.keys(row).map(key => '<li>{_val}</li>'.replace(`{_val}`, row[key])).join('');
    }
    $.fn.tpl_ul = function(rows) {
        return rows.map(row => $(this).tpl_li(row)).join('</ul>');
    }
    $.fn.tpl_th = function(row) {
        return '<tr>'+Object.keys(row).map(key => '<th>{_key}</th>'.replace(`{_key}`, key)).join('');
    }
    $.fn.tpl_td = function(row) {
        return '<tr>'+Object.keys(row).map(key => '<td>{_val}</td>'.replace(`{_val}`, row[key])).join('');
    }
    $.fn.tpl_table = function(rows) {
        return '<table>'+ $(this).tpl_th(rows[0]) + rows.map(row => $(this).tpl_td(row)).join(''); 
    }
}(jQuery);