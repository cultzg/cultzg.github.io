!function($){
    $.fn.tpl = function(data={}) {
        $(this).each(function(i, el){
            let slot = $(el).attr('slot');
            const html = Array.isArray(data) ? $(this).tpl_rows(data) : $(this).tpl_row(data);
            return $(slot).html(html);
        });
    }
    $.fn.tpl_row = function(row){ //{$key}=>val로 변경 1차원 객체처리
        let html = $(this).html();
        Object.keys(row).map(key => html=html.replaceAll(`{${key}}`, row[key])).join('');
        return html;
    }
    $.fn.tpl_rows = function(rows){ //2차원 객체 배열처리
        return rows.map(row => $(this).tpl_row(row));
    }
    $.fn.tpl_table = function(rows) {
        let tr = '';
        let slot = $(this).attr('slot');
        tr += rows.map(row => $(this).tpl_row(row));
        return $(slot).html(tr);
    }
}(jQuery);