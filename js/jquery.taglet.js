(function($){

    $.taglet = {
        df: {
            th: '<th>{_key}</th>',
            td: '<td>{_val}</td>',
            li: '<li>{_val}</li>',
            div:'<div>{_val}</div>',
        },
        bind: function(data, text, tag=''){ //2차원 객체 배열처리
            if(Array.isArray(data)) {
                return data.map(row => tag + $.taglet.bind(row, text)).join('');
            } else {
                if(typeof data === 'object') {
                    if( text.includes("{_key}") ) return Object.keys(data).map(key => text.replace(`{_key}`, key)).join('');
                    if( text.includes("{_val}") ) return Object.keys(data).map(key => text.replace(`{_val}`, data[key])).join('');
                    return tag + Object.keys(data).reduce((acc, cur) => acc.replaceAll(`{${cur}}`, data[cur]), text);//객체 키로 참조할때
                } else {
                    return tag + text.replaceAll(`{_val}`, data);
                }
            }
        }
    }
    $.fn.loadTaglet = function(rows, tmpl, tag='ul' ) {
        let html = '';
        const text = tmpl||$(this).html();
        const slot = $(this).prop('slot')||this;
        
        if(tag==='table') {
            const th = $.taglet.bind(rows[0], text.replace(/[\{\}]/g,'').replaceAll('<td','<th')||$.taglet.df.th, '<tr>');
            const tr = $.taglet.bind(rows, text||$.taglet.df.td,'<tr>');
            html = $(`<${tag}>`).append(th).append(tr);
        } else if(tag==='ul') {
            const li = $.taglet.bind(rows, text||$.taglet.df.li);
            html = $(`<${tag}>`).append(li);
        } else {
            const div = $.taglet.bind(rows, text||$.taglet.df.div);
            html = $(`<${tag}>`).append(div);
        }              
        return $(slot).html(html);
    }

    $.fn.treeTaglet = function(rows=[], tmpl='') {
        function createTree(rows, el) {
            const ul = $('<ul>').addClass('tree');
            rows.forEach(row => {
                const li = $('<li>');
                if( row.type === 'folder' ) {
                    const folder = $('<span>').text(row.name).addClass('folder');
                    $(li).append(folder);
                    const nested = $('<div>').addClass('nested');
                    createTree( row.children, nested );
                    $(li).append(nested);
                    $(folder).on('click', e=> {
                        e.stopPropagation(); // 이벤트 버블링 방지
                        $(folder).toggleClass('open');
                        $(nested).toggleClass('active');
                    });
                } else { //(row.type === 'item' )
                    $(li).append($.taglet.bind(row, tmpl));
                }
                $(ul).append(li);
            });
            $(el).append(ul);
        }
        createTree(rows, this);
        return this;
    }

    $.fn.modalTaglet = function(row) {
        const html = $(this).prop('outerHTML');
        const tmpl = $.taglet.bind(row, html);
        $('#modal').html(tmpl);
        const button = $('<button onClick=$("#modal").hide()>닫기</button>').addClass('center');
        const div = $('<div>').addClass('flex center').append(button);
        $('#modal div.ui-modal-content').append(div);
        $('#modal .ui-modal-content').show();
        $('#modal').css('display','flex');
    }
}(jQuery));