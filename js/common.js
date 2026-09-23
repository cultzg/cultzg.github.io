
const current = Date.now();
const meta = `
    <meta charset="utf-8">
    <meta http-equiv="no-cache">
    <meta http-equiv="Pragma: no-cache">
    <meta http-equiv="Expires" content="0">
    <meta http-equiv="X-UA-Compatable" content="IE=edge">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="Cache-Control" content="no-cache,no-store,must-revalidate" />
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">`;
const head = document.getElementsByTagName('head')[0];
head.prepend(document.createRange().createContextualFragment(meta));

const cstyle = ['index.css'];
const script = ['jquery.min.js'];
script.forEach(js=>{
    const script = document.createElement('script');
    script.type='text/javascript'
    script.src = `/js/${js}?t=${current}`;
    head.appendChild(script);    
})
cstyle.forEach(css=>{
    const cstyle = document.createElement('link');
    cstyle.type = 'text/css';
    cstyle.rel = 'stylesheet'; 
    cstyle.href = `/css/${css}?t=${current}`;
    head.appendChild(cstyle);
});

//** Variable */
//const apis = document.location.hostname=='localhost' ?  'http://localhost:3000' : 'http://cultzg.duckdns.org/api';
const apis = 'http://localhost:3000';


/****
 * 서브 페이지 호출과 공용 함수
 */
function getPage(path='/main') { //서브페이지
    const param = new URLSearchParams(window.location.search);
    let cp = (param.get('cp')||path).replace(/\.html?$/i, '');
    const curl = new URL(cp=='/index' ? path : cp, document.location.href);
    $('section').load( curl.pathname + '.htm?' + curl.search + '&t=' + Date.now());
}

function setCommonUI() { //모달 창
    let log = '/log.htm';
    if(document.referer.include(log)) window.location.href=log;
    const modal = $('<div>').prop('id','modal').addClass('ui-modal');
    $(document.body).append(modal);
    $(document.body).on('click', evt => {
        if(evt.target===document.getElementById('modal')) {
            $('#modal').hide();
        }
    });
}

function getPagenation(page, total, listSize=10, pageSize=10) {
    const max = Math.ceil(total/listSize);              //최대페이지
    const mid = Math.floor(pageSize/2);                 //중간페이지
    const size= pageSize>max ? max : pageSize;          //출력갯수
    let sta = page > mid ? page-mid : 1;                //시작페이지
    let end = sta+size;                                 //끝페이지
    if(end > max) end=max;                              //최대초과시
    if(end-sta<size) sta=end-size+1;                    //max가까운곳 처리   
    return Array.from({length: size}, (_, i)=> sta+i);
}