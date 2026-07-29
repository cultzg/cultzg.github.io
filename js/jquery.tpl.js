!function($){
    $.fn.tpl = function(data){
        let html = $(this).html();
        let slot = $(this).attr('slot');
        if(URL.canParse(data)) return $(this).tpl_json(data);
        const result = Array.isArray(data) ? $(this).tpl_rows(html, data) : $(this).tpl_row(html, data)
        $(slot).html(result); //slot에 데이터값 적용된 html
    }
    $.fn.tpl_all = function(data) { //모든 템플릿 한꺼번에 적용
        $(this).each(function(i, el){
            let tpl_name = $(el).attr('name');
            let tpl_data = data[tpl_name]||{};
            $(el).tpl( tpl_data );
        });
    }
    $.fn.tpl_json = function(u) { //url로 결과받기
        fetch(u).then(res => res.json())
            .then(rows => $(this).tpl(rows))
            .catch((err)  =>  console.log("error", err));
    }
    $.fn.tpl_row = function(html, row){ //1차원 객체처리
        Object.keys(row).map(key => html=html.replaceAll(`\${${key}}`, row[key]));
        return html;
    }
    $.fn.tpl_rows = function(html, rows){ //2차원 객체 배열처리
        return rows.map(row => $(this).tpl_row(html, row));
    }
    $.fn.tpl_table = function(rows) {
        const th = '<tr>'+Object.keys(rows[0]).map(key => `<th>${key}</th>`)+'</tr>';
        const tr = rows.map(row => `<tr>${Object.keys(row).map(col => `<td>${row[col]}</td>`)}</tr>`);
        $(this).html(`<table>${th}${tr}</table>`);
    }
}(jQuery);